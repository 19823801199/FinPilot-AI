"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useStockStore } from "@/store/stock-store";
import { SearchSidebar } from "./search-sidebar";
import { StockHeader } from "./stock-header";
import { MiniChart } from "./mini-chart";
import { ResearchReportPanel } from "./research-report";
import { AnalysisStatus } from "./analysis-status";
import { Search, BarChart3, Sparkles, TrendingUp } from "lucide-react";
import { getMockStockDetail } from "@/store/stock-store";

const welcomeHotStocks = [
  { code: "600519.SH", name: "贵州茅台", industry: "白酒" },
  { code: "300750.SZ", name: "宁德时代", industry: "电池" },
  { code: "00700.HK", name: "腾讯控股", industry: "互联网" },
  { code: "002594.SZ", name: "比亚迪", industry: "汽车" },
  { code: "000333.SZ", name: "美的集团", industry: "家电" },
  { code: "601318.SH", name: "中国平安", industry: "保险" },
];

export function StockTerminal() {
  const currentStock = useStockStore((s) => s.currentStock);
  const { setCurrentStock } = useStockStore();

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-bg">
      {/* Left Sidebar */}
      <div className="hidden md:block">
        <SearchSidebar />
      </div>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {currentStock ? (
          <>
            <StockHeader />
            <div className="flex flex-1 overflow-hidden">
              <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
                <div className="border-b border-rule py-4">
                  <MiniChart basePrice={currentStock.price} />
                </div>
                <div className="flex-1">
                  <ResearchReportPanel />
                </div>
              </div>
              <div className="hidden lg:block">
                <AnalysisStatus />
              </div>
            </div>
          </>
        ) : (
          <WelcomeScreen onSelectStock={setCurrentStock} />
        )}
      </div>
    </div>
  );
}

function WelcomeScreen({
  onSelectStock,
}: {
  onSelectStock: (
    stock: NonNullable<
      ReturnType<typeof useStockStore.getState>["currentStock"]
    >,
  ) => void;
}) {
  const { searchStocks, searchResults, clearSearch } = useStockStore();
  const [query, setQuery] = React.useState("");

  const handleSearch = (value: string) => {
    setQuery(value);
    searchStocks(value);
  };

  const handleSelect = (code: string) => {
    const detail = getMockStockDetail(code);
    if (detail) {
      onSelectStock(detail);
    }
    setQuery("");
    clearSearch();
  };

  return (
    <div className="flex h-full flex-col items-center justify-center px-6">
      <div className="w-full max-w-xl text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 mx-auto">
          <BarChart3 className="h-8 w-8 text-accent" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-ink">AI 股票研究员</h1>
        <p className="mt-2 text-sm text-muted">
          搜索股票，获取 AI 驱动的深度分析与研究报告
        </p>

        {/* Search */}
        <div className="mt-8 relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="输入股票名称或代码开始研究..."
            className={cn(
              "h-12 w-full rounded-xl border border-rule bg-surface pl-12 pr-4 text-sm text-ink placeholder:text-muted/60",
              "outline-none transition-all focus-visible:border-accent/50 focus-visible:ring-2 focus-visible:ring-accent/30",
            )}
          />
          {query && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-rule bg-surface shadow-xl">
              {searchResults.map((s) => (
                <button
                  key={s.code}
                  onClick={() => handleSelect(s.code)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface2",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">{s.name}</p>
                    <p className="text-xs text-muted">
                      {s.code} · {s.industry}
                    </p>
                  </div>
                  <Sparkles className="h-4 w-4 text-accent" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Hot Stocks */}
        <div className="mt-8">
          <p className="text-xs font-medium text-muted mb-3">热门股票</p>
          <div className="flex flex-wrap justify-center gap-2">
            {welcomeHotStocks.map((stock) => (
              <button
                key={stock.code}
                onClick={() => handleSelect(stock.code)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border border-rule bg-surface px-3 py-2 text-sm transition-all",
                  "hover:border-accent/30 hover:bg-surface2",
                )}
              >
                <TrendingUp className="h-3.5 w-3.5 text-accent" />
                <span className="text-ink">{stock.name}</span>
                <span className="text-xs text-muted">{stock.code}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
