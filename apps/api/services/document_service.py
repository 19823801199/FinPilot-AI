# -*- coding: utf-8 -*-
"""FinPilot AI API - 文档管理服务模块"""

import uuid
from datetime import datetime
from typing import List, Optional

from schemas.knowledge import DocumentInfo, DocumentUpload, KnowledgeStats


# 预置 Mock 文档数据
MOCK_DOCUMENTS: list[dict] = [
    {
        "id": str(uuid.uuid4()),
        "filename": "2024年A股市场年度报告.pdf",
        "content_type": "pdf",
        "size": 2_456_789,
        "category": "财务报告",
        "tags": ["A股", "年度报告", "市场分析", "2024"],
        "chunk_count": 48,
        "status": "ready",
        "created_at": "2024-12-15 09:30:00",
        "updated_at": "2024-12-20 14:22:00",
    },
    {
        "id": str(uuid.uuid4()),
        "filename": "新能源汽车行业深度研究报告.docx",
        "content_type": "docx",
        "size": 3_128_456,
        "category": "行业研究",
        "tags": ["新能源汽车", "行业研究", "比亚迪", "宁德时代", "深度分析"],
        "chunk_count": 62,
        "status": "ready",
        "created_at": "2024-11-08 10:15:00",
        "updated_at": "2024-11-12 16:45:00",
    },
    {
        "id": str(uuid.uuid4()),
        "filename": "2025年金融监管政策汇编.md",
        "content_type": "md",
        "size": 856_234,
        "category": "政策法规",
        "tags": ["金融监管", "政策法规", "证监会", "银保监会", "2025"],
        "chunk_count": 35,
        "status": "ready",
        "created_at": "2025-01-05 08:00:00",
        "updated_at": "2025-01-10 11:30:00",
    },
    {
        "id": str(uuid.uuid4()),
        "filename": "价值投资学习笔记-巴菲特致股东信解读.txt",
        "content_type": "txt",
        "size": 423_567,
        "category": "学习笔记",
        "tags": ["价值投资", "巴菲特", "股东信", "投资策略", "学习笔记"],
        "chunk_count": 28,
        "status": "ready",
        "created_at": "2024-10-20 20:10:00",
        "updated_at": "2024-10-25 22:00:00",
    },
    {
        "id": str(uuid.uuid4()),
        "filename": "半导体芯片行业市场分析与投资策略.pptx",
        "content_type": "pptx",
        "size": 5_678_901,
        "category": "市场分析",
        "tags": ["半导体", "芯片", "市场分析", "投资策略", "AI芯片"],
        "chunk_count": 55,
        "status": "ready",
        "created_at": "2025-02-18 14:30:00",
        "updated_at": "2025-02-22 09:15:00",
    },
]


class DocumentService:
    """文档管理服务类，提供 Mock 文档的增删查功能"""

    def __init__(self) -> None:
        """初始化文档服务，加载预置 Mock 文档数据"""
        self._documents: list[dict] = [doc.copy() for doc in MOCK_DOCUMENTS]

    def upload_document(self, upload: DocumentUpload) -> DocumentInfo:
        """上传文档（Mock 实现）

        Args:
            upload: 文档上传请求

        Returns:
            创建的文档信息
        """
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        doc_id = str(uuid.uuid4())
        # 模拟切块数量：根据文件大小估算，每 50KB 一个 chunk
        chunk_count = max(1, upload.size // 50_000)

        document: dict = {
            "id": doc_id,
            "filename": upload.filename,
            "content_type": upload.content_type,
            "size": upload.size,
            "category": upload.category or "未分类",
            "tags": upload.tags or [],
            "chunk_count": chunk_count,
            "status": "ready",
            "created_at": now,
            "updated_at": now,
        }
        self._documents.append(document)

        return self._to_document_info(document)

    def list_documents(self) -> List[DocumentInfo]:
        """获取文档列表

        Returns:
            所有文档信息列表
        """
        return [self._to_document_info(doc) for doc in self._documents]

    def get_document(self, document_id: str) -> DocumentInfo:
        """获取单个文档详情

        Args:
            document_id: 文档ID

        Returns:
            文档信息

        Raises:
            ValueError: 文档ID不存在时抛出
        """
        for doc in self._documents:
            if doc["id"] == document_id:
                return self._to_document_info(doc)
        raise ValueError(f"未找到文档: {document_id}")

    def delete_document(self, document_id: str) -> bool:
        """删除文档

        Args:
            document_id: 文档ID

        Returns:
            是否成功删除

        Raises:
            ValueError: 文档ID不存在时抛出
        """
        for i, doc in enumerate(self._documents):
            if doc["id"] == document_id:
                self._documents.pop(i)
                return True
        raise ValueError(f"未找到文档: {document_id}")

    def get_stats(self) -> KnowledgeStats:
        """获取知识库统计信息

        Returns:
            知识库统计数据
        """
        total_documents = len(self._documents)
        total_chunks = sum(doc["chunk_count"] for doc in self._documents)
        total_embeddings = total_chunks  # 每个 chunk 对应一个 embedding
        total_size = sum(doc["size"] for doc in self._documents)
        # 格式化存储使用量
        if total_size >= 1_048_576:
            storage_used = f"{total_size / 1_048_576:.1f} MB"
        elif total_size >= 1_024:
            storage_used = f"{total_size / 1_024:.1f} KB"
        else:
            storage_used = f"{total_size} B"

        return KnowledgeStats(
            total_documents=total_documents,
            total_chunks=total_chunks,
            total_embeddings=total_embeddings,
            storage_used=storage_used,
        )

    def _to_document_info(self, doc: dict) -> DocumentInfo:
        """将内部文档字典转换为 DocumentInfo 模型"""
        return DocumentInfo(
            id=doc["id"],
            filename=doc["filename"],
            content_type=doc["content_type"],
            size=doc["size"],
            category=doc["category"],
            tags=doc["tags"],
            chunk_count=doc["chunk_count"],
            status=doc["status"],
            created_at=doc["created_at"],
            updated_at=doc["updated_at"],
        )


# 全局单例实例
document_service = DocumentService()
