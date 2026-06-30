"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useResearchStore } from "@/store/research-store";
import {
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  Lightbulb,
  ShieldAlert,
  BarChart3,
  PieChart,
  Target,
} from "lucide-react";

const tabConfig = [
  { id: "overview", label: "概览", icon: <FileText className="h-3.5 w-3.5" /> },
  {
    id: "technical",
    label: "技术",
    icon: <BarChart3 className="h-3.5 w-3.5" />,
  },
  {
    id: "fundamental",
    label: "基本面",
    icon: <PieChart className="h-3.5 w-3.5" />,
  },
  { id: "risk", label: "风险", icon: <ShieldAlert className="h-3.5 w-3.5" /> },
  { id: "valuation", label: "估值", icon: <Target className="h-3.5 w-3.5" /> },
  { id: "advice", label: "建议", icon: <Lightbulb className="h-3.5 w-3.5" /> },
];

function ScoreRing({ score }: { score: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let color = "#00e5a0";
  if (score < 60) color = "#ef4444";
  else if (score < 75) color = "#f59e0b";

  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 84 84">
        <circle
          cx="42"
          cy="42"
          r={radius}
          fill="none"
          stroke="#232840"
          strokeWidth="6"
        />
        <circle
          cx="42"
          cy="42"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-bold text-ink">{score}</span>
        <span className="text-[10px] text-muted">综合评分</span>
      </div>
    </div>
  );
}

function AdviceCard({ advice }: { advice: string }) {
  const lower = advice.toLowerCase();
  let variant: "buy" | "hold" | "watch" | "sell" = "watch";
  if (lower.includes("买入")) variant = "buy";
  else if (lower.includes("持有")) variant = "hold";
  else if (lower.includes("卖出")) variant = "sell";

  const config = {
    buy: {
      icon: <TrendingUp className="h-5 w-5" />,
      label: "买入",
      bg: "bg-accent/10",
      text: "text-accent",
      border: "border-accent/20",
    },
    hold: {
      icon: <Minus className="h-5 w-5" />,
      label: "持有",
      bg: "bg-accent2/10",
      text: "text-accent2",
      border: "border-accent2/20",
    },
    sell: {
      icon: <TrendingDown className="h-5 w-5" />,
      label: "卖出",
      bg: "bg-danger/10",
      text: "text-danger",
      border: "border-danger/20",
    },
    watch: {
      icon: <AlertTriangle className="h-5 w-5" />,
      label: "观望",
      bg: "bg-accent3/10",
      text: "text-accent3",
      border: "border-accent3/20",
    },
  };

  const c = config[variant];

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border px-4 py-3",
        c.bg,
        c.border,
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg",
          c.bg,
          c.text,
        )}
      >
        {c.icon}
      </div>
      <div>
        <p className={cn("text-sm font-bold", c.text)}>{c.label}</p>
        <p className="mt-0.5 text-xs text-muted">{advice.slice(0, 60)}...</p>
      </div>
    </div>
  );
}

export function ResearchReportPanel() {
  const currentReport = useResearchStore((s) => s.currentReport);
  const [activeTab, setActiveTab] = React.useState("overview");

  if (!currentReport) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface2">
          <FileText className="h-8 w-8 text-muted" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-ink">暂无研究报告</h3>
        <p className="mt-1 text-sm text-muted">
          选择股票后点击「AI 分析」生成深度研究报告
        </p>
      </div>
    );
  }

  const contentMap: Record<string, string> = {
    overview: currentReport.overview + "\n\n" + currentReport.coreView,
    technical: currentReport.technicalAnalysis,
    fundamental: currentReport.fundamentalAnalysis,
    risk: currentReport.riskAnalysis,
    valuation: currentReport.valuationAnalysis,
    advice: currentReport.investmentAdvice,
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-start gap-5 border-b border-rule px-6 py-5">
        <ScoreRing score={currentReport.compositeScore} />
        <div className="flex-1">
          <h2 className="text-lg font-bold text-ink">
            {currentReport.stockName}
            <span className="ml-2 text-sm font-normal text-muted">
              {currentReport.stockCode}
            </span>
          </h2>
          <p className="mt-1 text-xs text-muted">
            生成时间：
            {new Date(currentReport.generatedAt).toLocaleString("zh-CN")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {currentReport.keyPoints.map((point, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-md bg-surface2 px-2.5 py-1 text-xs text-ink"
              >
                <CheckCircle2 className="h-3 w-3 text-accent" />
                {point}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-rule px-6">
        {tabConfig.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-all",
              activeTab === tab.id
                ? "text-accent"
                : "text-muted hover:text-ink",
            )}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="space-y-4">
          {activeTab === "advice" && (
            <AdviceCard advice={currentReport.investmentAdvice} />
          )}
          <div className="prose prose-invert max-w-none">
            {contentMap[activeTab]?.split("\n").map((line, i) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={i} className="h-2" />;
              if (trimmed.startsWith("## ")) {
                return (
                  <h3 key={i} className="mt-4 text-base font-bold text-ink">
                    {trimmed.replace("## ", "")}
                  </h3>
                );
              }
              if (/^\d+[\.\)]/.test(trimmed)) {
                return (
                  <p key={i} className="ml-4 text-sm text-ink">
                    {trimmed}
                  </p>
                );
              }
              return (
                <p key={i} className="text-sm leading-relaxed text-ink/90">
                  {trimmed}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
