# -*- coding: utf-8 -*-
"""FinPilot AI API - Mock 学习报告服务模块"""

from schemas.learning import StudyReport


class ReportService:
    """Mock 学习报告服务类，提供学习统计数据生成"""

    def __init__(self) -> None:
        """初始化学习报告服务"""
        pass

    def generate_report(self) -> StudyReport:
        """生成学习报告

        Returns:
            完整的学习统计数据报告
        """
        return StudyReport(
            total_study_hours=128.5,
            completed_chapters=18,
            total_chapters=42,
            total_questions_answered=256,
            overall_accuracy=0.72,
            knowledge_mastery=[
                {"name": "货币层次的划分", "mastery": 0.85},
                {"name": "利率决定理论", "mastery": 0.70},
                {"name": "货币政策传导机制", "mastery": 0.65},
                {"name": "债券定价与收益率", "mastery": 0.78},
                {"name": "股票估值(DDM/DCF)", "mastery": 0.60},
                {"name": "NPV/IRR决策准则", "mastery": 0.90},
                {"name": "MM定理", "mastery": 0.55},
                {"name": "CAPM模型", "mastery": 0.82},
                {"name": "有效市场假说", "mastery": 0.75},
                {"name": "久期与凸性", "mastery": 0.45},
                {"name": "购买力平价", "mastery": 0.80},
                {"name": "VaR计算方法", "mastery": 0.68},
                {"name": "WACC计算", "mastery": 0.88},
                {"name": "马科维茨投资组合", "mastery": 0.72},
                {"name": "信用违约互换(CDS)", "mastery": 0.50},
            ],
            weak_points=[
                "久期与凸性计算",
                "MM定理(无税/有税)的应用",
                "信用违约互换(CDS)原理",
                "股票估值中的戈登增长模型",
                "期权定价(Black-Scholes模型)",
            ],
            study_suggestions=[
                "重点复习久期与凸性的计算方法，建议结合具体债券案例进行练习",
                "MM定理是公司金融的核心考点，建议对比无税和有税两种情形深入理解",
                "信用衍生品部分建议结合2008年金融危机案例进行学习",
                "建议每天保持2小时以上的学习时间，巩固薄弱知识点",
                "计算题部分需要提高解题速度，建议限时训练",
                "建议每周做一套431真题模拟，熟悉考试节奏",
            ],
            streak_days=12,
            today_study_minutes=85,
        )


# 全局单例实例
report_service = ReportService()
