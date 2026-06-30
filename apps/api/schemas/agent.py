# -*- coding: utf-8 -*-
"""Multi-Agent Orchestrator Schemas - Pydantic v2"""

from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class AgentRole(str, Enum):
    """AI 专家角色枚举"""

    LEARNING = "learning"
    RESEARCH = "research"
    KNOWLEDGE = "knowledge"
    REPORT = "report"


class AgentInfo(BaseModel):
    """AI 专家信息模型"""

    id: str = Field(..., description="专家唯一标识")
    name: str = Field(..., description="专家名称")
    role: AgentRole = Field(..., description="专家角色")
    avatar: str = Field(..., description="专家头像 emoji 或图标名称")
    description: str = Field(..., description="专家职责描述")
    capabilities: List[str] = Field(..., description="专家能力列表")
    status: str = Field(..., description="专家状态：idle, busy, offline")
    current_task: Optional[str] = Field(None, description="当前执行任务 ID")
    completed_tasks: int = Field(0, description="已完成任务数量")


class TaskPlan(BaseModel):
    """任务计划模型"""

    id: str = Field(..., description="任务唯一标识")
    description: str = Field(..., description="任务描述")
    assigned_agent: AgentRole = Field(..., description="分配的专家角色")
    dependencies: List[str] = Field(default=[], description="依赖任务 ID 列表")
    status: str = Field(..., description="任务状态：pending, running, done, error")
    result: Optional[str] = Field(None, description="任务执行结果")
    started_at: Optional[str] = Field(None, description="任务开始时间 ISO 格式")
    completed_at: Optional[str] = Field(None, description="任务完成时间 ISO 格式")


class OrchestratorRequest(BaseModel):
    """调度中心请求模型"""

    query: str = Field(..., description="用户查询内容")
    context: Optional[dict] = Field(None, description="额外上下文信息")


class OrchestratorResponse(BaseModel):
    """调度中心响应模型"""

    final_answer: str = Field(..., description="最终回答内容")
    task_plan: List[TaskPlan] = Field(..., description="执行的任务计划列表")
    agents_involved: List[AgentInfo] = Field(..., description="参与的专家列表")
    execution_time: float = Field(..., description="执行耗时（秒）")


class WorkflowStatus(BaseModel):
    """工作流状态模型"""

    workflow_id: str = Field(..., description="工作流唯一标识")
    status: str = Field(..., description="工作流状态：planning, executing, merging, completed, error")
    steps: List[TaskPlan] = Field(..., description="工作流步骤列表")
    progress: float = Field(..., ge=0, le=100, description="工作流进度 0-100")


class PromptTemplate(BaseModel):
    """Prompt 模板模型"""

    id: str = Field(..., description="模板唯一标识")
    name: str = Field(..., description="模板名称")
    role: AgentRole = Field(..., description="适用专家角色")
    system_prompt: str = Field(..., description="系统级 Prompt")
    task_prompt: str = Field(..., description="任务级 Prompt")
    description: str = Field(..., description="模板描述")


class MemoryEntry(BaseModel):
    """记忆条目模型"""

    id: str = Field(..., description="记忆唯一标识")
    type: str = Field(..., description="记忆类型：short_term, long_term, preference")
    content: str = Field(..., description="记忆内容")
    agent_role: Optional[AgentRole] = Field(None, description="关联专家角色")
    created_at: str = Field(..., description="创建时间 ISO 格式")
    relevance_score: Optional[float] = Field(None, ge=0, le=1, description="相关性评分 0-1")
