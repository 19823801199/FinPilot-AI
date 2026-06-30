"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useResearchStore } from "@/store/research-store";
import {
  Loader2,
  CheckCircle2,
  Circle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  BrainCircuit,
} from "lucide-react";

export function AnalysisStatus() {
  const [collapsed, setCollapsed] = React.useState(false);
  const { isAnalyzing, analysisSteps, currentReport } = useResearchStore();

  const doneCount = analysisSteps.filter((s) => s.status === "done").length;
  const totalCount = analysisSteps.length;
  const progress = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;

  if (collapsed) {
    return (
      <div className="flex w-12 flex-col items-center border-l border-rule bg-surface py-4 transition-all">
        <button
          onClick={() => setCollapsed(false)}
          className="rounded-lg p-2 text-muted transition-colors hover:bg-surface2 hover:text-ink"
          title="展开侧边栏"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-[260px] shrink-0 flex-col border-l border-rule bg-surface transition-all">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-rule px-4 py-3">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-accent2" />
          <h2 className="text-sm font-semibold text-ink">AI 分析状态</h2>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface2 hover:text-ink"
          title="收起侧边栏"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isAnalyzing && (
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-accent2">分析进度</span>
              <span className="text-xs text-muted">
                {doneCount}/{totalCount}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface2">
              <div
                className="h-full rounded-full bg-accent2 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {analysisSteps.length === 0 && !currentReport && (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface2">
              <BrainCircuit className="h-6 w-6 text-muted" />
            </div>
            <p className="mt-3 text-sm text-muted">等待分析启动</p>
            <p className="mt-1 text-xs text-muted/60">选择股票后点击 AI 分析</p>
          </div>
        )}

        {analysisSteps.length > 0 && (
          <div className="space-y-0">
            {analysisSteps.map((step, index) => {
              const isLast = index === analysisSteps.length - 1;
              const statusConfig = {
                pending: {
                  icon: <Circle className="h-4 w-4" />,
                  color: "text-muted",
                  bg: "bg-surface2",
                },
                running: {
                  icon: <Loader2 className="h-4 w-4 animate-spin" />,
                  color: "text-accent2",
                  bg: "bg-accent2/10",
                },
                done: {
                  icon: <CheckCircle2 className="h-4 w-4" />,
                  color: "text-accent",
                  bg: "bg-accent/10",
                },
                error: {
                  icon: <XCircle className="h-4 w-4" />,
                  color: "text-danger",
                  bg: "bg-danger/10",
                },
              };
              const cfg = statusConfig[step.status];

              return (
                <div key={step.id} className="flex gap-3">
                  {/* Connector line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full transition-all",
                        cfg.bg,
                        cfg.color,
                      )}
                    >
                      {cfg.icon}
                    </div>
                    {!isLast && (
                      <div
                        className={cn(
                          "mt-1 h-full w-[2px] min-h-[24px] transition-colors",
                          step.status === "done" ? "bg-accent/30" : "bg-rule",
                        )}
                      />
                    )}
                  </div>
                  <div className={cn("pb-4", isLast && "pb-0")}>
                    <p
                      className={cn(
                        "text-sm font-medium transition-colors",
                        step.status === "running"
                          ? "text-accent2"
                          : step.status === "done"
                            ? "text-ink"
                            : "text-muted",
                      )}
                    >
                      {step.label}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {step.status === "pending" && "等待中..."}
                      {step.status === "running" && "正在分析..."}
                      {step.status === "done" && "已完成"}
                      {step.status === "error" && "分析异常"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {currentReport && !isAnalyzing && (
          <div className="mt-5 rounded-xl border border-accent/20 bg-accent/5 p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              <span className="text-sm font-semibold text-ink">分析完成</span>
            </div>
            <p className="mt-1 text-xs text-muted">
              综合评分：
              <span className="ml-1 font-bold text-accent">
                {currentReport.compositeScore}
              </span>
              /100
            </p>
          </div>
        )}

        {/* Risk Warning */}
        <div className="mt-5 rounded-lg border border-accent3/20 bg-accent3/5 p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent3" />
            <div>
              <p className="text-xs font-medium text-accent3">风险提示</p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted">
                AI 分析报告仅供参考，不构成投资建议。投资有风险，入市需谨慎。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
