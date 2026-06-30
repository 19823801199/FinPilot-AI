# -*- coding: utf-8 -*-
"""FinPilot AI API - 聊天服务（Mock 实现）"""

import uuid
from datetime import datetime, timezone

from schemas.chat import ChatRequest, ChatResponse, WorkflowStepResponse, TaskType


class ChatService:
    """聊天服务：处理用户消息，分类任务类型，生成 Mock 回复"""

    def __init__(self) -> None:
        pass

    def classify_task(self, text: str) -> TaskType:
        """根据关键词分类任务类型"""
        stock_keywords = [
            "股票", "分析", "走势", "K线", "财报",
            "市盈率", "茅台", "腾讯", "股价",
        ]
        learning_keywords = [
            "学习", "解释", "什么是", "模型", "理论",
            "CAPM", "DCF", "估值", "入门",
        ]
        knowledge_keywords = [
            "总结", "PDF", "文档", "知识库", "上传", "报告",
        ]

        for kw in stock_keywords:
            if kw in text:
                return TaskType.STOCK
        for kw in learning_keywords:
            if kw in text:
                return TaskType.LEARNING
        for kw in knowledge_keywords:
            if kw in text:
                return TaskType.KNOWLEDGE
        return TaskType.GENERAL

    def generate_workflow_steps(self, task_type: TaskType) -> list[WorkflowStepResponse]:
        """根据任务类型生成工作流步骤"""
        steps_map: dict[TaskType, list[dict[str, str]]] = {
            TaskType.STOCK: [
                {"id": "s1", "label": "识别股票代码", "status": "done"},
                {"id": "s2", "label": "获取实时行情", "status": "done"},
                {"id": "s3", "label": "分析技术指标", "status": "done"},
                {"id": "s4", "label": "生成分析报告", "status": "done"},
            ],
            TaskType.LEARNING: [
                {"id": "s1", "label": "识别知识点", "status": "done"},
                {"id": "s2", "label": "检索学习资料", "status": "done"},
                {"id": "s3", "label": "生成知识讲解", "status": "done"},
            ],
            TaskType.KNOWLEDGE: [
                {"id": "s1", "label": "检索知识库", "status": "done"},
                {"id": "s2", "label": "匹配相关文档", "status": "done"},
                {"id": "s3", "label": "生成摘要", "status": "done"},
            ],
            TaskType.GENERAL: [
                {"id": "s1", "label": "理解用户意图", "status": "done"},
                {"id": "s2", "label": "生成回答", "status": "done"},
            ],
        }
        return [WorkflowStepResponse(**s) for s in steps_map.get(task_type, steps_map[TaskType.GENERAL])]

    def generate_mock_response(self, text: str, task_type: TaskType) -> str:
        """根据任务类型生成 Mock 回答"""
        responses: dict[TaskType, str] = {
            TaskType.STOCK: (
                f"## 股票分析报告\n\n"
                f"根据您的查询「{text}」，我为您生成了以下分析：\n\n"
                f"### 基本面分析\n"
                f"- **市盈率(PE)**：当前 PE 为 28.5 倍，处于行业中等水平\n"
                f"- **市净率(PB)**：当前 PB 为 8.2 倍\n"
                f"- **营收增长**：同比增长 23.5%\n"
                f"- **净利润率**：18.2%，同比提升 2.3 个百分点\n\n"
                f"### 技术面分析\n"
                f"- **趋势**：短期均线呈多头排列\n"
                f"- **成交量**：近期放量，资金关注度提升\n"
                f"- **支撑位**：¥1,650 附近有强支撑\n"
                f"- **压力位**：¥1,750 为短期压力\n\n"
                f"### 综合评级\n"
                f"**建议：谨慎乐观**\n\n"
                f"> 以上分析基于公开市场数据，仅供参考，不构成投资建议。"
            ),
            TaskType.LEARNING: (
                f"## 知识讲解\n\n"
                f"关于「{text}」，以下是详细解释：\n\n"
                f"### 核心概念\n"
                f"CAPM（Capital Asset Pricing Model，资本资产定价模型）"
                f"是现代金融理论中用于确定资产预期收益率的重要模型。\n\n"
                f"### 公式\n"
                f"**E(Ri) = Rf + βi × (E(Rm) - Rf)**\n\n"
                f"其中：\n"
                f"- **E(Ri)**：资产 i 的预期收益率\n"
                f"- **Rf**：无风险利率（通常用国债收益率）\n"
                f"- **βi**：资产 i 的系统性风险系数\n"
                f"- **E(Rm) - Rf**：市场风险溢价\n\n"
                f"### 应用场景\n"
                f"1. 估算股票的预期收益率\n"
                f"2. 评估投资组合的风险收益比\n"
                f"3. 企业估值中的折现率确定\n\n"
                f"### 注意事项\n"
                f"- CAPM 假设市场完全有效\n"
                f"- 实际应用中需要考虑更多因素"
            ),
            TaskType.KNOWLEDGE: (
                f"## 文档摘要\n\n"
                f"根据您上传的文档，我为您生成了以下摘要：\n\n"
                f"### 主要内容\n"
                f"- **文档主题**：2025年Q1财务报告分析\n"
                f"- **关键发现**：\n"
                f"  1. 营收同比增长 23.5%，达到 156.8 亿元\n"
                f"  2. 净利润率提升至 18.2%\n"
                f"  3. 研发投入占比 12.8%\n"
                f"  4. 经营现金流净额 34.5 亿元\n\n"
                f"### 风险提示\n"
                f"- 市场竞争加剧可能导致毛利率下降\n"
                f"- 海外业务面临汇率波动风险\n\n"
                f"> 摘要基于文档内容自动生成，建议阅读原文获取完整信息。"
            ),
            TaskType.GENERAL: (
                f"感谢您的提问「{text}」。\n\n"
                f"我是 FinPilot AI 助手，我可以帮助您：\n\n"
                f"1. **股票分析** — 输入股票名称或代码，获取专业分析\n"
                f"2. **金融学习** — 询问任何金融概念，获取详细讲解\n"
                f"3. **知识库查询** — 上传文档，智能检索和总结\n\n"
                f"请告诉我您需要什么帮助？"
            ),
        }
        return responses.get(task_type, responses[TaskType.GENERAL])

    async def chat(self, request: ChatRequest) -> ChatResponse:
        """处理聊天请求：分类任务 -> 生成工作流 -> 生成回复"""
        task_type = self.classify_task(request.message)
        workflow_steps = self.generate_workflow_steps(task_type)
        content = self.generate_mock_response(request.message, task_type)

        conversation_id = request.conversation_id or str(uuid.uuid4())

        return ChatResponse(
            id=str(uuid.uuid4()),
            conversation_id=conversation_id,
            role="assistant",
            content=content,
            task_type=task_type,
            workflow_steps=workflow_steps,
            created_at=datetime.now(timezone.utc).isoformat(),
        )


# 全局单例
chat_service = ChatService()
