# -*- coding: utf-8 -*-
"""FinPilot AI API - Health Check Router"""

from datetime import datetime, timezone

from fastapi import APIRouter

router = APIRouter()


@router.get("/health", tags=["health"])
async def health_check():
    """健康检查端点"""
    return {
        "status": "ok",
        "version": "1.0.0",
        "time": datetime.now(timezone.utc).isoformat(),
    }
