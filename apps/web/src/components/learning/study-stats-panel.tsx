"use client";

import { useStudyPlanStore } from "@/store/study-plan-store";
import {
  Clock,
  Target,
  Flame,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function StudyStatsPanel() {
  const {
    dailyGoalMinutes,
    streakDays,
    todayMinutes,
    completedToday,
    weeklyPlan,
  } = useStudyPlanStore();

  const goalProgress = Math.min((todayMinutes / dailyGoalMinutes) * 100, 100);

  const knowledgeMastery = [
    { name: "货币金融学", mastery: 72 },
    { name: "公司金融", mastery: 58 },
    { name: "投资学", mastery: 45 },
    { name: "金融市场学", mastery: 65 },
    { name: "商业银行", mastery: 38 },
    { name: "431综合", mastery: 52 },
  ];

  const weakPoints = ["货币乘数计算", "MM定理辨析", "NPV折现", "VaR方法"];

  const studySuggestions = [
    "重点复习货币乘数计算，注意包含超额准备金率",
    "加强MM定理有税/无税条件的对比记忆",
    "NPV计算务必先折现再求和",
    "建议每天完成至少2个章节的练习",
  ];

  return (
    <div className="flex h-full flex-col border-l border-rule bg-bg2">
      {/* Header */}
      <div className="border-b border-rule p-4">
        <h2 className="text-sm font-semibold text-ink">学习统计</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Stats Cards */}
        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-rule bg-surface p-3">
            <div className="mb-1 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs text-muted">今日学习</span>
            </div>
            <p className="text-lg font-bold text-ink">{todayMinutes}min</p>
          </div>
          <div className="rounded-xl border border-rule bg-surface p-3">
            <div className="mb-1 flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-accent3" />
              <span className="text-xs text-muted">连续天数</span>
            </div>
            <p className="text-lg font-bold text-ink">{streakDays} 天</p>
          </div>
          <div className="rounded-xl border border-rule bg-surface p-3">
            <div className="mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs text-muted">今日完成</span>
            </div>
            <p className="text-lg font-bold text-ink">
              {completedToday.length} 项
            </p>
          </div>
          <div className="rounded-xl border border-rule bg-surface p-3">
            <div className="mb-1 flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-accent2" />
              <span className="text-xs text-muted">正确率</span>
            </div>
            <p className="text-lg font-bold text-ink">76%</p>
          </div>
        </div>

        {/* Daily Goal Progress */}
        <div className="mb-5 rounded-xl border border-rule bg-surface p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-medium text-ink">每日目标</span>
            </div>
            <span className="text-xs text-muted">
              {todayMinutes}/{dailyGoalMinutes} min
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-rule">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                goalProgress >= 100 ? "bg-accent" : "bg-accent3",
              )}
              style={{ width: `${goalProgress}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-muted">
            {goalProgress >= 100
              ? "今日目标已达成！"
              : `还差 ${dailyGoalMinutes - todayMinutes} 分钟达成目标`}
          </p>
        </div>

        {/* Knowledge Mastery */}
        <div className="mb-5 rounded-xl border border-rule bg-surface p-4">
          <div className="mb-3 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-accent2" />
            <span className="text-xs font-medium text-ink">知识掌握度</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {knowledgeMastery.map((item) => (
              <div key={item.name}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted">{item.name}</span>
                  <span
                    className={cn(
                      "font-medium",
                      item.mastery >= 70
                        ? "text-accent"
                        : item.mastery >= 50
                          ? "text-accent3"
                          : "text-danger",
                    )}
                  >
                    {item.mastery}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-rule">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      item.mastery >= 70
                        ? "bg-accent"
                        : item.mastery >= 50
                          ? "bg-accent3"
                          : "bg-danger",
                    )}
                    style={{ width: `${item.mastery}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Points */}
        <div className="mb-5 rounded-xl border border-rule bg-surface p-4">
          <div className="mb-3 flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-danger" />
            <span className="text-xs font-medium text-ink">薄弱知识点</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {weakPoints.map((point) => (
              <span
                key={point}
                className="rounded-lg bg-danger/10 px-2 py-1 text-xs text-danger"
              >
                {point}
              </span>
            ))}
          </div>
        </div>

        {/* Study Suggestions */}
        <div className="mb-5 rounded-xl border border-rule bg-surface p-4">
          <div className="mb-3 flex items-center gap-1.5">
            <Lightbulb className="h-3.5 w-3.5 text-accent3" />
            <span className="text-xs font-medium text-ink">学习建议</span>
          </div>
          <div className="flex flex-col gap-2">
            {studySuggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-xs text-muted"
              >
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-accent3/10 text-[10px] font-bold text-accent3">
                  {idx + 1}
                </span>
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Plan */}
        <div className="rounded-xl border border-rule bg-surface p-4">
          <div className="mb-3 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-accent2" />
            <span className="text-xs font-medium text-ink">本周计划</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {weeklyPlan.map((plan) => (
              <div
                key={plan.day}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5"
              >
                <span
                  className={cn(
                    "w-10 shrink-0 text-xs font-medium",
                    plan.completed ? "text-accent" : "text-muted",
                  )}
                >
                  {plan.day}
                </span>
                {plan.completed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-accent" />
                ) : (
                  <div className="h-3.5 w-3.5 shrink-0 rounded-full border border-rule" />
                )}
                <span
                  className={cn(
                    "truncate text-xs",
                    plan.completed ? "text-accent" : "text-muted",
                  )}
                >
                  {plan.topics.join("、")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
