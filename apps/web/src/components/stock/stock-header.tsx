"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useStockStore } from "@/store/stock-store";
import { useWatchlistStore } from "@/store/watchlist-store";
import { useResearchStore } from "@/store/research-store";
import {
  Star,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  DollarSign,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export function StockHeader() {
  const currentStock = useStockStore((s) => s.currentStock);
  const { addItem, removeItem, isInWatchlist } = useWatchlistStore();
  const { analyzeStock, isAnalyzing } = useResearchStore();

  if (!currentStock) return null;

  const isUp = currentStock.change >= 0;
  const inWatchlist = isInWatchlist(currentStock.code);

  const handleToggleWatchlist = () => {
    if (inWatchlist) {
      removeItem(currentStock.code);
    } else {
      addItem({
        code: currentStock.code,
        name: currentStock.name,
        price: currentStock.price,
        changePercent: currentStock.changePercent,
        addedAt: new Date().toISOString(),
      });
    }
  };

  const handleAnalyze = () => {
    if (isAnalyzing) return;
    analyzeStock(currentStock.code, currentStock.name);
  };

  const metrics = [
    {
      label: "成交量",
      value: currentStock.volume,
      icon: <Activity className="h-3.5 w-3.5" />,
    },
    {
      label: "市值",
      value: currentStock.marketCap,
      icon: <DollarSign className="h-3.5 w-3.5" />,
    },
    {
      label: "市盈率",
      value: currentStock.pe ? `${currentStock.pe.toFixed(1)}x` : "--",
      icon: <Percent className="h-3.5 w-3.5" />,
    },
    {
      label: "市净率",
      value: currentStock.pb ? `${currentStock.pb.toFixed(1)}x` : "--",
      icon: <BarChart3 className="h-3.5 w-3.5" />,
    },
    {
      label: "52周最高",
      value: currentStock.high52w ? currentStock.high52w.toFixed(2) : "--",
      icon: <ArrowUpRight className="h-3.5 w-3.5" />,
    },
    {
      label: "52周最低",
      value: currentStock.low52w ? currentStock.low52w.toFixed(2) : "--",
      icon: <ArrowDownRight className="h-3.5 w-3.5" />,
    },
    {
      label: "平均成交量",
      value: currentStock.avgVolume ?? "--",
      icon: <Activity className="h-3.5 w-3.5" />,
    },
    {
      label: "股息率",
      value: currentStock.dividendYield
        ? `${currentStock.dividendYield.toFixed(2)}%`
        : "--",
      icon: <Percent className="h-3.5 w-3.5" />,
    },
  ];

  return (
    <div className="border-b border-rule bg-surface px-6 py-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        {/* Left: Name + Price */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
            <BarChart3 className="h-6 w-6 text-accent" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-ink">
                {currentStock.name}
              </h1>
              <span className="rounded-md bg-surface2 px-2 py-0.5 text-xs font-medium text-muted">
                {currentStock.code}
              </span>
              <span className="rounded-md border border-rule px-2 py-0.5 text-xs text-muted">
                {currentStock.exchange}
              </span>
              <span className="rounded-md bg-accent2/10 px-2 py-0.5 text-xs font-medium text-accent2">
                {currentStock.industry}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-ink">
                {currentStock.price.toFixed(2)}
              </span>
              <span
                className={cn(
                  "flex items-center gap-1 text-base font-semibold",
                  isUp ? "text-accent" : "text-danger",
                )}
              >
                {isUp ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {isUp ? "+" : ""}
                {currentStock.change.toFixed(2)}
              </span>
              <span
                className={cn(
                  "rounded-md px-2 py-0.5 text-sm font-semibold",
                  isUp
                    ? "bg-accent/10 text-accent"
                    : "bg-danger/10 text-danger",
                )}
              >
                {isUp ? "+" : ""}
                {currentStock.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleWatchlist}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all",
              inWatchlist
                ? "bg-accent3/10 text-accent3 hover:bg-accent3/20"
                : "bg-surface2 text-muted hover:bg-surface2/80 hover:text-ink",
            )}
          >
            <Star className={cn("h-4 w-4", inWatchlist && "fill-accent3")} />
            {inWatchlist ? "已自选" : "加自选"}
          </button>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all",
              "bg-accent text-bg hover:bg-accent/90 active:scale-[0.98]",
              isAnalyzing && "opacity-60 cursor-not-allowed",
            )}
          >
            <Activity className="h-4 w-4" />
            {isAnalyzing ? "分析中..." : "AI 分析"}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-lg border border-rule/60 bg-bg2/50 px-3 py-2 transition-colors hover:border-muted/30"
          >
            <div className="flex items-center gap-1 text-xs text-muted">
              {m.icon}
              {m.label}
            </div>
            <p className="mt-1 text-sm font-semibold text-ink">{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
