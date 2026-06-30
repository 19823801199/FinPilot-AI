# -*- coding: utf-8 -*-
"""FinPilot AI API - RAG 服务模块（Embedding + ChromaDB + LLM）"""

import time
import uuid
from typing import Dict, List, Optional

from core.ai_client import ai_client
from core.logger import logger
from services.chroma_service import chroma_service


class RAGService:
    """RAG 服务类，整合文本切块、Embedding、向量检索与 LLM 生成"""

    async def ingest_document(
        self,
        content: str,
        metadata: Dict,
        chunk_size: int = 500,
        chunk_overlap: int = 50,
    ) -> List[str]:
        """文档摄入：切块 -> Embedding -> 写入 ChromaDB

        Args:
            content: 原始文档内容
            metadata: 文档元数据（如 category、tags、document_name 等）
            chunk_size: 每块最大字符数
            chunk_overlap: 块之间重叠字符数

        Returns:
            写入的 chunk ID 列表
        """
        # 1. 文本切块
        chunks = self._chunk_text(content, chunk_size, chunk_overlap)
        if not chunks:
            logger.warning("文档内容为空，未生成任何 chunk")
            return []

        # 3. 构造 metadatas 与 ids
        chunk_ids = [str(uuid.uuid4()) for _ in chunks]
        metadatas: List[Dict] = []
        for idx, chunk_id in enumerate(chunk_ids):
            meta = dict(metadata)
            meta["chunk_index"] = idx
            meta["chunk_id"] = chunk_id
            metadatas.append(meta)

        # 4. 写入 ChromaDB
        try:
            stored_ids = chroma_service.add_documents(
                documents=chunks,
                metadatas=metadatas,
                ids=chunk_ids,
            )
            logger.info(f"文档摄入完成，共 {len(stored_ids)} 个 chunk")
            return stored_ids
        except Exception as exc:
            logger.error(f"写入 ChromaDB 失败: {exc}")
            raise

    async def query(
        self,
        query: str,
        top_k: int = 5,
        category: Optional[str] = None,
    ) -> Dict:
        """RAG 查询：检索 -> 组装上下文 -> LLM 生成回答

        Args:
            query: 用户查询文本
            top_k: 检索返回的片段数量
            category: 可选的文档分类过滤条件

        Returns:
            包含 answer 与 sources 的字典
        """
        start_time = time.time()

        # 2. 向量检索
        where_filter: Optional[Dict] = None
        if category:
            where_filter = {"category": category}

        try:
            retrieval_results = chroma_service.query(
                query_text=query,
                n_results=top_k,
                where=where_filter,
            )
        except Exception as exc:
            logger.error(f"向量检索失败: {exc}")
            return {
                "answer": "抱歉，知识库检索过程中出现错误，请稍后重试。",
                "sources": [],
            }

        if not retrieval_results:
            return {
                "answer": (
                    f"抱歉，知识库中暂未找到与『{query}』高度相关的内容。"
                    "建议您尝试更具体的查询关键词，或上传相关文档以丰富知识库。"
                ),
                "sources": [],
            }

        # 3. 组装 context
        context_parts: List[str] = []
        sources: List[Dict] = []
        for idx, result in enumerate(retrieval_results):
            context_parts.append(
                f"[片段 {idx + 1}]\n{result['document']}"
            )
            sources.append({
                "chunk_id": result["id"],
                "document_name": result["metadata"].get("document_name", "未知文档"),
                "category": result["metadata"].get("category", ""),
                "content": result["document"],
                "distance": result["distance"],
            })

        context = "\n\n".join(context_parts)

        # 4. 调用 LLM 生成回答
        system_prompt = (
            "你是一位专业的金融 AI 助手。请根据以下提供的知识库片段回答用户问题。"
            "如果知识库中没有足够信息，请明确告知用户。"
            "回答时请保持客观、专业，并尽可能引用片段中的数据。"
        )
        user_prompt = (
            f"用户问题：{query}\n\n"
            f"===== 知识库片段 =====\n{context}\n\n"
            "请基于以上片段生成回答："
        )

        try:
            answer = await ai_client.chat(
                messages=[{"role": "user", "content": user_prompt}],
                system_prompt=system_prompt,
                temperature=0.3,
            )
        except Exception as exc:
            logger.error(f"LLM 生成回答失败: {exc}")
            answer = (
                "抱歉，AI 生成回答时出现错误。以下是检索到的相关片段，供您参考：\n\n"
                + context
            )

        response_time = round(time.time() - start_time, 3)
        logger.info(f"RAG 查询完成，耗时 {response_time}s，检索到 {len(sources)} 条结果")

        return {
            "answer": answer,
            "sources": sources,
            "response_time": response_time,
        }

    def _chunk_text(self, text: str, size: int, overlap: int) -> List[str]:
        """简单文本切块（滑动窗口）

        Args:
            text: 原始文本
            size: 每块最大字符数
            overlap: 块之间重叠字符数

        Returns:
            切块后的文本列表
        """
        if not text:
            return []

        chunks: List[str] = []
        step = max(1, size - overlap)
        start = 0
        text_length = len(text)

        while start < text_length:
            end = min(start + size, text_length)
            chunk = text[start:end]
            chunks.append(chunk)
            if end == text_length:
                break
            start += step

        return chunks


# 全局单例实例
rag_service = RAGService()
