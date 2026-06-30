"use client";

import { useExerciseStore } from "@/store/exercise-store";
import { useMistakeStore } from "@/store/mistake-store";
import { useLearningStore } from "@/store/learning-store";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Send,
  RotateCcw,
  Loader2,
  AlertTriangle,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { SubmitResult } from "@/types/learning";

export function ExercisePanel() {
  const {
    questions,
    currentQuestionIndex,
    userAnswers,
    results,
    isSubmitting,
    showResults,
    selectAnswer,
    submitExercise,
    resetExercise,
    nextQuestion,
    prevQuestion,
  } = useExerciseStore();
  const { addMistake } = useMistakeStore();
  const { selectedChapter } = useLearningStore();
  const [shortAnswerInput, setShortAnswerInput] = useState("");

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleShortAnswerSubmit = () => {
    if (shortAnswerInput.trim()) {
      selectAnswer(currentQuestion.id, shortAnswerInput.trim());
    }
  };

  const handleSubmitAll = () => {
    submitExercise();
  };

  const handleReset = () => {
    resetExercise();
    setShortAnswerInput("");
  };

  const handleAddToMistakes = (result: SubmitResult) => {
    const ts = new Date().toISOString();
    addMistake({
      id: `mistake-${ts}`,
      questionId: result.questionId,
      question:
        questions.find((q) => q.id === result.questionId)?.question || "",
      userAnswer: result.userAnswer,
      correctAnswer: result.correctAnswer,
      errorReason: result.explanation,
      knowledgePoint: result.knowledgePoint,
      errorCount: 1,
      lastPracticeAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
  };

  const difficultyConfig = {
    easy: { label: "简单", color: "text-accent", bg: "bg-accent/10" },
    medium: { label: "中等", color: "text-accent3", bg: "bg-accent3/10" },
    hard: { label: "困难", color: "text-danger", bg: "bg-danger/10" },
  };

  // Results view
  if (showResults && results) {
    const correctCount = results.filter((r) => r.correct).length;
    const score = Math.round((correctCount / totalQuestions) * 100);

    return (
      <div className="flex h-full flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-rule px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-ink">练习结果</h2>
              <p className="text-xs text-muted">
                {selectedChapter?.title} — {correctCount}/{totalQuestions} 正确
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold",
                  score >= 80
                    ? "bg-accent/10 text-accent"
                    : score >= 60
                      ? "bg-accent3/10 text-accent3"
                      : "bg-danger/10 text-danger",
                )}
              >
                {score}
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 rounded-lg border border-rule bg-surface px-4 py-2 text-sm text-ink transition-colors hover:bg-surface2"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                重新练习
              </button>
            </div>
          </div>
          {/* Score bar */}
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-rule">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                score >= 80
                  ? "bg-accent"
                  : score >= 60
                    ? "bg-accent3"
                    : "bg-danger",
              )}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-4">
            {results.map((result, idx) => {
              const question = questions.find(
                (q) => q.id === result.questionId,
              );
              if (!question) return null;
              const diff = difficultyConfig[question.difficulty];

              return (
                <div
                  key={result.questionId}
                  className={cn(
                    "rounded-xl border p-5",
                    result.correct
                      ? "border-accent/20 bg-accent/5"
                      : "border-danger/20 bg-danger/5",
                  )}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted">
                        第 {idx + 1} 题
                      </span>
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-xs font-medium",
                          diff.bg,
                          diff.color,
                        )}
                      >
                        {diff.label}
                      </span>
                      <span className="rounded bg-accent2/10 px-1.5 py-0.5 text-xs text-accent2">
                        {result.knowledgePoint}
                      </span>
                    </div>
                    {result.correct ? (
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                    ) : (
                      <XCircle className="h-5 w-5 text-danger" />
                    )}
                  </div>

                  <p className="mb-3 text-sm text-ink">{question.question}</p>

                  {!result.correct && (
                    <>
                      <div className="mb-2 rounded-lg bg-danger/10 p-3">
                        <p className="mb-1 text-xs font-medium text-danger">
                          你的答案
                        </p>
                        <p className="text-sm text-ink">{result.userAnswer}</p>
                      </div>
                      <div className="mb-2 rounded-lg bg-accent/10 p-3">
                        <p className="mb-1 text-xs font-medium text-accent">
                          正确答案
                        </p>
                        <p className="text-sm text-ink">
                          {result.correctAnswer}
                        </p>
                      </div>
                    </>
                  )}

                  <div className="rounded-lg bg-surface p-3">
                    <p className="mb-1 text-xs font-medium text-muted">解析</p>
                    <p className="text-sm text-ink">{result.explanation}</p>
                  </div>

                  {!result.correct && (
                    <button
                      onClick={() => handleAddToMistakes(result)}
                      className="mt-3 flex items-center gap-1.5 text-xs text-accent3 transition-colors hover:text-accent"
                    >
                      <AlertTriangle className="h-3 w-3" />
                      加入错题本
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Question view
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-rule px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink">
              {selectedChapter?.title} — 练习
            </h2>
            <p className="text-xs text-muted">
              第 {currentQuestionIndex + 1} / {totalQuestions} 题
            </p>
          </div>
          <button
            onClick={handleSubmitAll}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2 text-sm font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            提交全部
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-rule">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Dots */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => {
                useExerciseStore.setState({ currentQuestionIndex: idx });
                const existingAnswer = userAnswers[q.id];
                if (
                  (q.type === "short_answer" || q.type === "calculation") &&
                  existingAnswer
                ) {
                  setShortAnswerInput(existingAnswer);
                } else {
                  setShortAnswerInput("");
                }
              }}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded text-xs font-medium transition-all",
                idx === currentQuestionIndex
                  ? "bg-accent text-bg"
                  : userAnswers[q.id]
                    ? "bg-accent/20 text-accent"
                    : "bg-surface2 text-muted hover:bg-surface",
              )}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl">
          {/* Question Meta */}
          <div className="mb-4 flex items-center gap-2">
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-xs font-medium",
                difficultyConfig[currentQuestion.difficulty].bg,
                difficultyConfig[currentQuestion.difficulty].color,
              )}
            >
              {difficultyConfig[currentQuestion.difficulty].label}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted">
              <Tag className="h-3 w-3" />
              {currentQuestion.knowledgePoint}
            </span>
          </div>

          {/* Question */}
          <h3 className="mb-6 text-base font-semibold text-ink leading-relaxed">
            {currentQuestion.question}
          </h3>

          {/* Options for choice questions */}
          {(currentQuestion.type === "single_choice" ||
            currentQuestion.type === "true_false") &&
            currentQuestion.options && (
              <div className="flex flex-col gap-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = userAnswers[currentQuestion.id] === option;
                  const optionLabel = String.fromCharCode(65 + idx);

                  return (
                    <button
                      key={idx}
                      onClick={() => selectAnswer(currentQuestion.id, option)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border p-4 text-left transition-all",
                        isSelected
                          ? "border-accent/50 bg-accent/10"
                          : "border-rule bg-surface hover:border-accent/30 hover:bg-surface2",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                          isSelected
                            ? "bg-accent text-bg"
                            : "bg-surface2 text-muted",
                        )}
                      >
                        {optionLabel}
                      </span>
                      <span
                        className={cn(
                          "text-sm",
                          isSelected ? "text-accent font-medium" : "text-ink",
                        )}
                      >
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

          {/* Multiple choice */}
          {currentQuestion.type === "multiple_choice" &&
            currentQuestion.options && (
              <div className="flex flex-col gap-3">
                {currentQuestion.options.map((option, idx) => {
                  const currentAnswer = userAnswers[currentQuestion.id] || "";
                  const selectedOptions = currentAnswer
                    .split(",")
                    .map((s) => s.trim());
                  const isSelected = selectedOptions.includes(option);
                  const optionLabel = String.fromCharCode(65 + idx);

                  const toggleMultiSelect = () => {
                    let newSelected: string[];
                    if (isSelected) {
                      newSelected = selectedOptions.filter((o) => o !== option);
                    } else {
                      newSelected = [...selectedOptions, option];
                    }
                    selectAnswer(currentQuestion.id, newSelected.join(","));
                  };

                  return (
                    <button
                      key={idx}
                      onClick={toggleMultiSelect}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border p-4 text-left transition-all",
                        isSelected
                          ? "border-accent/50 bg-accent/10"
                          : "border-rule bg-surface hover:border-accent/30 hover:bg-surface2",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold",
                          isSelected
                            ? "border-accent bg-accent text-bg"
                            : "border-rule bg-surface2 text-muted",
                        )}
                      >
                        {isSelected ? "✓" : optionLabel}
                      </span>
                      <span
                        className={cn(
                          "text-sm",
                          isSelected ? "text-accent font-medium" : "text-ink",
                        )}
                      >
                        {option}
                      </span>
                    </button>
                  );
                })}
                <p className="text-xs text-muted">（多选题，可选择多个选项）</p>
              </div>
            )}

          {/* Short answer / Calculation */}
          {(currentQuestion.type === "short_answer" ||
            currentQuestion.type === "calculation") && (
            <div>
              <textarea
                value={
                  shortAnswerInput || userAnswers[currentQuestion.id] || ""
                }
                onChange={(e) => {
                  setShortAnswerInput(e.target.value);
                  selectAnswer(currentQuestion.id, e.target.value);
                }}
                placeholder={
                  currentQuestion.type === "calculation"
                    ? "请输入计算过程和答案..."
                    : "请输入你的答案..."
                }
                rows={6}
                className="w-full rounded-xl border border-rule bg-surface p-4 text-sm text-ink placeholder:text-muted focus:border-accent/50 focus:outline-none resize-none"
              />
              <button
                onClick={handleShortAnswerSubmit}
                className="mt-2 rounded-lg bg-accent2/10 px-4 py-2 text-sm text-accent2 transition-colors hover:bg-accent2/20"
              >
                确认答案
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-rule px-6 py-3">
        <button
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm text-muted transition-colors hover:bg-surface2 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" />
          上一题
        </button>

        <div className="flex items-center gap-2 text-xs text-muted">
          <span>
            {currentQuestionIndex + 1} / {totalQuestions}
          </span>
        </div>

        <button
          onClick={() => {
            if (currentQuestionIndex < totalQuestions - 1) {
              nextQuestion();
              const nextQ = questions[currentQuestionIndex + 1];
              if (
                (nextQ.type === "short_answer" ||
                  nextQ.type === "calculation") &&
                userAnswers[nextQ.id]
              ) {
                setShortAnswerInput(userAnswers[nextQ.id]);
              } else {
                setShortAnswerInput("");
              }
            }
          }}
          disabled={currentQuestionIndex === totalQuestions - 1}
          className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm text-muted transition-colors hover:bg-surface2 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          下一题
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
