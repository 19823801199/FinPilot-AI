"use client";

import { useLearningStore } from "@/store/learning-store";
import { useMistakeStore } from "@/store/mistake-store";
import {
  Search,
  BookOpen,
  ChevronRight,
  AlertTriangle,
  Star,
  GraduationCap,
  Landmark,
  TrendingUp,
  BarChart3,
  Building2,
  Shield,
  ShieldAlert,
  LineChart,
  Globe,
  Banknote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Banknote,
  Building2,
  TrendingUp,
  BarChart3,
  Landmark,
  Shield,
  LineChart,
  Globe,
  ShieldAlert,
  GraduationCap,
};

interface CourseSidebarProps {
  onSelectCourse: () => void;
  onViewMistakes: () => void;
  activeView: string;
}

export function CourseSidebar({
  onSelectCourse,
  onViewMistakes,
  activeView,
}: CourseSidebarProps) {
  const {
    courses,
    selectedCourse,
    chapters,
    selectCourse,
    selectChapter,
    searchQuery,
    setSearchQuery,
  } = useLearningStore();
  const { mistakes } = useMistakeStore();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const filteredCourses = courses.filter(
    (c) =>
      c.name.includes(localSearch) ||
      c.category.includes(localSearch) ||
      c.description.includes(localSearch),
  );

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    setSearchQuery(value);
  };

  return (
    <div className="flex h-full flex-col border-r border-rule bg-bg2">
      {/* Header */}
      <div className="border-b border-rule p-4">
        <h2 className="mb-3 text-sm font-semibold text-ink">课程列表</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="搜索课程..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-lg border border-rule bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-accent/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Course List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex flex-col gap-1">
          {filteredCourses.map((course) => {
            const isSelected = selectedCourse?.id === course.id;
            const IconComp = iconMap[course.icon] || BookOpen;
            const courseChapters = chapters.filter(
              (ch) => ch.courseId === course.id,
            );

            return (
              <div key={course.id}>
                <button
                  onClick={() => {
                    selectCourse(course);
                    onSelectCourse();
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all",
                    isSelected
                      ? "bg-accent/10 text-accent"
                      : "text-ink hover:bg-surface2",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      isSelected ? "bg-accent/20" : "bg-surface",
                    )}
                  >
                    <IconComp
                      className={cn(
                        "h-4 w-4",
                        isSelected ? "text-accent" : "text-muted",
                      )}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {course.name}
                    </p>
                    <p className="text-xs text-muted">
                      {course.chapterCount} 章 / {course.totalQuestions} 题
                    </p>
                  </div>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isSelected ? "text-accent" : "text-muted",
                    )}
                  />
                </button>

                {/* Expanded chapters */}
                {isSelected && (
                  <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-rule pl-3">
                    {courseChapters.map((chapter) => (
                      <button
                        key={chapter.id}
                        onClick={() => selectChapter(chapter)}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-surface2"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-surface2 text-[10px] font-medium text-muted">
                          {chapter.index}
                        </span>
                        <span className="truncate text-muted">
                          {chapter.title}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-rule p-3">
        <button
          onClick={onViewMistakes}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
            activeView === "mistakes"
              ? "bg-danger/10 text-danger"
              : "text-muted hover:bg-surface2 hover:text-ink",
          )}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>错题本</span>
          {mistakes.length > 0 && (
            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-danger/20 text-[10px] font-bold text-danger">
              {mistakes.length}
            </span>
          )}
        </button>
        <button className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface2 hover:text-ink">
          <Star className="h-4 w-4" />
          <span>收藏知识点</span>
        </button>
      </div>
    </div>
  );
}
