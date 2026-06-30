# -*- coding: utf-8 -*-
"""FinPilot AI API - AI 学习助手 Router"""

from fastapi import APIRouter, HTTPException

from schemas.learning import (
    Course,
    Chapter,
    ExerciseRequest,
    ExerciseResponse,
    SubmitExerciseRequest,
    SubmitExerciseResponse,
    MistakeRecord,
    StudyReport,
    AIExplanation,
)
from services.course_service import course_service
from services.exercise_service import exercise_service
from services.mistake_service import mistake_service
from services.report_service import report_service

router = APIRouter(prefix="/learn", tags=["Learning"])


# ---------- AI 知识点讲解 Mock 数据 ----------

MOCK_EXPLANATIONS: dict[str, dict[str, str]] = {
    "货币层次的划分": {
        "definition": "货币层次是指根据货币流动性的大小，将货币供应量划分为不同的层次，以便于中央银行进行货币供应量的监测与调控。",
        "detailed_explanation": "中国人民银行将货币供应量划分为三个层次：M0（流通中的现金）、M1（M0+活期存款，即狭义货币供应量）和M2（M1+定期存款+储蓄存款+其他存款，即广义货币供应量）。M1反映经济中的现实购买力，M2不仅反映现实购买力，还反映潜在购买力。M1与M2的增速差异（即\"剪刀差\"）常被用于判断资金活跃程度。",
        "exam_focus": "431考试中常考M0/M1/M2的构成及经济含义，以及货币乘数的计算。注意区分狭义货币与广义货币的区别。",
        "common_question_types": "选择题、简答题",
        "classic_example": "例：若央行下调法定存款准备金率，则商业银行的超额准备金增加，通过货币乘数效应，M1和M2均会上升，但M2的上升幅度可能更大（因为部分资金流向定期存款）。",
        "memory_tips": "口诀：\"0是现金1活期，2加定期和储蓄\"。M0最小最流动，M2最大最全面。",
        "further_reading": "参考《货币金融学》（米什金）第3章；关注中国人民银行每月发布的金融统计数据报告。",
    },
    "CAPM模型": {
        "definition": "资本资产定价模型(CAPM)是由Sharpe(1964)、Lintner(1965)和Mossin(1966)分别独立提出的资产定价模型，描述了资产预期收益率与系统性风险之间的线性关系。",
        "detailed_explanation": "CAPM的核心公式为：E(Ri) = Rf + βi × [E(Rm) - Rf]，其中Rf为无风险利率，E(Rm)为市场组合预期收益率，βi为资产的系统性风险系数，[E(Rm)-Rf]为市场风险溢价。模型表明：投资者只因承担系统性风险而获得补偿，非系统性风险可通过分散化消除，不获得风险溢价。",
        "exam_focus": "431考试必考考点。重点掌握CAPM公式的应用计算、Beta系数的经济含义、证券市场线(SML)的绘制与分析，以及CAPM与APT的比较。",
        "common_question_types": "计算题、选择题、论述题",
        "classic_example": "例：无风险利率4%，市场组合预期收益率12%，某股票Beta=1.5，则预期收益率 = 4% + 1.5×(12%-4%) = 16%。若该股票实际预期收益率为14%，则其Alpha = 14%-16% = -2%，说明被高估。",
        "memory_tips": "CAPM = Risk-free + Beta × Market Premium。Beta>1是进攻型，Beta<1是防御型，Beta=1与市场同步。",
        "further_reading": "参考《投资学》（博迪）第9章；了解Fama-French三因子模型作为CAPM的扩展。",
    },
    "MM定理": {
        "definition": "MM定理(Modigliani-Miller Theorem)是现代资本结构理论的基石，由Modigliani和Miller于1958年提出，研究了在完美资本市场假设下资本结构与企业价值的关系。",
        "detailed_explanation": "MM无税定理(命题I)：企业价值与资本结构无关，V_L = V_U。命题II：股东权益成本随负债率上升而上升，rE = rA + (rA - rD) × (D/E)。MM有税定理(命题I)：负债企业价值等于无负债企业价值加上税盾现值，V_L = V_U + T×D。命题II：考虑税后，rE = rA + (rA - rD) × (1-T) × (D/E)。",
        "exam_focus": "431考试核心考点。重点区分无税和有税两种情形，掌握命题I和命题II的公式推导与应用，理解其经济直觉。",
        "common_question_types": "计算题、论述题、选择题",
        "classic_example": "例：无负债企业价值V_U=1000万，所得税率25%。若发行500万债务，则V_L = 1000 + 0.25×500 = 1125万。税盾价值为125万。",
        "memory_tips": "无税看本质——价值不变；有税看税盾——负债增价值。\"无税无关，有税有关\"。",
        "further_reading": "参考《公司金融》(罗斯)第15章；了解权衡理论和优序融资理论对MM定理的扩展。",
    },
    "default": {
        "definition": "该知识点属于金融学核心概念，是理解金融市场运作和金融决策的基础。",
        "detailed_explanation": "该知识点涉及金融学的基本理论和分析方法，在431金融学综合考试中占有重要比重。建议结合教材系统学习，并通过做题巩固理解。",
        "exam_focus": "该知识点在431考试中可能以选择题、简答题或计算题形式出现，需要重点掌握其基本概念和核心公式。",
        "common_question_types": "选择题、简答题、计算题",
        "classic_example": "建议参考历年431真题中相关考题进行针对性练习。",
        "memory_tips": "理解大于记忆，建议通过画思维导图和做练习题来加深理解。",
        "further_reading": "参考《货币金融学》（米什金）、《公司金融》（罗斯）、《投资学》（博迪）等经典教材。",
    },
}


