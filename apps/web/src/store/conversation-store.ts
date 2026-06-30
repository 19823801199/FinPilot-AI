import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Conversation } from "@/types";

interface ConversationStore {
  conversations: Conversation[];
  currentConversationId: string | null;
  createConversation: () => string;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  updateConversationTitle: (id: string, title: string) => void;
}

const mockConversations: Conversation[] = [
  {
    id: "conv-001",
    title: "贵州茅台财报分析",
    createdAt: "2025-06-20T10:30:00Z",
    updatedAt: "2025-06-20T11:45:00Z",
    lastMessage: "茅台2025年Q1营收同比增长18.2%，净利润增长20.5%...",
  },
  {
    id: "conv-002",
    title: "MACD技术指标学习",
    createdAt: "2025-06-19T14:20:00Z",
    updatedAt: "2025-06-19T15:10:00Z",
    lastMessage: "MACD金叉信号出现在零轴上方时，通常预示着...",
  },
];

export const useConversationStore = create<ConversationStore>()(
  persist(
    (set) => ({
      conversations: mockConversations,
      currentConversationId: "conv-001",

      createConversation: () => {
        const newConv: Conversation = {
          id: `conv-${Date.now()}`,
          title: "新对话",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastMessage: undefined,
        };
        set((state) => ({
          conversations: [newConv, ...state.conversations],
          currentConversationId: newConv.id,
        }));
        return newConv.id;
      },

      selectConversation: (id) => set({ currentConversationId: id }),

      deleteConversation: (id) =>
        set((state) => {
          const filtered = state.conversations.filter((c) => c.id !== id);
          const newCurrentId =
            state.currentConversationId === id
              ? (filtered[0]?.id ?? null)
              : state.currentConversationId;
          return {
            conversations: filtered,
            currentConversationId: newCurrentId,
          };
        }),

      updateConversationTitle: (id, title) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id
              ? { ...c, title, updatedAt: new Date().toISOString() }
              : c,
          ),
        })),
    }),
    {
      name: "finpilot-conversations",
      partialize: (state) => ({
        conversations: state.conversations,
        currentConversationId: state.currentConversationId,
      }),
    },
  ),
);

export type { ConversationStore as ConversationState };
