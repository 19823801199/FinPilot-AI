"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useStockStore, getMockStockDetail } from "@/store/stock-store";
import { useWatchlistStore } from "@/store/watchlist-store";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  Trash2,
  TrendingUp,
  TrendingDown,
  Clock,
  Flame,
  Building2,
} from "lucide-react";

const hotStocks = [
  {
    code: "600519.SH",
    name: "贵州茅台",
    exchange: "上海证券交易所",
    industry: "白酒",
  },
  {
    code: "300750.SZ",
    name: "宁德时代",
    exchange: "深圳证券交易所",
    industry: "电池",
  },
  {
    code: "00700.HK",
    name: "腾讯控股",
    exchange: "香港交易所",
    industry: "互联网",
  },
  {
    code: "002594.SZ",
    name: "比亚迪",
    exchange: "深圳证券交易所",
    industry: "汽车",
  },
  {
    code: "000333.SZ",
    name: "美的集团",
    exchange: "深圳证券交易所",
    industry: "家电",
  },
];

export function SearchSidebar() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [recentStocks, setRecentStocks] = React.useState<string[]>([]);

  const {
    searchResults,
    isSearching,
    searchStocks,
    clearSearch,
    setCurrentStock,
  } = useStockStore();
  const { items, removeItem } = useWatchlistStore();

  const handleSearch = (value: string) => {
    setQuery(value);
    searchStocks(value);
  };

  const handleSelectStock = (code: string) => {
    const detail = getMockStockDetail(code);
    if (detail) {
      setCurrentStock(detail);
      setRecentStocks((prev) => {
        const filtered = prev.filter((c) => c !== code);
        return [code, ...filtered].slice(0, 5);
      });
    }
    setQuery("");
    clearSearch();
  };

  const handleRemoveWatchlist = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    removeItem(code);
  };

  if (collapsed) {
    return (
      <div className="flex w-12 flex-col items-center border-r border-rule bg-surface py-4 transition-all">
        <button
          onClick={() => setCollapsed(false)}
          className="rounded-lg p-2 text-muted transition-colors hover:bg-surface2 hover:text-ink"
          title="展开侧边栏"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-[280px] shrink-0 flex-col border-r border-rule bg-surface transition-all">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-rule px-4 py-3">
        <h2 className="text-sm font-semibold text-ink">股票搜索</h2>
        <button
          onClick={() => setCollapsed(true)}
          className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface2 hover:text-ink"
          title="收起侧边栏"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="搜索股票名称或代码..."
            className={cn(
              "h-9 w-full rounded-lg border border-rule bg-bg2 pl-9 pr-8 text-sm text-ink placeholder:text-muted/60",
              "outline-none transition-all focus-visible:border-accent/50 focus-visible:ring-1 focus-visible:ring-accent/40",
            )}
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                clearSearch();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted transition-colors hover:bg-surface2 hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {isSearching ? (
          <div className="py-8 text-center text-sm text-muted">搜索中...</div>
        ) : query.trim() && searchResults.length > 0 ? (
          <div className="space-y-1">
            <p className="mb-2 text-xs font-medium text-muted">搜索结果</p>
            {searchResults.map((stock) => (
              <button
                key={stock.code}
                onClick={() => handleSelectStock(stock.code)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all",
                  "hover:bg-surface2",
                )}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <Building2 className="h-4 w-4 text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {stock.name}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {stock.code} · {stock.industry}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : query.trim() ? (
          <div className="py-8 text-center text-sm text-muted">
            未找到相关股票
          </div>
        ) : (
          <div className="space-y-5">
            {/* Watchlist */}
            {items.length > 0 && (
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted">
                  <Star className="h-3.5 w-3.5" />
                  自选股
                </p>
                <div className="space-y-1">
                  {items.map((item) => {
                    const isUp = item.changePercent >= 0;
                    return (
                      <button
                        key={item.code}
                        onClick={() => handleSelectStock(item.code)}
                        className={cn(
                          "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all",
                          "hover:bg-surface2",
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-ink">
                            {item.name}
                          </p>
                          <p className="truncate text-xs text-muted">
                            {item.code}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-ink">
                            {item.price.toFixed(2)}
                          </p>
                          <p
                            className={cn(
                              "text-xs font-medium",
                              isUp ? "text-accent" : "text-danger",
                            )}
                          >
                            {isUp ? "+" : ""}
                            {item.changePercent.toFixed(2)}%
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleRemoveWatchlist(e, item.code)}
                          className="rounded p-1 text-muted opacity-0 transition-all group-hover:opacity-100 hover:bg-danger/10 hover:text-danger"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recent */}
            {recentStocks.length > 0 && (
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted">
                  <Clock className="h-3.5 w-3.5" />
                  最近浏览
                </p>
                <div className="space-y-1">
                  {recentStocks.map((code) => {
                    const stock = hotStocks.find((s) => s.code === code);
                    if (!stock) return null;
                    return (
                      <button
                        key={code}
                        onClick={() => handleSelectStock(stock.code)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-all",
                          "hover:bg-surface2",
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm text-ink">
                            {stock.name}
                          </p>
                          <p className="truncate text-xs text-muted">
                            {stock.code}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Hot Stocks */}
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted">
                <Flame className="h-3.5 w-3.5" />
                热门推荐
              </p>
              <div className="space-y-1">
                {hotStocks.map((stock, index) => {
                  const isUp = index % 2 === 0;
                  return (
                    <button
                      key={stock.code}
                      onClick={() => handleSelectStock(stock.code)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all",
                        "hover:bg-surface2",
                      )}
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-bold text-muted">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">
                          {stock.name}
                        </p>
                        <p className="truncate text-xs text-muted">
                          {stock.code}
                        </p>
                      </div>
                      {isUp ? (
                        <TrendingUp className="h-3.5 w-3.5 shrink-0 text-accent" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 shrink-0 text-danger" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