@router.get("/courses", response_model=list[Course])
async def get_courses() -> list[Course]:
    """获取全部金融课程列表"""
    return course_service.get_courses()


@router.get("/courses/{course_id}", response_model=Course)
async def get_course(course_id: str) -> Course:
    """根据课程ID获取课程详情"""
    try:
        return course_service.get_course(course_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/chapter/{chapter_id}", response_model=Chapter)
async def get_chapter(chapter_id: str) -> Chapter:
    """根据章节ID获取章节详情"""
    try:
        return course_service.get_chapter(chapter_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/exercise", response_model=ExerciseResponse)
async def generate_exercise(request: ExerciseRequest) -> ExerciseResponse:
    """生成章节练习题"""
    try:
        return exercise_service.generate_exercise(
            chapter_id=request.chapter_id,
            question_type=request.question_type,
            count=request.count,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/submit", response_model=SubmitExerciseResponse)
async def submit_exercise(request: SubmitExerciseRequest) -> SubmitExerciseResponse:
    """批量提交答案并获取批改结果"""
    results = []
    total_score = 0
    correct_count = 0

    for answer in request.answers:
        try:
            result = exercise_service.submit_answer(
                question_id=answer.question_id,
                user_answer=answer.user_answer,
            )
            results.append(result)
            total_score += result.score
            if result.correct:
                correct_count += 1

            # 如果答错，自动加入错题本
            if not result.correct:
                question = exercise_service.get_question(answer.question_id)
                mistake_service.add_mistake(
                    question_id=question.id,
                    question=question.question,
                    user_answer=answer.user_answer,
                    correct_answer=question.correct_answer,
                    error_reason=result.explanation,
                    knowledge_point=question.knowledge_point,
                )
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))

    total_count = len(request.answers)
    accuracy = correct_count / total_count if total_count > 0 else 0.0

    return SubmitExerciseResponse(
        results=results,
        total_score=total_score,
        correct_count=correct_count,
        total_count=total_count,
        accuracy=round(accuracy, 4),
    )


@router.get("/mistakes", response_model=list[MistakeRecord])
async def get_mistakes() -> list[MistakeRecord]:
    """获取全部错题记录"""
    return mistake_service.get_mistakes()


@router.delete("/mistakes/{mistake_id}")
async def remove_mistake(mistake_id: str) -> dict:
    """删除指定错题记录"""
    success = mistake_service.remove_mistake(mistake_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"未找到错题记录: {mistake_id}")
    return {"success": True}


@router.get("/report", response_model=StudyReport)
async def get_study_report() -> StudyReport:
    """获取学习报告"""
    return report_service.generate_report()


@router.post("/explain", response_model=AIExplanation)
async def explain_knowledge_point(knowledge_point: str) -> AIExplanation:
    """AI 知识点讲解"""
    explanation_data = MOCK_EXPLANATIONS.get(
        knowledge_point,
        MOCK_EXPLANATIONS["default"],
    )
    return AIExplanation(
        knowledge_point=knowledge_point,
        definition=explanation_data["definition"],
        detailed_explanation=explanation_data["detailed_explanation"],
        exam_focus=explanation_data["exam_focus"],
        common_question_types=explanation_data["common_question_types"].split("、"),
        classic_example=explanation_data["classic_example"],
        memory_tips=explanation_data["memory_tips"],
        further_reading=explanation_data["further_reading"],
    )
