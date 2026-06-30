# -*- coding: utf-8 -*-
"""调度中心服务 - Orchestrator Service"""

import asyncio
import time
import uuid
from datetime import datetime, timezone
from typing import Dict, List, Optional

from schemas.agent import AgentInfo, AgentRole, OrchestratorResponse, TaskPlan
from services.agent_manager import agent_manager
from services.workflow_manager import workflow_manager


class OrchestratorService:
    """多 Agent 调度中心（全局单例）

    核心流程：
    1. Intent Recognition（意图识别）
    2. Task Planning（任务规划）
    3. Task Split（任务拆分）
    4. Assign Expert（分配专家）
    5. Execute（模拟执行）
    6. Collect Result（收集结果）
    7. Merge（合并结果）
    8. Final Response（最终回答）
    """

    _instance: Optional["OrchestratorService"] = None

    def __new__(cls) -> "OrchestratorService":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self) -> None:
        if self._initialized:
            return
        self._initialized = True

    def _now(self) -> str:
        """获取当前 ISO 格式时间"""
        return datetime.now(timezone.utc).isoformat()

    def _sleep_ms(self, min_ms: int = 200, max_ms: int = 500) -> None:
        """模拟执行延迟（同步版本，用于 asyncio.sleep）"""
        return asyncio.sleep(min_ms / 1000 + (max_ms - min_ms) / 1000 * 0.5)

    async def _simulate_step(
        self,
        task: TaskPlan,
        result_text: str,
        workflow_id: str,
    ) -> TaskPlan:
        """模拟执行单个任务步骤"""
        await asyncio.sleep(0.2 + 0.3 * (uuid.uuid4().int % 100) / 100)
        task.status = "running"
        task.started_at = self._now()
        workflow_manager.update_step(workflow_id, task)

        await asyncio.sleep(0.2 + 0.3 * (uuid.uuid4().int % 100) / 100)
        task.status = "done"
        task.result = result_text
        task.completed_at = self._now()
        workflow_manager.update_step(workflow_id, task)

        # 更新 Agent 状态
        agent = agent_manager.get_agent_by_role(task.assigned_agent)
        if agent:
            agent_manager.complete_task(agent.id)

        return task

    async def orchestrate(self, query: str, context: Optional[dict] = None) -> OrchestratorResponse:
        """主调度方法"""
        start_time = time.time()
        workflow_id = str(uuid.uuid4())

        # 1. 意图识别
        intent = self._recognize_intent(query)

        # 2-3. 任务规划与拆分
        task_plan = self._plan_tasks(intent, query)

        # 创建工作流
        workflow_manager.create_workflow(workflow_id, task_plan)

        # 4. 分配专家 & 5. 模拟执行
        agents_involved: List[AgentInfo] = []
        for task in task_plan:
            agent = agent_manager.get_agent_by_role(task.assigned_agent)
            if agent and agent.id not in [a.id for a in agents_involved]:
                agents_involved.append(agent)
            if agent:
                agent_manager.assign_task(agent.id, task.id)

        # 按依赖顺序执行
        executed: Dict[str, TaskPlan] = {}
        pending = {t.id: t for t in task_plan}

        while pending:
            ready = [
                t for t in pending.values()
                if all(dep in executed for dep in t.dependencies)
            ]
            if not ready:
                break
            for task in ready:
                result_text = self._mock_task_result(task, query)
                executed[task.id] = await self._simulate_step(task, result_text, workflow_id)
                del pending[task.id]

        # 6-7. 收集与合并结果
        final_answer = self._merge_results(query, intent, list(executed.values()))

        # 完成工作流
        workflow_manager.complete_workflow(workflow_id)

        execution_time = round(time.time() - start_time, 3)

        return OrchestratorResponse(
            final_answer=final_answer,
            task_plan=list(executed.values()),
            agents_involved=agents_involved,
            execution_time=execution_time,
        )

    def _recognize_intent(self, query: str) -> str:
        """意图识别"""
        q = query.lower()
        if "茅台" in q and ("研报" in q or "431" in q or "知识点" in q):
            return "complex_research_knowledge_learning"
        if "茅台" in q or "分析" in q or "投资" in q or "股票" in q:
            return "research_report"
        if "capm" in q or "模型" in q or "练习" in q or "题" in q:
            return "learning_report"
        if "研报" in q or "总结" in q or "上传" in q or "文档" in q:
            return "knowledge_report"
        return "general_chat"

    def _plan_tasks(self, intent: str, query: str) -> List[TaskPlan]:
        """任务规划与拆分"""
        tasks: List[TaskPlan] = []

        if intent == "research_report":
            t1 = TaskPlan(
                id=str(uuid.uuid4()),
                description=f"Research Expert 分析股票：{query}",
                assigned_agent=AgentRole.RESEARCH,
                status="pending",
            )
            t2 = TaskPlan(
                id=str(uuid.uuid4()),
                description="Report Expert 整理投资要点并生成报告",
                assigned_agent=AgentRole.REPORT,
                dependencies=[t1.id],
                status="pending",
            )
            tasks = [t1, t2]

        elif intent == "learning_report":
            t1 = TaskPlan(
                id=str(uuid.uuid4()),
                description=f"Learning Expert 讲解金融概念：{query}",
                assigned_agent=AgentRole.LEARNING,
                status="pending",
            )
            t2 = TaskPlan(
                id=str(uuid.uuid4()),
                description="Report Expert 生成练习题与学习总结",
                assigned_agent=AgentRole.REPORT,
                dependencies=[t1.id],
                status="pending",
            )
            tasks = [t1, t2]

        elif intent == "knowledge_report":
            t1 = TaskPlan(
                id=str(uuid.uuid4()),
                description=f"Knowledge Expert 检索并总结文档：{query}",
                assigned_agent=AgentRole.KNOWLEDGE,
                status="pending",
            )
            t2 = TaskPlan(
                id=str(uuid.uuid4()),
                description="Report Expert 整理文档重点并生成报告",
                assigned_agent=AgentRole.REPORT,
                dependencies=[t1.id],
                status="pending",
            )
            tasks = [t1, t2]

        elif intent == "complex_research_knowledge_learning":
            t1 = TaskPlan(
                id=str(uuid.uuid4()),
                description=f"Research Expert 进行股票深度分析：{query}",
                assigned_agent=AgentRole.RESEARCH,
                status="pending",
            )
            t2 = TaskPlan(
                id=str(uuid.uuid4()),
                description="Knowledge Expert 检索相关研报与资料",
                assigned_agent=AgentRole.KNOWLEDGE,
                status="pending",
            )
            t3 = TaskPlan(
                id=str(uuid.uuid4()),
                description="Learning Expert 提炼 431 金融学知识点",
                assigned_agent=AgentRole.LEARNING,
                dependencies=[t1.id, t2.id],
                status="pending",
            )
            t4 = TaskPlan(
                id=str(uuid.uuid4()),
                description="Report Expert 整合所有结果生成最终报告",
                assigned_agent=AgentRole.REPORT,
                dependencies=[t3.id],
                status="pending",
            )
            tasks = [t1, t2, t3, t4]

        else:  # general_chat
            t1 = TaskPlan(
                id=str(uuid.uuid4()),
                description=f"Report Expert 处理通用对话：{query}",
                assigned_agent=AgentRole.REPORT,
                status="pending",
            )
            tasks = [t1]

        return tasks

    def _mock_task_result(self, task: TaskPlan, query: str) -> str:
        """生成模拟任务结果"""
        role = task.assigned_agent
        if role == AgentRole.RESEARCH:
            return (
                "【股票分析结果】\n"
                "1. 基本面：贵州茅台为白酒行业龙头，品牌护城河深厚，毛利率常年维持 90% 以上。\n"
                "2. 财务：2024 年营收预计突破 1700 亿元，归母净利润增速约 15%-17%。\n"
                "3. 估值：当前 PE(TTM) 约 28-30 倍，处于历史中枢偏下位置。\n"
                "4. 风险：消费税改革、渠道库存周期、宏观经济波动。\n"
                "5. 建议：长期配置价值明确，短期关注批价与库存去化节奏。"
            )
        if role == AgentRole.KNOWLEDGE:
            return (
                "【知识检索结果】\n"
                "- 检索到 12 篇相关研报，其中 8 篇为深度报告。\n"
                "- 关键数据：茅台 2024Q1 直销收入占比 45.9%，i茅台贡献显著。\n"
                "- 引用来源：中金公司《白酒行业深度》、华泰证券《茅台渠道变革研究》。\n"
                "- 核心结论：高端白酒景气度稳健，茅台批价是行业风向标。"
            )
        if role == AgentRole.LEARNING:
            return (
                "【431 知识点提炼】\n"
                "1. CAPM：E(Ri)=Rf+βi(E(Rm)-Rf)，茅台 β 约 1.1，系统性风险略高于市场。\n"
                "2. 杜邦分析：ROE=净利率×资产周转率×权益乘数，茅台高净利率驱动高 ROE。\n"
                "3. 有效市场假说：茅台作为大盘股，价格反映公开信息，半强式有效市场适用。\n"
                "4. MM 定理：无税条件下资本结构不影响企业价值；有税时债务融资有税盾优势。\n"
                "5. 行为金融：茅台存在品牌溢价与锚定效应，投资者情绪对短期波动有影响。"
            )
        if role == AgentRole.REPORT:
            return (
                "【报告整理完成】\n"
                "- 已汇总所有专家分析结果\n"
                "- 统一采用 Markdown 格式输出\n"
                "- 优化表达，确保逻辑清晰、数据准确\n"
                "- 生成最终回答，包含投资要点、风险提示与知识点总结"
            )
        return "任务执行完成"

    def _merge_results(self, query: str, intent: str, tasks: List[TaskPlan]) -> str:
        """合并结果生成最终回答"""
        if intent == "research_report":
            return (
                "## 贵州茅台投资要点总结\n\n"
                "### 一、公司概况\n"
                "贵州茅台（600519.SH）是中国白酒行业绝对龙头，拥有深厚的品牌护城河与定价权。\n\n"
                "### 二、核心投资逻辑\n"
                "1. **品牌壁垒**：飞天茅台具备奢侈品属性，社交与收藏需求刚性。\n"
                "2. **财务稳健**：毛利率 90%+，净利率 50%+，现金流充沛，分红率稳定提升。\n"
                "3. **渠道改革**：直销占比提升，i茅台数字化赋能，吨价有望持续增长。\n"
                "4. **估值修复**：当前 PE 约 28-30 倍，处于近五年中枢偏下，具备安全边际。\n\n"
                "### 三、风险提示\n"
                "- 消费税政策调整风险\n"
                "- 批价波动与渠道库存周期\n"
                "- 宏观经济下行压制高端消费\n\n"
                "### 四、结论\n"
                "茅台长期配置价值明确，适合作为核心资产持有，短期关注批价企稳与库存去化节奏。"
            )
        if intent == "learning_report":
            return (
                "## CAPM 模型详解与练习题\n\n"
                "### 一、模型定义\n"
                "资本资产定价模型（CAPM）：\n"
                "$$ E(R_i) = R_f + \\beta_i [E(R_m) - R_f] $$\n\n"
                "### 二、参数说明\n"
                "- $R_f$：无风险利率（通常取 10 年期国债收益率）\n"
                "- $\\beta_i$：个股系统性风险系数\n"
                "- $E(R_m)$：市场预期收益率\n"
                "- $E(R_m)-R_f$：市场风险溢价\n\n"
                "### 三、练习题\n"
                "**题目**：已知无风险利率 $R_f=3\\%$，市场收益率 $E(R_m)=10\\%$，某股票 $\\beta=1.2$，求该股票预期收益率。\n\n"
                "**解答**：\n"
                "$$ E(R_i) = 3\\% + 1.2 \\times (10\\% - 3\\%) = 3\\% + 8.4\\% = 11.4\\% $$\n\n"
                "### 四、考点总结\n"
                "- CAPM 是 431 金融学高频考点，常结合 SML、CML 一起考查。\n"
                "- 注意区分系统性风险与非系统性风险，后者可通过分散化消除。"
            )
        if intent == "knowledge_report":
            return (
                "## 研报重点总结\n\n"
                "### 一、核心观点\n"
                "根据检索到的 12 篇研报，市场对茅台 2024-2025 年业绩预期趋于乐观，\n"
                " consensus 净利润增速约 15%-18%。\n\n"
                "### 二、关键数据\n"
                "| 指标 | 2023A | 2024E | 2025E |\n"
                "|------|-------|-------|-------|\n"
                "| 营收（亿元） | 1505 | 1740 | 2000 |\n"
                "| 归母净利润（亿元） | 747 | 860 | 990 |\n"
                "| 毛利率 | 91.6% | 91.8% | 92.0% |\n\n"
                "### 三、投资要点\n"
                "- 直销渠道持续扩张，i茅台成为新增长极\n"
                "- 系列酒（1935）放量，打开千元价格带\n"
                "- 分红承诺提升，股东回报增强\n\n"
                "### 四、风险提示\n"
                "- 批价波动、库存周期、政策风险需持续跟踪"
            )
        if intent == "complex_research_knowledge_learning":
            return (
                "## 茅台深度分析 & 431 知识点综合报告\n\n"
                "### 一、股票研究分析（Research Expert）\n"
                "1. **基本面**：茅台为白酒龙头，品牌护城河深厚，毛利率 90%+。\n"
                "2. **财务**：2024 年营收预计 1700 亿+，净利润增速 15%-17%。\n"
                "3. **估值**：PE(TTM) 28-30 倍，处于历史中枢偏下。\n"
                "4. **风险**：消费税、库存周期、宏观经济。\n\n"
                "### 二、研报资料支撑（Knowledge Expert）\n"
                "- 检索 12 篇研报，关键数据来自中金、华泰深度报告\n"
                "- 直销收入占比 45.9%，i茅台贡献显著\n"
                "- 高端白酒景气度稳健，茅台批价是行业风向标\n\n"
                "### 三、431 金融学知识点（Learning Expert）\n"
                "1. **CAPM**：茅台 β≈1.1，预期收益率 $E(R)=R_f+1.1(E(R_m)-R_f)$\n"
                "2. **杜邦分析**：ROE = 净利率 × 周转率 × 权益乘数，茅台靠高净利率驱动\n"
                "3. **有效市场**：大盘股价格反映公开信息，半强式有效适用\n"
                "4. **MM 定理**：有税条件下债务融资有税盾优势\n"
                "5. **行为金融**：品牌溢价、锚定效应影响投资者决策\n\n"
                "### 四、综合结论（Report Expert）\n"
                "茅台兼具投资价值与学习价值：从投资角度，长期配置逻辑清晰；\n"
                "从考研角度，其财务特征可串联 CAPM、杜邦分析、有效市场等多个 431 核心考点。"
            )
        # general_chat
        return (
            "您好！我是 FinPilot AI 的智能调度助手。\n\n"
            "当前系统已接入 4 位 AI 专家：\n"
            "- 📚 Learning Expert：金融学习与考研辅导\n"
            "- 📈 Research Expert：股票研究与投资分析\n"
            "- 🧠 Knowledge Expert：知识库检索与文档总结\n"
            "- 📄 Report Expert：报告整理与结果输出\n\n"
            "请告诉我您的需求，我将自动调度最合适的专家为您服务。"
        )


# 全局单例
orchestrator_service = OrchestratorService()
