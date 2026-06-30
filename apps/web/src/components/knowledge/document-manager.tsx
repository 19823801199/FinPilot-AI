"use client";

import { cn } from "@/lib/utils";
import { useKnowledgeStore } from "@/store/knowledge-store";
import type { KnowledgeDocument } from "@/types/knowledge";
import {
  Upload,
  FileText,
  File,
  FileType,
  FileSpreadsheet,
  Search,
  Trash2,
  Eye,
  Clock,
  Layers,
  Database,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import * as React from "react";

const contentTypeIcons: Record<string, React.ReactNode> = {
  pdf: <FileText className="h-5 w-5" />,
  docx: <FileType className="h-5 w-5" />,
  txt: <File className="h-5 w-5" />,
  md: <FileText className="h-5 w-5" />,
  pptx: <FileSpreadsheet className="h-5 w-5" />,
};

const contentTypeColors: Record<string, string> = {
  pdf: "text-red-400 bg-red-400/10",
  docx: "text-blue-400 bg-blue-400/10",
  txt: "text-gray-400 bg-gray-400/10",
  md: "text-accent bg-accent/10",
  pptx: "text-orange-400 bg-orange-400/10",
};

const supportedFormats = ["PDF", "DOCX", "TXT", "MD", "PPTX"];

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function getStatusConfig(status: KnowledgeDocument["status"]) {
  switch (status) {
    case "ready":
      return {
        icon: CheckCircle2,
        label: "已就绪",
        color: "text-accent",
        bgColor: "bg-accent/10",
      };
    case "processing":
      return {
        icon: Loader2,
        label: "处理中",
        color: "text-accent3",
        bgColor: "bg-accent3/10",
      };
    case "error":
      return {
        icon: AlertCircle,
        label: "失败",
        color: "text-danger",
        bgColor: "bg-danger/10",
      };
  }
}

export function DocumentManager() {
  const [selectedDoc, setSelectedDoc] =
    React.useState<KnowledgeDocument | null>(null);
  const {
    documents,
    selectedCategory,
    selectedDocument,
    searchQuery,
    setSearchQuery,
    setSelectedDocument,
    removeDocument,
  } = useKnowledgeStore();

  const filteredDocuments = React.useMemo(() => {
    let filtered = documents;

    if (selectedCategory) {
      filtered = filtered.filter((d) => d.category === selectedCategory);
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter(
        (d) =>
          d.filename.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    return filtered;
  }, [documents, selectedCategory, searchQuery]);

  const handleDelete = (id: string) => {
    removeDocument(id);
    if (selectedDocument?.id === id) {
      setSelectedDocument(null);
    }
    if (selectedDoc?.id === id) {
      setSelectedDoc(null);
    }
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-rule px-6 py-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">文档管理</h2>
          <p className="text-xs text-muted">
            共 {filteredDocuments.length} 个文档
            {selectedCategory && ` · ${selectedCategory}`}
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <div className="border-b border-rule px-6 py-4">
        <div className="rounded-xl border-2 border-dashed border-rule bg-bg2 p-6 text-center transition-colors hover:border-accent/30">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
            <Upload className="h-6 w-6 text-accent" />
          </div>
          <p className="text-sm font-medium text-ink">
            点击或拖拽文件到此处上传
          </p>
          <p className="mt-1 text-xs text-muted">
            支持以下格式，单个文件最大 50MB
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {supportedFormats.map((fmt) => (
              <span
                key={fmt}
                className="rounded-md border border-rule bg-surface px-2 py-0.5 text-xs text-muted"
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="border-b border-rule px-6 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索文档名称、分类或标签..."
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

      {/* Document List */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {filteredDocuments.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filteredDocuments.map((doc) => {
              const statusConfig = getStatusConfig(doc.status);
              const StatusIcon = statusConfig.icon;
              const iconColor =
                contentTypeColors[doc.contentType] || "text-muted bg-muted/10";

              return (
                <div
                  key={doc.id}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border border-rule bg-surface p-4 transition-colors",
                    selectedDoc?.id === doc.id
                      ? "border-accent/40 bg-accent/5"
                      : "hover:bg-surface2",
                  )}
                >
                  {/* File Icon */}
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                      iconColor.split(" ")[1],
                    )}
                  >
                    <span className={iconColor.split(" ")[0]}>
                      {contentTypeIcons[doc.contentType] || (
                        <File className="h-5 w-5" />
                      )}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-ink">
                        {doc.filename}
                      </span>
                      <span className="shrink-0 rounded bg-bg2 px-1.5 py-0.5 text-xs text-muted uppercase">
                        {doc.contentType}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted">
                      <span>{formatSize(doc.size)}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(doc.createdAt)}
                      </span>
                      <span className="rounded bg-bg2 px-1.5 py-0.5">
                        {doc.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Layers className="h-3 w-3" />
                        {doc.chunkCount} chunks
                      </span>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={cn(
                        "flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium",
                        statusConfig.bgColor,
                        statusConfig.color,
                      )}
                    >
                      <StatusIcon
                        className={cn(
                          "h-3 w-3",
                          doc.status === "processing" && "animate-spin",
                        )}
                      />
                      {statusConfig.label}
                    </span>
                    <button
                      onClick={() =>
                        setSelectedDoc(selectedDoc?.id === doc.id ? null : doc)
                      }
                      className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface2 hover:text-ink"
                      title="查看详情"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="rounded-lg p-1.5 text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                      title="删除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Database className="h-10 w-10 text-muted/40" />
            <p className="mt-3 text-sm font-medium text-muted">
              {searchQuery || selectedCategory
                ? "未找到匹配的文档"
                : "暂无文档"}
            </p>
            <p className="mt-1 text-xs text-muted/60">
              {searchQuery || selectedCategory
                ? "尝试调整搜索条件或分类筛选"
                : "上传文档以开始构建知识库"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
