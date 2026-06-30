# -*- coding: utf-8 -*-
"""FinPilot AI API - 统一 AI Client 封装 (Sprint 7)"""

import asyncio
import random
import re
from typing import AsyncGenerator, Dict, List, Optional

from openai import APIConnectionError, APIError, AsyncOpenAI, RateLimitError

from core.config import settings
from core.logger import logger


class AIClient:
    """统一 AI Client，兼容 DeepSeek API（OpenAI SDK 格式）"""

    def __init__(self) -> None:
        api_key = settings.DEEPSEEK_API_KEY or "sk-demo-key"
        self.client = AsyncOpenAI(
            api_key=api_key,
            base_url=settings.DEEPSEEK_BASE_URL,
            timeout=settings.DEEPSEEK_TIMEOUT,
        )
        self.model = settings.DEEPSEEK_MODEL
        self.max_retries = settings.DEEPSEEK_MAX_RETRIES

    # ------------------------------------------------------------------ #
    # 内部辅助方法
    # ------------------------------------------------------------------ #

    def _build_messages(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
    ) -> List[Dict[str, str]]:
        """在 messages 前插入 system_prompt（如提供）。"""
        msgs = list(messages)
        if system_prompt:
            msgs.insert(0, {"role": "system", "content": system_prompt})
        return msgs

    async def _retry_with_backoff(
        self,
        coro,
        max_retries: Optional[int] = None,
    ):
        """指数退避重试逻辑。"""
        retries = max_retries if max_retries is not None else self.max_retries
        last_exception: Optional[Exception] = None

        for attempt in range(1, retries + 1):
            try:
                return await coro
            except (APIConnectionError, APIError, RateLimitError) as exc:
                last_exception = exc
                wait_time = (2 ** attempt) + random.uniform(0, 1)
                logger.warning(
                    f"AIClient 请求失败 (attempt {attempt}/{retries}): {exc}. "
                    f"等待 {wait_time:.1f}s 后重试..."
                )
                await asyncio.sleep(wait_time)
            except Exception as exc:
                logger.error(f"AIClient 发生未预期错误: {exc}")
                raise

        logger.error(f"AIClient 在 {retries} 次重试后仍然失败: {last_exception}")
        raise last_exception  # type: ignore[misc]

    # ------------------------------------------------------------------ #
    # 公共 API
    # ------------------------------------------------------------------ #

    async def chat(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        stream: bool = False,
    ) -> str:
        """非流式对话。

        Args:
            messages: 对话历史，格式为 [{"role": "user", "content": "..."}, ...]
            system_prompt: 可选的系统提示词，将插入到 messages 开头。
            temperature: 采样温度，默认 0.7。
            max_tokens: 最大生成 token 数。
            stream: 是否流式输出（本方法始终返回完整字符串）。

        Returns:
            AI 生成的完整回复文本。

        Raises:
            APIConnectionError / APIError / RateLimitError: 在重试耗尽后抛出。
        """
        msgs = self._build_messages(messages, system_prompt)

        async def _call():
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=msgs,  # type: ignore[arg-type]
                temperature=temperature,
                max_tokens=max_tokens,
                stream=stream,
            )
            if stream:
                content_parts: List[str] = []
                async for chunk in response:
                    delta = chunk.choices[0].delta.content
                    if delta:
                        content_parts.append(delta)
                return "".join(content_parts)
            return response.choices[0].message.content or ""

        result = await self._retry_with_backoff(_call())
        logger.info(f"AIClient.chat 完成，输出 token 约 {self.count_tokens(result)}")
        return result

    async def chat_stream(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
    ) -> AsyncGenerator[str, None]:
        """流式对话，逐 token yield。

        Args:
            messages: 对话历史。
            system_prompt: 可选系统提示词。
            temperature: 采样温度。
            max_tokens: 最大生成 token 数。

        Yields:
            每个生成的文本片段（token）。
        """
        msgs = self._build_messages(messages, system_prompt)

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=msgs,  # type: ignore[arg-type]
                temperature=temperature,
                max_tokens=max_tokens,
                stream=True,
            )
            async for chunk in response:
                delta = chunk.choices[0].delta.content
                if delta:
                    yield delta
        except (APIConnectionError, APIError, RateLimitError) as exc:
            logger.error(f"AIClient.chat_stream 请求异常: {exc}")
            raise
        except Exception as exc:
            logger.error(f"AIClient.chat_stream 未预期错误: {exc}")
            raise

    async def embed(self, texts: List[str]) -> List[List[float]]:
        """获取文本的 Embedding 向量。

        如果未配置 API Key，则返回随机向量作为 fallback（仅用于开发/测试）。

        Args:
            texts: 待嵌入的文本列表。

        Returns:
            每个文本对应的 embedding 向量列表。
        """
        if not settings.DEEPSEEK_API_KEY:
            logger.warning("DEEPSEEK_API_KEY 未配置，使用随机向量 fallback")
            dim = 1536  # 与 text-embedding-ada-002 维度一致
            return [[random.uniform(-1.0, 1.0) for _ in range(dim)] for _ in texts]

        async def _call():
            response = await self.client.embeddings.create(
                model="text-embedding-ada-002",
                input=texts,
            )
            return [item.embedding for item in response.data]

        return await self._retry_with_backoff(_call())

    @staticmethod
    def count_tokens(text: str) -> int:
        """简单 token 估算。

        - 中文字符：每个字计 1 token
        - 英文单词：按空白分隔计词
        - 标点/数字：按字符计

        Args:
            text: 待估算的文本。

        Returns:
            估算的 token 数量。
        """
        if not text:
            return 0

        # 中文字符
        chinese_chars = len(re.findall(r"[\u4e00-\u9fff]", text))

        # 移除中文字符后按英文词拆分
        remaining = re.sub(r"[\u4e00-\u9fff]", " ", text)
        english_words = len([w for w in remaining.split() if w.strip()])

        # 数字和标点（粗略估算：每 4 个字符 1 token）
        other_chars = len(re.findall(r"[0-9\p{P}]", text))
        other_tokens = other_chars // 4 + (1 if other_chars % 4 else 0)

        return chinese_chars + english_words + other_tokens


# 全局单例
ai_client = AIClient()
