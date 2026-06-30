import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface StudyPlanState {
  dailyGoalMinutes: number;
  streakDays: number;
  todayMinutes: number;
  completedToday: string[];
  weeklyPlan: Array<{ day: string; topics: string[]; completed: boolean }>;
  addCompletedTopic: (topic: string) => void;
  setTodayMinutes: (minutes: number) => void;
}

const mockWeeklyPlan: Array<{
  day: string;
  topics: string[];
  completed: boolean;
}> = [
  { day: "周一", topics: ["货币职能", "货币层次"], completed: true },
  { day: "周二", topics: ["利率决定", "费雪方程"], completed: true },
  { day: "周三", topics: ["货币乘数", "基础货币"], completed: true },
  { day: "周四", topics: ["凯恩斯货币需求", "货币供给"], completed: false },
  { day: "周五", topics: ["通胀成因", "菲利普斯曲线"], completed: false },
  { day: "周六", topics: ["NPV法则", "IRR计算"], completed: false },
  { day: "周日", topics: ["综合复习", "模拟测试"], completed: false },
];

export const useStudyPlanStore = create<StudyPlanState>()(
  persist(
    (set) => ({
      dailyGoalMinutes: 60,
      streakDays: 7,
      todayMinutes: 35,
      completedToday: [
        "货币职能",
        "货币层次",
        "利率决定",
        "费雪方程",
        "货币乘数",
        "基础货币",
      ],
      weeklyPlan: mockWeeklyPlan,
      addCompletedTopic: (topic) =>
        set((state) => ({
          completedToday: [...state.completedToday, topic],
        })),
      setTodayMinutes: (minutes) => set({ todayMinutes: minutes }),
    }),
    {
      name: "finpilot-study-plan-store",
    },
  ),
);
