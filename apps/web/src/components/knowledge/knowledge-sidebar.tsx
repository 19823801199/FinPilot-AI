"use client";

import { cn } from "@/lib/utils";
import { useKnowledgeStore } from "@/store/knowledge-store";
import {
  Database,
  Layers,
  Cpu,
  HardDrive,
  FileText,
  TrendingUp,
  Scale,
  BookOpen,
  Clock,
  Search,
  X,
  Tag,
} from "lucide-react";
import * as React from "react";

const categoryIcons: Record<string, React.ReactNode> = {
  FileText: <FileText className="h-4 w-4" />,
  TrendingUp: <TrendingUp className="h-4 w-4" />,
  Scale: <Scale className="h-4 w-4" />,
  BookOpen: <BookOpen className="h-4 w-4" />,
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
  });
}

export function KnowledgeSidebar() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const {
    stats,
    categories,
    documents,
    selectedCategory,
    setSelectedCategory,
  } = useKnowledgeStore();

  const allTags = React.useMemo(() => {
    const tagMap = new Map<string, number>();
    documents.forEach((doc) => {
      doc.tags.forEach((tag) => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });
    return Array.from(tagMap.entries()).sort((a, b) => b[1] - a[1]);
  }, [documents]);

  const recentDocuments = React.useMemo(
    () =>
      [...documents]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 3),
    [documents],
  );

  const statsItems = [
    { label: "文档数", value: stats.totalDocuments, icon: Database },
    { label: "Chunk 数", value: stats.totalChunks, icon: Layers },
    { label: "Embedding", value: stats.totalEmbeddings, icon: Cpu },
    { label: "存储量", value: stats.storageUsed, icon: HardDrive },
  ];

  return (
    <div className="flex w-[280px] shrink-0 flex-col border-r border-rule bg-surface">
      {/* Header */}
      <div className="border-b border-rule px-4 py-3">
        <h2 className="text-sm font-semibold text-ink">知识库管理</h2>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索分类或标签..."
            className={cn(
              "h-9 w-full rounded-lg border border-rule bg-bg2 pl-9 pr-8 text-sm text-ink placeholder:text-muted/60",
              "outline-none transition-all focus-visible:border-accent/50 focus-visible:ring-1 focus-visible:ring-accent/40",
            )}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted transition-colors hover:bg-surface2 hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-rule px-4 py-3">
        <p className="mb-2 text-xs font-medium text-muted">知识库概览</p>
        <div className="grid grid-cols-2 gap-2">
          {statsItems.map((item) => (
            <div
              key={item.label}
              className="flex flex-col rounded-lg border border-rule bg-bg2 px-3 py-2"
            >
              <div className="flex items-center gap-1.5">
                <item.icon className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs text-muted">{item.label}</span>
              </div>
              <span className="mt-1 text-sm font-semibold text-ink">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="border-b border-rule px-4 py-3">
        <p className="mb-2 text-xs font-medium text-muted">文档分类</p>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors",
              selectedCategory === null
                ? "bg-accent/10 text-accent"
                : "text-ink hover:bg-surface2",
            )}
          >
            <Database className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-sm">全部文档</span>
            <span className="text-xs text-muted">{documents.length}</span>
          </button>
          {categories
            .filter(
              (cat) =>
                !searchQuery ||
                cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
            )
            .map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === cat.name ? null : cat.name,
                  )
                }
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                  selectedCategory === cat.name
                    ? "bg-accent/10 text-accent"
                    : "text-ink hover:bg-surface2",
                )}
              >
                <span className="shrink-0 text-muted">
                  {categoryIcons[cat.icon] || <FileText className="h-4 w-4" />}
                </span>
                <span className="flex-1 text-sm">{cat.name}</span>
                <span className="text-xs text-muted">{cat.count}</span>
              </button>
            ))}
        </div>
      </div>

      {/* Tags */}
      <div className="border-b border-rule px-4 py-3">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted">
          <Tag className="h-3.5 w-3.5" />
          标签云
        </p>
        <div className="flex flex-wrap gap-1.5">
          {allTags.map(([tag, count]) => (
            <span
              key={tag}
              className="rounded-md border border-rule bg-bg2 px-2 py-1 text-xs text-muted transition-colors hover:border-accent/30 hover:text-ink"
            >
              {tag}
              <span className="ml-1 text-accent/60">{count}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Recent Uploads */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted">
          <Clock className="h-3.5 w-3.5" />
          最近上传
        </p>
        <div className="space-y-1">
          {recentDocuments.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors hover:bg-surface2"
            >
              <FileText className="h-4 w-4 shrink-0 text-accent2" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-ink">
                  {doc.filename}
                </p>
                <p className="text-xs text-muted">
                  {formatDate(doc.createdAt)} · {formatSize(doc.size)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
