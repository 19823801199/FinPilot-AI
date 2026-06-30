# -*- coding: utf-8 -*-
"""FinPilot AI API - Mock 错题本服务模块"""

import uuid
from datetime import datetime
from typing import List

from schemas.learning import MistakeRecord


class MistakeService:
    """Mock 错题本服务类，提供错题记录的增删查功能"""

    def __init__(self) -> None:
        """初始化错题本服务，加载预置错题数据"""
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self._mistakes: List[dict] = [
            {
                "id": str(uuid.uuid4()),
                "question_id": str(uuid.uuid4()),
                "question": "根据MM理论(无税)，在完美资本市场中，企业价值()。",
                "user_answer": "A",
                "correct_answer": "C",
                "error_reason": "混淆了MM无税定理与MM有税定理。MM无税定理认为企业价值与资本结构无关，而MM有税定理认为负债增加可带来税盾利益，从而增加企业价值。",
                "knowledge_point": "MM无税/有税定理",
                "error_count": 2,
                "last_practice_at": now,
                "created_at": "2026-06-15 10:30:00",
            },
            {
                "id": str(uuid.uuid4()),
                "question_id": str(uuid.uuid4()),
                "question": "根据费雪方程，若名义利率为8%，通货膨胀率为3%，则实际利率约为()。",
                "user_answer": "A",
                "correct_answer": "B",
                "error_reason": "使用了近似公式(8%-3%=5%)而非精确的费雪方程计算。精确公式为(1+0.08)/(1+0.03)-1≈4.85%，考试中应使用精确公式。",
                "knowledge_point": "名义利率与实际利率的费雪关系",
                "error_count": 1,
                "last_practice_at": now,
                "created_at": "2026-06-18 14:20:00",
            },
            {
                "id": str(uuid.uuid4()),
                "question_id": str(uuid.uuid4()),
                "question": "某债券面值1000元，票面利率6%，剩余期限3年，每年付息一次，当前市场价格为950元。求该债券的到期收益率(YTM)和麦考利久期。",
                "user_answer": "YTM=7.5%，久期=2.5年",
                "correct_answer": "YTM≈7.84%，久期≈2.82年",
                "error_reason": "YTM计算时试算不够精确，久期计算时未正确加权各期现金流的现值。建议使用财务计算器或Excel的IRR和DURATION函数验证。",
                "knowledge_point": "麦考利久期与修正久期",
                "error_count": 3,
                "last_practice_at": now,
                "created_at": "2026-06-20 09:15:00",
            },
        ]

    def add_mistake(
        self,
        question_id: str,
        question: str,
        user_answer: str,
        correct_answer: str,
        error_reason: str,
        knowledge_point: str,
    ) -> MistakeRecord:
        """添加错题记录

        Args:
            question_id: 题目ID
            question: 题目内容
            user_answer: 用户答案
            correct_answer: 正确答案
            error_reason: 错误原因分析
            knowledge_point: 关联知识点

        Returns:
            新增的错题记录
        """
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # 检查是否已有该题目的错题记录
        for mistake in self._mistakes:
            if mistake["question_id"] == question_id:
                # 更新已有记录
                mistake["user_answer"] = user_answer
                mistake["error_reason"] = error_reason
                mistake["error_count"] += 1
                mistake["last_practice_at"] = now
                return MistakeRecord(**mistake)

        # 创建新记录
        record = {
            "id": str(uuid.uuid4()),
            "question_id": question_id,
            "question": question,
            "user_answer": user_answer,
            "correct_answer": correct_answer,
            "error_reason": error_reason,
            "knowledge_point": knowledge_point,
            "error_count": 1,
            "last_practice_at": now,
            "created_at": now,
        }
        self._mistakes.append(record)
        return MistakeRecord(**record)

    def get_mistakes(self) -> List[MistakeRecord]:
        """获取所有错题记录

        Returns:
            全部错题列表
        """
        return [MistakeRecord(**m) for m in self._mistakes]

    def remove_mistake(self, mistake_id: str) -> bool:
        """删除错题记录

        Args:
            mistake_id: 错题记录ID

        Returns:
            是否成功删除
        """
        for i, mistake in enumerate(self._mistakes):
            if mistake["id"] == mistake_id:
                self._mistakes.pop(i)
                return True
        return False

    def get_mistakes_by_knowledge(self, knowledge_point: str) -> List[MistakeRecord]:
        """按知识点查询错题

        Args:
            knowledge_point: 知识点名称(模糊匹配)

        Returns:
            匹配的错题列表
        """
        results: List[MistakeRecord] = []
        for mistake in self._mistakes:
            if knowledge_point in mistake["knowledge_point"]:
                results.append(MistakeRecord(**mistake))
        return results


# 全局单例实例
mistake_service = MistakeService()
