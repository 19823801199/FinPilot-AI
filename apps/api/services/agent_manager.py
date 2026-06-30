# -*- coding: utf-8 -*-
"""AI 专家管理服务 - Agent Manager"""

import uuid
from typing import Dict, List, Optional

from schemas.agent import AgentInfo, AgentRole


class AgentManager:
    """AI 专家管理器（全局单例）

    管理 4 个预置金融 AI 专家：
    - Learning Expert（金融学习专家）
    - Research Expert（股票研究专家）
    - Knowledge Expert（知识库专家）
    - Report Expert（报告专家）
    """

    _instance: Optional["AgentManager"] = None

    def __new__(cls) -> "AgentManager":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self) -> None:
        if self._initialized:
            return
        self._agents: Dict[str, AgentInfo] = {}
        self._init_default_agents()
        self._initialized = True

    def _init_default_agents(self) -> None:
        """初始化 4 个预置专家"""
        defaults = [
            AgentInfo(
                id=str(uuid.uuid4()),
                name="Learning Expert",
                role=AgentRole.LEARNING,
                avatar="📚",
                description="金融学习专家，负责金融知识讲解、课程辅导、考研知识梳理、题目解析与学习规划制定",
                capabilities=[
                    "金融知识讲解",
                    "课程辅导",
                    "考研知识梳理",
                    "题目解析",
                    "学习规划制定",
                    "概念对比分析",
                    "练习题生成",
                ],
                status="idle",
            ),
            AgentInfo(
                id=str(uuid.uuid4()),
                name="Research Expert",
                role=AgentRole.RESEARCH,
                avatar="📈",
                description="股票研究专家，负责股票分析、技术分析、财务分析、风险评估与投资建议生成",
                capabilities=[
                    "股票基本面分析",
                    "技术分析",
                    "财务报表分析",
                    "风险评估",
                    "投资建议生成",
                    "行业对比研究",
                    "估值模型应用",
                ],
                status="idle",
            ),
            AgentInfo(
                id=str(uuid.uuid4()),
                name="Knowledge Expert",
                role=AgentRole.KNOWLEDGE,
                avatar="🧠",
                description="知识库专家，负责 RAG 检索、文档检索、资料引用、知识整理与资料总结",
                capabilities=[
                    "RAG 文档检索",
                    "资料引用",
                    "知识整理",
                    "资料总结",
                    "研报重点提取",
                    "概念关联分析",
                    "知识图谱构建",
                ],
                status="idle",
            ),
            AgentInfo(
                id=str(uuid.uuid4()),
                name="Report Expert",
                role=AgentRole.REPORT,
                avatar="📄",
                description="报告专家，负责整理分析结果、统一输出格式、优化表达与生成最终报告",
                capabilities=[
                    "结果整理汇总",
                    "格式统一规范",
                    "表达优化润色",
                    "最终报告生成",
                    "Markdown 排版",
                    "要点提炼总结",
                    "多源信息融合",
                ],
                status="idle",
            ),
        ]
        for agent in defaults:
            self._agents[agent.id] = agent

    def get_agents(self) -> List[AgentInfo]:
        """获取所有专家列表"""
        return list(self._agents.values())

    def get_agent(self, agent_id: str) -> Optional[AgentInfo]:
        """根据 ID 获取专家信息"""
        return self._agents.get(agent_id)

    def get_agent_by_role(self, role: AgentRole) -> Optional[AgentInfo]:
        """根据角色获取专家信息"""
        for agent in self._agents.values():
            if agent.role == role:
                return agent
        return None

    def update_agent_status(self, agent_id: str, status: str) -> Optional[AgentInfo]:
        """更新专家状态"""
        agent = self._agents.get(agent_id)
        if agent is None:
            return None
        agent.status = status
        return agent

    def assign_task(self, agent_id: str, task_id: str) -> Optional[AgentInfo]:
        """为专家分配任务"""
        agent = self._agents.get(agent_id)
        if agent is None:
            return None
        agent.status = "busy"
        agent.current_task = task_id
        return agent

    def complete_task(self, agent_id: str) -> Optional[AgentInfo]:
        """标记专家任务完成"""
        agent = self._agents.get(agent_id)
        if agent is None:
            return None
        agent.status = "idle"
        agent.current_task = None
        agent.completed_tasks += 1
        return agent


# 全局单例
agent_manager = AgentManager()
