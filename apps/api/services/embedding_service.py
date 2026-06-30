# -*- coding: utf-8 -*-
"""FinPilot AI API - Embedding 服务模块"""

import random
from typing import List


class EmbeddingService:
    """Embedding 服务类，提供文本向量化功能（Mock 实现）"""

    def __init__(self) -> None:
        """初始化 Embedding 服务"""
        self._dimension = 768  # 向量维度

    def embed_texts(self, texts: List[str]) -> List[List[float]]:
        """将文本列表转换为向量列表（Mock 实现）

        在实际生产环境中，可替换为以下 Embedding 服务：
        - DeepSeek Embedding: 通过 DeepSeek API 获取文本向量
        - OpenAI Embedding: 使用 text-embedding-3-large 模型
        - BGE Embedding: 使用 BAAI/bge-large-zh-v1.5 开源模型

        Args:
            texts: 待向量化的文本列表

        Returns:
            向量列表，每个向量为 768 维浮点数列表
        """
        embeddings: List[List[float]] = []
        for text in texts:
            # 使用文本特征生成伪随机但确定的向量
            seed = hash(text) % (2**32)
            rng = random.Random(seed)
            vector = [rng.gauss(0, 1) for _ in range(self._dimension)]
            # L2 归一化
            norm = sum(v * v for v in vector) ** 0.5
            if norm > 0:
                vector = [v / norm for v in vector]
            embeddings.append(vector)
        return embeddings

    def embed_query(self, text: str) -> List[float]:
        """将查询文本转换为向量（Mock 实现）

        在实际生产环境中，可替换为以下 Embedding 服务：
        - DeepSeek Embedding: 通过 DeepSeek API 获取查询向量
        - OpenAI Embedding: 使用 text-embedding-3-large 模型
        - BGE Embedding: 使用 BAAI/bge-large-zh-v1.5 开源模型

        Args:
            text: 查询文本

        Returns:
            768 维浮点数向量
        """
        return self.embed_texts([text])[0]


# 全局单例实例
embedding_service = EmbeddingService()
