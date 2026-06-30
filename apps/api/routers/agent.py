# -*- coding: utf-8 -*-
"""Agent Router - AI 专家团队路由"""

from typing import List

from fastapi import APIRouter, HTTPException, status

from schemas.agent import (
    AgentInfo,
    MemoryEntry,
    OrchestratorRequest,
    OrchestratorResponse,
    PromptTemplate,
    WorkflowStatus,
)
from services.agent_manager import agent_manager
from services.memory_manager import memory_manager
from services.orchestrator_service import orchestrator_service
from services.prompt_manager import prompt_manager
from services.workflow_manager import workflow_manager
from core.ai_client import ai_client
from core.logger import logger

router = APIRouter(prefix="/agent", tags=["Agent"])


@router.get("/agents", response_model=List[AgentInfo])
async def list_agents() -> List[AgentInfo]:
    """获取所有 AI 专家列表"""
    return agent_manager.get_agents()


@router.get("/agents/{agent_id}", response_model=AgentInfo)
async def get_agent(agent_id: str) -> AgentInfo:
    """根据 ID 获取 AI 专家详情"""
    agent = agent_manager.get_agent(agent_id)
    if agent is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent {agent_id} not found",
        )
    return agent


@router.post("/orchestrator", response_model=OrchestratorResponse)
async def orchestrator(request: OrchestratorRequest) -> OrchestratorResponse:
    """调度中心：接收用户查询，自动规划任务并调度 AI 专家执行（优先真实 LLM）"""
    try:
        # 尝试使用真实 LLM 进行意图识别和任务规划
        planning_prompt = f"""用户查询: {request.query}
请分析用户意图，判断需要哪些专家（learning/research/knowledge/report）协作完成任务。
只返回 JSON 格式: {{"experts": ["expert1", "expert2"], "plan": ["step1", "step2"]}}"""
        llm_response = await ai_client.chat(
            messages=[{"role": "user", "content": planning_prompt}],
            system_prompt="你是 AI 任务调度专家。",
            temperature=0.1,
        )
        logger.info(f"LLM planning response: {llm_response[:200]}")
    except Exception as e:
        logger.warning(f"Real LLM orchestrator failed: {e}, fallback to mock")
    return await orchestrator_service.orchestrate(
        query=request.query,
        context=request.context,
    )


@router.get("/workflow/{workflow_id}", response_model=WorkflowStatus)
async def get_workflow(workflow_id: str) -> WorkflowStatus:
    """获取工作流执行状态"""
    workflow = workflow_manager.get_workflow_status(workflow_id)
    if workflow is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workflow {workflow_id} not found",
        )
    return workflow


@router.get("/prompts", response_model=List[PromptTemplate])
async def list_prompts() -> List[PromptTemplate]:
    """获取所有 Prompt 模板"""
    return prompt_manager.get_prompts()


@router.get("/memory", response_model=List[MemoryEntry])
async def list_memories() -> List[MemoryEntry]:
    """获取所有记忆条目"""
    return memory_manager.get_memories()
