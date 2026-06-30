# -*- coding: utf-8 -*-
"""FinPilot AI API - AI 学习助手相关 Schema"""

from typing import Optional, List

from pydantic import BaseModel, Field


class Course(BaseModel):
    """金融课程模型"""

    id: str = Field(..., description="课程唯一标识")
    name: str = Field(..., description="课程名称")
    description: str = Field(..., description="课程描述")
    category: str = Field(..., description="课程分类")
    chapter_count: int = Field(..., description="章节数量")
    total_questions: int = Field(..., description="总题目数量")
    estimated_hours: float = Field(..., description="预计学习时长(小时)")
    icon: str = Field(..., description="课程图标(emoji或图标名称)")


class Chapter(BaseModel):
    """课程章节模型"""

    id: str = Field(..., description="章节唯一标识")
    course_id: str = Field(..., description="所属课程ID")
    title: str = Field(..., description="章节标题")
    index: int = Field(..., description="章节序号")
    description: str = Field(..., description="章节描述")
    key_points: List[str] = Field(..., description="核心知识点列表")
    question_count: int = Field(..., description="该章节题目数量")
    estimated_minutes: int = Field(..., description="预计学习时长(分钟)")


class ExerciseQuestion(BaseModel):
    """练习题目模型"""

    id: str = Field(..., description="题目唯一标识")
    chapter_id: str = Field(..., description="所属章节ID")
    type: str = Field(..., description="题目类型: single_choice, multiple_choice, true_false, short_answer, calculation")
    question: str = Field(..., description="题目内容")
    options: Optional[List[str]] = Field(None, description="选项列表(选择题)")
    correct_answer: str = Field(..., description="正确答案")
    explanation: str = Field(..., description="答案解析")
    difficulty: str = Field(..., description="难度等级: easy, medium, hard")
    knowledge_point: str = Field(..., description="关联知识点")


class ExerciseRequest(BaseModel):
    """练习请求模型"""

    chapter_id: str = Field(..., description="章节ID")
    question_type: Optional[str] = Field(None, description="筛选题目类型(可选)")
    count: int = Field(5, description="请求题目数量, 默认5")


class ExerciseResponse(BaseModel):
    """练习响应模型"""

    questions: List[ExerciseQuestion] = Field(..., description="题目列表")
    chapter_title: str = Field(..., description="章节标题")


class SubmitAnswer(BaseModel):
    """用户提交的答案模型"""

    question_id: str = Field(..., description="题目ID")
    user_answer: str = Field(..., description="用户答案")


class SubmitResult(BaseModel):
    """单题批改结果模型"""

    question_id: str = Field(..., description="题目ID")
    correct: bool = Field(..., description="是否正确")
    user_answer: str = Field(..., description="用户答案")
    correct_answer: str = Field(..., description="正确答案")
    explanation: str = Field(..., description="答案解析")
    knowledge_point: str = Field(..., description="关联知识点")
    score: int = Field(..., description="得分")


class SubmitExerciseRequest(BaseModel):
    """批量提交答案请求模型"""

    answers: List[SubmitAnswer] = Field(..., description="答案列表")


class SubmitExerciseResponse(BaseModel):
    """批量提交答案响应模型"""

    results: List[SubmitResult] = Field(..., description="批改结果列表")
    total_score: int = Field(..., description="总分")
    correct_count: int = Field(..., description="正确数量")
    total_count: int = Field(..., description="总题目数量")
    accuracy: float = Field(..., description="正确率")


class MistakeRecord(BaseModel):
    """错题记录模型"""

    id: str = Field(..., description="错题记录唯一标识")
    question_id: str = Field(..., description="题目ID")
    question: str = Field(..., description="题目内容")
    user_answer: str = Field(..., description="用户答案")
    correct_answer: str = Field(..., description="正确答案")
    error_reason: str = Field(..., description="错误原因分析")
    knowledge_point: str = Field(..., description="关联知识点")
    error_count: int = Field(..., description="错误次数")
    last_practice_at: str = Field(..., description="最近练习时间")
    created_at: str = Field(..., description="创建时间")


class StudyReport(BaseModel):
    """学习报告模型"""

    total_study_hours: float = Field(..., description="总学习时长(小时)")
    completed_chapters: int = Field(..., description="已完成章节数")
    total_chapters: int = Field(..., description="总章节数")
    total_questions_answered: int = Field(..., description="总答题数量")
    overall_accuracy: float = Field(..., description="总体正确率")
    knowledge_mastery: List[dict] = Field(..., description="知识点掌握度列表 [{name, mastery}]")
    weak_points: List[str] = Field(..., description="薄弱知识点列表")
    study_suggestions: List[str] = Field(..., description="学习建议列表")
    streak_days: int = Field(..., description="连续学习天数")
    today_study_minutes: int = Field(..., description="今日学习时长(分钟)")


class AIExplanation(BaseModel):
    """AI 知识点讲解模型"""

    knowledge_point: str = Field(..., description="知识点名称")
    definition: str = Field(..., description="定义")
    detailed_explanation: str = Field(..., description="详细解释")
    exam_focus: str = Field(..., description="考试重点")
    common_question_types: List[str] = Field(..., description="常见考题类型")
    classic_example: str = Field(..., description="经典例题")
    memory_tips: str = Field(..., description="记忆技巧")
    further_reading: str = Field(..., description="延伸阅读")
