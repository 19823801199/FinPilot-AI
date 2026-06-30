# -*- coding: utf-8 -*-
"""FinPilot AI API - 聊天相关 Schema"""

from pydantic import BaseModel
from typing import Optional
from enum import Enum


class TaskType(str, Enum):
    """AI 任务类型枚举"""

    STOCK = "stock"
    LEARNING = "learning"
    KNOWLEDGE = "knowledge"
    GENERAL = "general"


class ChatRequest(BaseModel):
    """聊天请求模型"""

    message: str
    conversation_id: Optional[str] = None


class WorkflowStepResponse(BaseModel):
    """工作流步骤响应模型"""

    id: str
    label: str
    status: str  # pending, running, done, error


class ChatResponse(BaseModel):
    """聊天响应模型"""

    id: str
    conversation_id: str
    role: str
    content: str
    task_type: TaskType
    workflow_steps: list[WorkflowStepResponse]
    created_at: str


class ConversationResponse(BaseModel):
    """会话响应模型"""

    id: str
    title: str
    created_at: str
    updated_at: str
    last_message: Optional[str] = None
