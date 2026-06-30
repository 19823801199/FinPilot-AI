# -*- coding: utf-8 -*-
"""FinPilot AI API - ChromaDB 向量数据库服务模块 (Fallback 版本)"""

import uuid
from typing import Dict, List, Optional

from core.logger import logger


class ChromaService:
    """ChromaDB 向量数据库服务类（当 chromadb 未安装时使用内存 fallback）"""

    def __init__(self, persist_path: str = "./chroma_data") -> None:
        """初始化 ChromaDB 客户端与 Collection"""
        try:
            import chromadb
            from chromadb.config import Settings as ChromaSettings
            self.client = chromadb.PersistentClient(
                path=persist_path,
                settings=ChromaSettings(anonymized_telemetry=False),
            )
            self.collection = self._get_or_create_collection()
            self._fallback = False
        except ImportError:
            logger.warning("chromadb not installed, using in-memory fallback")
            self._fallback = True
            self._documents: Dict[str, Dict] = {}

    def _get_or_create_collection(self):
        """获取或创建名为 'finpilot_knowledge' 的 Collection"""
        try:
            collection = self.client.get_collection(name="finpilot_knowledge")
            logger.info("成功获取已存在的 Collection: finpilot_knowledge")
        except Exception:
            collection = self.client.create_collection(
                name="finpilot_knowledge",
                metadata={"description": "FinPilot AI 知识库向量存储"},
            )
            logger.info("成功创建新 Collection: finpilot_knowledge")
        return collection

    def add_documents(
        self,
        documents: List[str],
        metadatas: Optional[List[Dict]] = None,
        ids: Optional[List[str]] = None,
    ) -> List[str]:
        """添加文档到 Collection"""
        if self._fallback:
            doc_ids = ids or [str(uuid.uuid4()) for _ in documents]
            for i, doc in enumerate(documents):
                self._documents[doc_ids[i]] = {
                    "document": doc,
                    "metadata": metadatas[i] if metadatas else {},
                }
            return doc_ids
        if ids is None:
            ids = [str(uuid.uuid4()) for _ in documents]
        self.collection.add(documents=documents, metadatas=metadatas, ids=ids)
        return ids

    def query(
        self,
        query_text: str,
        n_results: int = 5,
        where: Optional[Dict] = None,
    ) -> List[Dict]:
        """查询相似文档"""
        if self._fallback:
            results = []
            for doc_id, data in self._documents.items():
                if where and not all(data["metadata"].get(k) == v for k, v in where.items()):
                    continue
                results.append({
                    "id": doc_id,
                    "document": data["document"],
                    "metadata": data["metadata"],
                    "distance": 0.5,
                })
            return results[:n_results]
        result = self.collection.query(
            query_texts=[query_text],
            n_results=n_results,
            where=where,
        )
        return result.get("documents", [[]])[0]

    def delete(self, ids: List[str]) -> None:
        """删除文档"""
        if self._fallback:
            for doc_id in ids:
                self._documents.pop(doc_id, None)
            return
        self.collection.delete(ids=ids)

    def get_all(self) -> List[Dict]:
        """获取所有文档"""
        if self._fallback:
            return [
                {"id": k, "document": v["document"], "metadata": v["metadata"]}
                for k, v in self._documents.items()
            ]
        result = self.collection.get()
        return [
            {"id": result["ids"][i], "document": result["documents"][i], "metadata": result["metadatas"][i]}
            for i in range(len(result["ids"]))
        ]


# 全局单例
chroma_service = ChromaService()
