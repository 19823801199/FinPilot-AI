import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MistakeRecord } from "@/types/learning";

const mockMistakes: MistakeRecord[] = [
  {
    id: "mistake-1",
    questionId: "q-1-8",
    question:
      "假设基础货币B=1000亿元，法定存款准备金率为10%，超额准备金率为2%，现金漏损率为5%，求货币乘数和货币供给量M1。",
    userAnswer: "货币乘数m = 1/(10%+5%) = 6.67；M1 = 6670亿元",
    correctAnswer:
      "货币乘数m = 1/(10%+2%+5%) = 1/0.17 ≈ 5.88；M1 = 1000 × 5.88 = 5880亿元",
    errorReason: "漏算了超额准备金率，货币乘数公式中应包含所有漏出率",
    knowledgePoint: "货币乘数",
    errorCount: 2,
    lastPracticeAt: "2026-06-20T14:30:00Z",
    createdAt: "2026-06-15T10:00:00Z",
  },
  {
    id: "mistake-2",
    questionId: "q-2-7",
    question: "在无税条件下，MM定理I（无税）认为企业价值与资本结构的关系是？",
    userAnswer: "正相关",
    correctAnswer: "无关",
    errorReason: "混淆了有税和无税条件下的MM定理结论",
    knowledgePoint: "MM定理",
    errorCount: 1,
    lastPracticeAt: "2026-06-21T09:15:00Z",
    createdAt: "2026-06-21T09:15:00Z",
  },
  {
    id: "mistake-3",
    questionId: "q-10-1",
    question:
      "某项目初始投资100万元，第1-3年每年现金流分别为40万元、50万元、60万元，折现率为10%，求NPV。",
    userAnswer: "NPV = -100 + 40 + 50 + 60 = 50万元",
    correctAnswer: "NPV = -100 + 40×0.909 + 50×0.826 + 60×0.751 = 22.72万元",
    errorReason: "未对现金流进行折现处理，直接将未来现金流相加",
    knowledgePoint: "NPV法则",
    errorCount: 3,
    lastPracticeAt: "2026-06-22T08:00:00Z",
    createdAt: "2026-06-10T16:30:00Z",
  },
];

export interface MistakeState {
  mistakes: MistakeRecord[];
  addMistake: (mistake: MistakeRecord) => void;
  removeMistake: (id: string) => void;
}

export const useMistakeStore = create<MistakeState>()(
  persist(
    (set) => ({
      mistakes: mockMistakes,
      addMistake: (mistake) =>
        set((state) => ({
          mistakes: [...state.mistakes, mistake],
        })),
      removeMistake: (id) =>
        set((state) => ({
          mistakes: state.mistakes.filter((m) => m.id !== id),
        })),
    }),
    {
      name: "finpilot-mistake-store",
    },
  ),
);
