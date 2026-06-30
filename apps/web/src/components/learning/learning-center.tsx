"use client";

import { CourseSidebar } from "./course-sidebar";
import { ChapterContent } from "./chapter-content";
import { StudyStatsPanel } from "./study-stats-panel";
import { useLearningStore } from "@/store/learning-store";
import { useMistakeStore } from "@/store/mistake-store";
import type { MistakeRecord } from "@/types/learning";
import { BookOpen, AlertTriangle, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

type ViewMode = "courses" | "chapter" | "exercise" | "mistakes";

export function LearningCenter() {
  const { selectedCourse, selectedChapter } = useLearningStore();
  const [viewMode, setViewMode] = useState<ViewMode>("courses");

  const handleCourseSelect = () => {
    setViewMode("chapter");
  };

  const handleStartExercise = () => {
    setViewMode("exercise");
  };

  const handleViewMistakes = () => {
    setViewMode("mistakes");
  };

  const handleBackToCourses = () => {
    setViewMode("courses");
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-bg">
      {/* Left Sidebar - Course List */}
      <div className="hidden w-[280px] shrink-0 md:block">
        <CourseSidebar
          onSelectCourse={handleCourseSelect}
          onViewMistakes={handleViewMistakes}
          activeView={viewMode}
        />
      </div>

      {/* Center Content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {viewMode === "courses" && !selectedCourse && (
          <CourseListView onSelectCourse={handleCourseSelect} />
        )}
        {viewMode === "chapter" && selectedCourse && (
          <ChapterContent
            onBack={handleBackToCourses}
            onStartExercise={handleStartExercise}
          />
        )}
        {viewMode === "exercise" && selectedChapter && (
          <ChapterContent
            onBack={handleBackToCourses}
            onStartExercise={handleStartExercise}
          />
        )}
        {viewMode === "mistakes" && (
          <MistakesView onBack={handleBackToCourses} />
        )}
      </div>

      {/* Right Stats Panel */}
      <div className="hidden w-[260px] shrink-0 lg:block">
        <StudyStatsPanel />
      </div>
    </div>
  );
}

function CourseListView({ onSelectCourse }: { onSelectCourse: () => void }) {
  const { courses, selectCourse } = useLearningStore();

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">AI 学习助手</h1>
        <p className="mt-1 text-sm text-muted">
          系统化的金融知识学习平台，覆盖 431 金融综合全部考点
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <button
            key={course.id}
            onClick={() => {
              selectCourse(course);
              onSelectCourse();
            }}
            className={cn(
              "group rounded-xl border border-rule bg-surface p-5 text-left transition-all hover:border-accent/30 hover:bg-surface2",
            )}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <GraduationCap className="h-5 w-5 text-accent" />
              </div>
              <span className="rounded-lg bg-accent2/10 px-2 py-0.5 text-xs font-medium text-accent2">
                {course.category}
              </span>
            </div>
            <h3 className="mb-1 text-base font-semibold text-ink">
              {course.name}
            </h3>
            <p className="mb-3 line-clamp-2 text-xs text-muted">
              {course.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted">
              <span>{course.chapterCount} 章节</span>
              <span>{course.totalQuestions} 题</span>
              <span>~{course.estimatedHours}h</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function MistakesView({ onBack }: { onBack: () => void }) {
  const { mistakes, removeMistake } = useMistakeStore();

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">错题本</h1>
          <p className="mt-1 text-sm text-muted">
            共 {mistakes.length} 道错题，持续复习巩固薄弱环节
          </p>
        </div>
        <button
          onClick={onBack}
          className="rounded-lg border border-rule bg-surface px-4 py-2 text-sm text-ink transition-colors hover:bg-surface2"
        >
          返回
        </button>
      </div>

      {mistakes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <BookOpen className="mb-4 h-12 w-12 text-muted" />
          <p className="text-lg font-medium text-ink">暂无错题</p>
          <p className="mt-1 text-sm text-muted">继续保持，你做得很好</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {mistakes.map((mistake: MistakeRecord) => (
            <div
              key={mistake.id}
              className="rounded-xl border border-rule bg-surface p-5"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-danger" />
                  <span className="rounded-lg bg-danger/10 px-2 py-0.5 text-xs font-medium text-danger">
                    错 {mistake.errorCount} 次
                  </span>
                  <span className="rounded-lg bg-accent2/10 px-2 py-0.5 text-xs font-medium text-accent2">
                    {mistake.knowledgePoint}
                  </span>
                </div>
                <button
                  onClick={() => removeMistake(mistake.id)}
                  className="text-xs text-muted transition-colors hover:text-danger"
                >
                  移除
                </button>
              </div>
              <p className="mb-3 text-sm text-ink">{mistake.question}</p>
              <div className="mb-2 rounded-lg bg-danger/5 p-3">
                <p className="mb-1 text-xs font-medium text-danger">
                  你的答案：
                </p>
                <p className="text-sm text-ink">{mistake.userAnswer}</p>
              </div>
              <div className="mb-2 rounded-lg bg-accent/5 p-3">
                <p className="mb-1 text-xs font-medium text-accent">
                  正确答案：
                </p>
                <p className="text-sm text-ink">{mistake.correctAnswer}</p>
              </div>
              <div className="rounded-lg bg-accent3/5 p-3">
                <p className="mb-1 text-xs font-medium text-accent3">
                  错误原因：
                </p>
                <p className="text-sm text-ink">{mistake.errorReason}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
