# -*- coding: utf-8 -*-
"""FinPilot AI API - 知识库（RAG）相关路由"""

from typing import List

from fastapi import APIRouter, HTTPException

from schemas.knowledge import (
    DocumentUpload,
    DocumentInfo,
    DocumentListResponse,
    KnowledgeStats,
    ChunkInfo,
    RAGQuery,
    RAGAnswer,
)
from services.document_service import document_service
from services.chunk_service import chunk_service
from services.retriever_service import retriever_service
from services.rag_service import rag_service
from core.logger import logger

router = APIRouter(prefix="/knowledge", tags=["Knowledge"])


@router.post("/upload", response_model=DocumentInfo)
async def upload_document(request: DocumentUpload) -> DocumentInfo:
    """上传文档到知识库

    Args:
        request: 文档上传请求

    Returns:
        创建的文档信息
    """
    return document_service.upload_document(request)


@router.get("/list", response_model=DocumentListResponse)
async def list_documents() -> DocumentListResponse:
    """获取知识库文档列表及统计信息

    Returns:
        文档列表及知识库统计
    """
    documents = document_service.list_documents()
    stats = document_service.get_stats()
    return DocumentListResponse(
        total=len(documents),
        documents=documents,
        stats=stats,
    )


@router.delete("/{document_id}")
async def delete_document(document_id: str) -> dict:
    """删除知识库中的文档

    Args:
        document_id: 文档ID

    Returns:
        操作结果
    """
    try:
        document_service.delete_document(document_id)
        return {"success": True}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/query", response_model=RAGAnswer)
async def query_knowledge(request: RAGQuery) -> RAGAnswer:
    """基于知识库进行 RAG 查询（优先真实 ChromaDB + LLM）"""
    try:
        result = await rag_service.query(
            query=request.query,
            top_k=request.top_k,
            category=request.category,
        )
        if result and result.get("answer"):
            sources = [
                RetrievalResult(
                    chunk_id=s.get("id", ""),
                    document_id=s.get("metadata", {}).get("document_id", ""),
                    document_name=s.get("metadata", {}).get("document_name", "未知文档"),
                    page_number=s.get("metadata", {}).get("page_number"),
                    content=s.get("document", "")[:200],
                    similarity=1.0 - (s.get("distance", 0.0)),
                )
                for s in result.get("sources", [])
            ]
            return RAGAnswer(
                answer=result["answer"],
                sources=sources,
                retrieval_count=len(sources),
                response_time=result.get("response_time", 0.0),
            )
    except Exception as e:
        logger.warning(f"Real RAG failed: {e}, fallback to mock")
    return retriever_service.answer(
        query=request.query,
        top_k=request.top_k,
        category=request.category,
    )


@router.get("/document/{document_id}", response_model=DocumentInfo)
async def get_document(document_id: str) -> DocumentInfo:
    """获取文档详情

    Args:
        document_id: 文档ID

    Returns:
        文档详细信息
    """
    try:
        return document_service.get_document(document_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/document/{document_id}/chunks", response_model=List[ChunkInfo])
async def get_document_chunks(document_id: str) -> List[ChunkInfo]:
    """获取文档的所有切块

    Args:
        document_id: 文档ID

    Returns:
        切块信息列表
    """
    try:
        return chunk_service.get_document_chunks(document_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/stats", response_model=KnowledgeStats)
async def get_knowledge_stats() -> KnowledgeStats:
    """获取知识库统计信息

    Returns:
        知识库统计数据
    """
    return document_service.get_stats()
