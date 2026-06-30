"use client";

import { cn } from "@/lib/utils";
import { useRetrieverStore } from "@/store/retriever-store";
import {
  Brain,
  Send,
  Clock,
  FileText,
  ChevronRight,
  Sparkles,
  X,
  Zap,
  BookOpen,
} from "lucide-react";
import * as React from "react";

export function RAGPanel() {
  const [inputQuery, setInputQuery] = React.useState("");
  const { query, isQuerying, answer, queryHistory, ragQuery, clearAnswer } =
    useRetrieverStore();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [answer, isQuerying]);

  const handleSend = () => {
    const trimmed = inputQuery.trim();
    if (!trimmed || isQuerying) return;
    ragQuery(trimmed);
    setInputQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleHistoryClick = (historyQuery: string) => {
    setInputQuery(historyQuery);
  };

  const quickQuestions = [
    "2025年Q1财务报告的关键数据是什么？",
    "新能源汽车行业有哪些投资机会？",
    "当前央行货币政策走向如何？",
  ];

  return (
    <div className="flex w-[320px] shrink-0 flex-col border-l border-rule bg-surface">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-rule px-4 py-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
          <Brain className="h-4 w-4 text-accent" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-ink">AI 知识库问答</h2>
          <p className="text-xs text-muted">基于 RAG 的智能检索</p>
        </div>
        {answer && (
          <button
            onClick={clearAnswer}
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface2 hover:text-ink"
            title="清除对话"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {!answer && !isQuerying && queryHistory.length === 0 ? (
          /* Welcome State */
          <div className="flex h-full flex-col px-4 py-6">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-sm font-semibold text-ink">智能知识检索</h3>
              <p className="mt-1 text-xs text-muted">
                输入问题，AI 将从知识库中检索相关内容并生成回答
              </p>
            </div>

            {/* Quick Questions */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted">快捷提问</p>
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputQuery(q);
                    ragQuery(q);
                    setInputQuery("");
                  }}
                  className={cn(
                    "flex w-full items-start gap-2 rounded-lg border border-rule bg-bg2 p-3 text-left transition-colors",
                    "hover:border-accent/30 hover:bg-surface2",
                  )}
                >
                  <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                  <span className="text-xs text-ink">{q}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-4 py-4">
            {/* Query History */}
            {queryHistory.length > 0 && !answer && !isQuerying && (
              <div className="mb-4">
                <p className="mb-2 text-xs font-medium text-muted">
                  <Clock className="mr-1 inline h-3 w-3" />
                  历史查询
                </p>
                <div className="space-y-1">
                  {queryHistory.slice(0, 5).map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleHistoryClick(item.query)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors",
                        "hover:bg-surface2",
                      )}
                    >
                      <BookOpen className="h-3.5 w-3.5 shrink-0 text-muted" />
                      <span className="flex-1 truncate text-xs text-ink">
                        {item.query}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Animation */}
            {isQuerying && (
              <div className="mb-4">
                <div className="flex items-center gap-2 rounded-xl border border-rule bg-bg2 px-4 py-3">
                  <span className="text-xs text-muted">正在检索知识库</span>
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                    <span
                      className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <span
                      className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Answer Display */}
            {answer && (
              <div className="space-y-4">
                {/* User Query */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-xl bg-accent px-4 py-3 text-bg">
                    <p className="text-sm">{query}</p>
                  </div>
                </div>

                {/* AI Answer */}
                <div className="rounded-xl border border-rule bg-bg2 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-md bg-accent/10">
                      <Sparkles className="h-3 w-3 text-accent" />
                    </div>
                    <span className="text-xs font-medium text-accent">
                      AI 回答
                    </span>
                    <span className="ml-auto flex items-center gap-1 text-xs text-muted">
                      <Zap className="h-3 w-3" />
                      {answer.responseTime.toFixed(2)}s
                    </span>
                  </div>
                  <div className="text-sm leading-relaxed text-ink whitespace-pre-line">
                    {answer.answer}
                  </div>
                </div>

                {/* Sources */}
                {answer.sources.length > 0 && (
                  <div>
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted">
                      <BookOpen className="h-3.5 w-3.5" />
                      引用来源
                      <span className="rounded bg-accent/10 px-1.5 py-0.5 text-accent">
                        {answer.sources.length}
                      </span>
                    </p>
                    <div className="space-y-2">
                      {answer.sources.map((source) => (
                        <div
                          key={source.chunkId}
                          className="rounded-lg border border-rule bg-surface p-3 transition-colors hover:bg-surface2"
                        >
                          <div className="mb-1.5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="h-3.5 w-3.5 text-accent2" />
                              <span className="text-xs font-medium text-ink">
                                {source.documentName}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {source.pageNumber && (
                                <span className="text-xs text-muted">
                                  P.{source.pageNumber}
                                </span>
                              )}
                              <span
                                className={cn(
                                  "rounded px-1.5 py-0.5 text-xs font-medium",
                                  source.similarity >= 0.9
                                    ? "bg-accent/10 text-accent"
                                    : source.similarity >= 0.8
                                      ? "bg-accent2/10 text-accent2"
                                      : "bg-accent3/10 text-accent3",
                                )}
                              >
                                {(source.similarity * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                          <p className="line-clamp-2 text-xs leading-relaxed text-muted">
                            {source.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Retrieval Stats */}
                {answer.retrievalCount > 0 && (
                  <div className="flex items-center justify-center gap-4 rounded-lg bg-bg2 px-3 py-2 text-xs text-muted">
                    <span>检索 {answer.retrievalCount} 个相关片段</span>
                    <span className="h-3 w-px bg-rule" />
                    <span>耗时 {answer.responseTime.toFixed(2)}s</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-rule p-4">
        <div className="flex items-center gap-2 rounded-xl border border-rule bg-bg2 px-3 py-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入问题，基于知识库回答..."
            disabled={isQuerying}
            className={cn(
              "flex-1 bg-transparent text-sm text-ink placeholder:text-muted outline-none",
              isQuerying && "opacity-50",
            )}
          />
          <button
            onClick={handleSend}
            disabled={!inputQuery.trim() || isQuerying}
            className={cn(
              "rounded-lg p-2 transition-opacity",
              inputQuery.trim() && !isQuerying
                ? "bg-accent text-bg hover:opacity-90"
                : "bg-rule text-muted cursor-not-allowed opacity-50",
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
