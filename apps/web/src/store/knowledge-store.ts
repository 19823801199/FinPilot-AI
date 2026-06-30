"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  KnowledgeDocument,
  KnowledgeStats,
  KnowledgeCategory,
} from "@/types/knowledge";

const mockDocuments: KnowledgeDocument[] = [
  {
    id: "doc-001",
    filename: "2025年Q1财务报告.pdf",
    contentType: "pdf",
    size: 2516582,
    category: "财务报告",
    tags: ["财务", "季度报告", "2025"],
    chunkCount: 42,
    status: "ready",
    createdAt: "2026-06-20T10:30:00Z",
    updatedAt: "2026-06-20T10:35:00Z",
  },
  {
    id: "doc-002",
    filename: "新能源汽车行业深度研究.pdf",
    contentType: "pdf",
    size: 5347737,
    category: "行业研究",
    tags: ["新能源", "汽车", "行业研究"],
    chunkCount: 38,
    status: "ready",
    createdAt: "2026-06-18T14:20:00Z",
    updatedAt: "2026-06-18T14:28:00Z",
  },
  {
    id: "doc-003",
    filename: "央行货币政策解读.docx",
    contentType: "docx",
    size: 1258291,
    category: "政策法规",
    tags: ["央行", "货币政策", "利率"],
    chunkCount: 28,
    status: "ready",
    createdAt: "2026-06-15T09:15:00Z",
    updatedAt: "2026-06-15T09:20:00Z",
  },
  {
    id: "doc-004",
    filename: "价值投资学习笔记.md",
    contentType: "md",
    size: 46080,
    category: "学习笔记",
    tags: ["价值投资", "巴菲特", "学习"],
    chunkCount: 18,
    status: "ready",
    createdAt: "2026-06-12T16:45:00Z",
    updatedAt: "2026-06-12T16:48:00Z",
  },
  {
    id: "doc-005",
    filename: "半导体行业数据汇总.pptx",
    contentType: "pptx",
    size: 3984588,
    category: "行业研究",
    tags: ["半导体", "芯片", "数据"],
    chunkCount: 30,
    status: "processing",
    createdAt: "2026-06-10T11:00:00Z",
    updatedAt: "2026-06-10T11:02:00Z",
  },
];

const mockStats: KnowledgeStats = {
  totalDocuments: 5,
  totalChunks: 156,
  totalEmbeddings: 156,
  storageUsed: "12.8 MB",
};

const mockCategories: KnowledgeCategory[] = [
  { id: "cat-001", name: "财务报告", count: 1, icon: "FileText" },
  { id: "cat-002", name: "行业研究", count: 2, icon: "TrendingUp" },
  { id: "cat-003", name: "政策法规", count: 1, icon: "Scale" },
  { id: "cat-004", name: "学习笔记", count: 1, icon: "BookOpen" },
];

export interface KnowledgeState {
  documents: KnowledgeDocument[];
  stats: KnowledgeStats;
  categories: KnowledgeCategory[];
  searchQuery: string;
  selectedCategory: string | null;
  selectedDocument: KnowledgeDocument | null;
  setDocuments: (documents: KnowledgeDocument[]) => void;
  addDocument: (document: KnowledgeDocument) => void;
  removeDocument: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedDocument: (document: KnowledgeDocument | null) => void;
}

export const useKnowledgeStore = create<KnowledgeState>()(
  persist(
    (set) => ({
      documents: mockDocuments,
      stats: mockStats,
      categories: mockCategories,
      searchQuery: "",
      selectedCategory: null,
      selectedDocument: null,
      setDocuments: (documents) => set({ documents }),
      addDocument: (document) =>
        set((state) => ({
          documents: [document, ...state.documents],
          stats: {
            ...state.stats,
            totalDocuments: state.stats.totalDocuments + 1,
          },
        })),
      removeDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== id),
          stats: {
            ...state.stats,
            totalDocuments: state.stats.totalDocuments - 1,
          },
        })),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
      setSelectedDocument: (selectedDocument) => set({ selectedDocument }),
    }),
    {
      name: "finpilot-knowledge",
      partialize: (state) => ({
        selectedCategory: state.selectedCategory,
      }),
    },
  ),
);
