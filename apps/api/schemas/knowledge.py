# -*- coding: utf-8 -*-
"""FinPilot AI API - 知识库（RAG）相关 Schema"""

from pydantic import BaseModel, Field
from typing import Optional, List


class DocumentUpload(BaseModel):
    """文档上传请求模型"""

    filename: str = Field(..., description="文件名称")
    content_type: str = Field(..., description="文件类型: pdf, docx, txt, md, pptx")
    size: int = Field(..., description="文件大小(字节)")
    category: Optional[str] = Field(None, description="文档分类")
    tags: Optional[List[str]] = Field(None, description="文档标签列表")


class DocumentInfo(BaseModel):
    """文档信息模型"""

    id: str = Field(..., description="文档唯一ID")
    filename: str = Field(..., description="文件名称")
    content_type: str = Field(..., description="文件类型")
    size: int = Field(..., description="文件大小(字节)")
    category: str = Field(..., description="文档分类")
    tags: List[str] = Field(default_factory=list, description="文档标签列表")
    chunk_count: int = Field(..., description="切块数量")
    status: str = Field(..., description="文档状态: processing, ready, error")
    created_at: str = Field(..., description="创建时间")
    updated_at: str = Field(..., description="更新时间")


class KnowledgeStats(BaseModel):
    """知识库统计信息模型"""

    total_documents: int = Field(..., description="文档总数")
    total_chunks: int = Field(..., description="切块总数")
    total_embeddings: int = Field(..., description="向量总数")
    storage_used: str = Field(..., description="存储使用量，如 '12.5 MB'")


class DocumentListResponse(BaseModel):
    """文档列表响应模型"""

    total: int = Field(..., description="文档总数")
    documents: List[DocumentInfo] = Field(default_factory=list, description="文档列表")
    stats: KnowledgeStats = Field(..., description="知识库统计信息")


class ChunkInfo(BaseModel):
    """文档切块信息模型"""

    id: str = Field(..., description="切块唯一ID")
    document_id: str = Field(..., description="所属文档ID")
    content: str = Field(..., description="切块内容")
    page_number: Optional[int] = Field(None, description="页码")
    chunk_index: int = Field(..., description="切块序号")
    metadata: dict = Field(default_factory=dict, description="切块元数据")


class RetrievalResult(BaseModel):
    """RAG 检索结果模型"""

    chunk_id: str = Field(..., description="切块ID")
    document_id: str = Field(..., description="文档ID")
    document_name: str = Field(..., description="文档名称")
    page_number: Optional[int] = Field(None, description="页码")
    content: str = Field(..., description="检索到的内容片段")
    similarity: float = Field(..., description="相似度分数(0~1)")


class RAGQuery(BaseModel):
    """RAG 查询请求模型"""

    query: str = Field(..., description="查询问题")
    top_k: int = Field(default=5, ge=1, le=20, description="返回结果数量，默认5")
    category: Optional[str] = Field(None, description="限定检索的文档分类")


class RAGAnswer(BaseModel):
    """RAG 回答模型"""

    answer: str = Field(..., description="AI 生成的回答")
    sources: List[RetrievalResult] = Field(default_factory=list, description="引用的知识来源")
    retrieval_count: int = Field(..., description="检索到的相关片段数量")
    response_time: float = Field(..., description="响应时间(秒)")
