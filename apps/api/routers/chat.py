# -*- coding: utf-8 -*-
"""FinPilot AI API - 聊天路由"""

import json

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from schemas.chat import ChatRequest, ChatResponse
from services.chat_service import chat_service
from core.ai_client import ai_client
from core.logger import logger

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse)
async def create_chat(request: ChatRequest) -> ChatResponse:
    """发送消息并获取 AI 回复"""
    return await chat_service.chat(request)


@router.post("/stream")
async def chat_stream(request: ChatRequest):
    """流式对话，SSE 输出"""
    async def event_generator():
        try:
            full_content = ""
            async for chunk in ai_client.chat_stream(
                messages=[{"role": "user", "content": request.message}],
                system_prompt="你是 FinPilot AI，一位专业的金融 AI 助手。",
            ):
                full_content += chunk
                data = json.dumps({"content": chunk}, ensure_ascii=False)
                yield f"data: {data}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            logger.error(f"Stream error: {e}")
            err = json.dumps({"error": str(e)}, ensure_ascii=False)
            yield f"data: {err}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
