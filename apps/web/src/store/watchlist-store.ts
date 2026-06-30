"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WatchlistItem } from "@/types/stock";

interface WatchlistState {
  items: WatchlistItem[];
  addItem: (item: WatchlistItem) => void;
  removeItem: (code: string) => void;
  isInWatchlist: (code: string) => boolean;
}

const initialMockItems: WatchlistItem[] = [
  {
    code: "600519.SH",
    name: "贵州茅台",
    price: 1688.88,
    changePercent: 0.74,
    addedAt: "2026-06-15T10:30:00.000Z",
  },
  {
    code: "00700.HK",
    name: "腾讯控股",
    price: 388.2,
    changePercent: 1.25,
    addedAt: "2026-06-18T14:20:00.000Z",
  },
  {
    code: "300750.SZ",
    name: "宁德时代",
    price: 218.6,
    changePercent: -2.32,
    addedAt: "2026-06-20T09:15:00.000Z",
  },
];

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: initialMockItems,
      addItem: (item) => {
        const exists = get().items.some((i) => i.code === item.code);
        if (exists) return;
        set((state) => ({
          items: [...state.items, item],
        }));
      },
      removeItem: (code) => {
        set((state) => ({
          items: state.items.filter((i) => i.code !== code),
        }));
      },
      isInWatchlist: (code) => {
        return get().items.some((i) => i.code === code);
      },
    }),
    {
      name: "finpilot-watchlist",
      partialize: (state) => ({
        items: state.items,
      }),
    },
  ),
);
