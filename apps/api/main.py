# -*- coding: utf-8 -*-
"""FinPilot AI API - FastAPI 应用入口"""

from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from routers.health import router as health_router
from routers.chat import router as chat_router
from routers.stock import router as stock_router
from routers.knowledge import router as knowledge_router
from routers.learning import router as learning_router
from routers.agent import router as agent_router

# 创建 FastAPI 应用
app = FastAPI(
    title="FinPilot AI API",
    description="FinPilot AI - 智能金融分析助手后端 API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# 配置 CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册 /api/v1 前缀的路由
api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(health_router)
api_v1_router.include_router(chat_router)
api_v1_router.include_router(stock_router)
api_v1_router.include_router(knowledge_router)
api_v1_router.include_router(learning_router)
api_v1_router.include_router(agent_router)
app.include_router(api_v1_router)
