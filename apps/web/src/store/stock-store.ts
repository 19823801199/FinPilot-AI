"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StockDetail, StockSearchResult } from "@/types/stock";

interface StockState {
  currentStock: StockDetail | null;
  searchResults: StockSearchResult[];
  isSearching: boolean;
  searchQuery: string;
  setCurrentStock: (stock: StockDetail | null) => void;
  searchStocks: (query: string) => void;
  clearSearch: () => void;
}

const mockSearchDatabase: StockSearchResult[] = [
  {
    code: "600519.SH",
    name: "贵州茅台",
    exchange: "上海证券交易所",
    industry: "白酒",
    marketCap: "2.12万亿",
  },
  {
    code: "300750.SZ",
    name: "宁德时代",
    exchange: "深圳证券交易所",
    industry: "电池",
    marketCap: "9612亿",
  },
  {
    code: "002594.SZ",
    name: "比亚迪",
    exchange: "深圳证券交易所",
    industry: "汽车",
    marketCap: "7815亿",
  },
  {
    code: "00700.HK",
    name: "腾讯控股",
    exchange: "香港交易所",
    industry: "互联网",
    marketCap: "3.72万亿",
  },
  {
    code: "09988.HK",
    name: "阿里巴巴",
    exchange: "香港交易所",
    industry: "电商",
    marketCap: "1.65万亿",
  },
  {
    code: "000333.SZ",
    name: "美的集团",
    exchange: "深圳证券交易所",
    industry: "家电",
    marketCap: "4368亿",
  },
  {
    code: "601318.SH",
    name: "中国平安",
    exchange: "上海证券交易所",
    industry: "保险",
    marketCap: "8520亿",
  },
  {
    code: "600036.SH",
    name: "招商银行",
    exchange: "上海证券交易所",
    industry: "银行",
    marketCap: "9230亿",
  },
  {
    code: "000858.SZ",
    name: "五粮液",
    exchange: "深圳证券交易所",
    industry: "白酒",
    marketCap: "5890亿",
  },
  {
    code: "002415.SZ",
    name: "海康威视",
    exchange: "深圳证券交易所",
    industry: "安防",
    marketCap: "3120亿",
  },
  {
    code: "600900.SH",
    name: "长江电力",
    exchange: "上海证券交易所",
    industry: "电力",
    marketCap: "6780亿",
  },
  {
    code: "300059.SZ",
    name: "东方财富",
    exchange: "深圳证券交易所",
    industry: "金融信息",
    marketCap: "2450亿",
  },
  {
    code: "601012.SH",
    name: "隆基绿能",
    exchange: "上海证券交易所",
    industry: "光伏",
    marketCap: "1890亿",
  },
  {
    code: "002230.SZ",
    name: "科大讯飞",
    exchange: "深圳证券交易所",
    industry: "人工智能",
    marketCap: "1120亿",
  },
  {
    code: "600276.SH",
    name: "恒瑞医药",
    exchange: "上海证券交易所",
    industry: "医药",
    marketCap: "3560亿",
  },
];

const mockStockDetails: Record<string, StockDetail> = {
  "600519.SH": {
    code: "600519.SH",
    name: "贵州茅台",
    exchange: "上海证券交易所",
    industry: "白酒",
    price: 1688.88,
    change: 12.5,
    changePercent: 0.74,
    volume: "2.3万手",
    marketCap: "2.12万亿",
    pe: 28.5,
    pb: 8.2,
    high52w: 1888.0,
    low52w: 1388.0,
    avgVolume: "3.1万手",
    dividendYield: 1.52,
  },
  "300750.SZ": {
    code: "300750.SZ",
    name: "宁德时代",
    exchange: "深圳证券交易所",
    industry: "电池",
    price: 218.6,
    change: -5.2,
    changePercent: -2.32,
    volume: "15.6万手",
    marketCap: "9612亿",
    pe: 22.1,
    pb: 5.8,
    high52w: 268.5,
    low52w: 168.2,
    avgVolume: "18.2万手",
    dividendYield: 0.85,
  },
  "002594.SZ": {
    code: "002594.SZ",
    name: "比亚迪",
    exchange: "深圳证券交易所",
    industry: "汽车",
    price: 268.5,
    change: 8.3,
    changePercent: 3.19,
    volume: "12.1万手",
    marketCap: "7815亿",
    pe: 25.6,
    pb: 4.9,
    high52w: 318.0,
    low52w: 198.5,
    avgVolume: "14.5万手",
    dividendYield: 0.62,
  },
  "00700.HK": {
    code: "00700.HK",
    name: "腾讯控股",
    exchange: "香港交易所",
    industry: "互联网",
    price: 388.2,
    change: 4.8,
    changePercent: 1.25,
    volume: "892万手",
    marketCap: "3.72万亿",
    pe: 18.3,
    pb: 3.5,
    high52w: 458.0,
    low52w: 288.0,
    avgVolume: "1050万手",
    dividendYield: 0.78,
  },
  "09988.HK": {
    code: "09988.HK",
    name: "阿里巴巴",
    exchange: "香港交易所",
    industry: "电商",
    price: 78.45,
    change: -1.2,
    changePercent: -1.51,
    volume: "1.2亿手",
    marketCap: "1.65万亿",
    pe: 15.2,
    pb: 1.8,
    high52w: 98.5,
    low52w: 62.3,
    avgVolume: "1.5亿手",
    dividendYield: 1.12,
  },
  "000333.SZ": {
    code: "000333.SZ",
    name: "美的集团",
    exchange: "深圳证券交易所",
    industry: "家电",
    price: 62.35,
    change: 0.85,
    changePercent: 1.38,
    volume: "8.5万手",
    marketCap: "4368亿",
    pe: 12.8,
    pb: 2.6,
    high52w: 72.5,
    low52w: 48.2,
    avgVolume: "10.2万手",
    dividendYield: 3.52,
  },
};

export const useStockStore = create<StockState>()(
  persist(
    (set) => ({
      currentStock: null,
      searchResults: [],
      isSearching: false,
      searchQuery: "",
      setCurrentStock: (stock) => set({ currentStock: stock }),
      searchStocks: (query) => {
        set({ isSearching: true, searchQuery: query });
        const trimmed = query.trim();
        if (!trimmed) {
          set({ searchResults: [], isSearching: false });
          return;
        }
        const lower = trimmed.toLowerCase();
        const results = mockSearchDatabase.filter(
          (s) =>
            s.name.includes(trimmed) || s.code.toLowerCase().includes(lower),
        );
        setTimeout(() => {
          set({ searchResults: results, isSearching: false });
        }, 300);
      },
      clearSearch: () =>
        set({ searchResults: [], searchQuery: "", isSearching: false }),
    }),
    {
      name: "finpilot-stock",
      partialize: (state) => ({
        currentStock: state.currentStock,
      }),
    },
  ),
);

export function getMockStockDetail(code: string): StockDetail | null {
  return mockStockDetails[code] ?? null;
}
