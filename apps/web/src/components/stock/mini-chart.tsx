"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { PricePoint } from "@/types/stock";

function generateMockData(basePrice: number): PricePoint[] {
  const data: PricePoint[] = [];
  let price = basePrice * 0.92;
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const volatility = basePrice * 0.025;
    const change = (Math.random() - 0.48) * volatility;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.4;
    const low = Math.min(open, close) - Math.random() * volatility * 0.4;
    const volume = Math.floor(50000 + Math.random() * 150000);
    data.push({
      date: date.toISOString().split("T")[0],
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });
    price = close;
  }
  return data;
}

interface MiniChartProps {
  basePrice: number;
}

export function MiniChart({ basePrice }: MiniChartProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = React.useState<{
    x: number;
    y: number;
    data: PricePoint;
  } | null>(null);

  const data = React.useMemo(() => generateMockData(basePrice), [basePrice]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = 240;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, width, height);

    const padding = { top: 16, right: 16, bottom: 32, left: 16 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const allHighs = data.map((d) => d.high);
    const allLows = data.map((d) => d.low);
    const maxPrice = Math.max(...allHighs);
    const minPrice = Math.min(...allLows);
    const priceRange = maxPrice - minPrice || 1;

    const candleWidth = Math.max(2, (chartW / data.length) * 0.6);
    const spacing = chartW / data.length;

    // Grid lines
    ctx.strokeStyle = "#232840";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      const priceLabel = (maxPrice - (priceRange / 4) * i).toFixed(2);
      ctx.fillStyle = "#6b7394";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(priceLabel, padding.left - 4, y + 3);
    }

    // Candles
    data.forEach((d, i) => {
      const x = padding.left + i * spacing + spacing / 2;
      const isUp = d.close >= d.open;
      const color = isUp ? "#00e5a0" : "#ef4444";

      const yOpen = padding.top + ((maxPrice - d.open) / priceRange) * chartH;
      const yClose = padding.top + ((maxPrice - d.close) / priceRange) * chartH;
      const yHigh = padding.top + ((maxPrice - d.high) / priceRange) * chartH;
      const yLow = padding.top + ((maxPrice - d.low) / priceRange) * chartH;

      // Wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, yHigh);
      ctx.lineTo(x, yLow);
      ctx.stroke();

      // Body
      ctx.fillStyle = color;
      const bodyTop = Math.min(yOpen, yClose);
      const bodyHeight = Math.max(1, Math.abs(yClose - yOpen));
      ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
    });

    // X axis labels (every 5 days)
    ctx.fillStyle = "#6b7394";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    data.forEach((d, i) => {
      if (i % 5 === 0 || i === data.length - 1) {
        const x = padding.left + i * spacing + spacing / 2;
        const label = d.date.slice(5);
        ctx.fillText(label, x, height - 8);
      }
    });
  }, [data]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const padding = { top: 16, right: 16, bottom: 32, left: 16 };
    const chartW = width - padding.left - padding.right;
    const spacing = chartW / data.length;

    const index = Math.min(
      data.length - 1,
      Math.max(0, Math.floor((x - padding.left) / spacing)),
    );
    const point = data[index];
    if (!point) return;

    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      data: point,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="mb-2 flex items-center justify-between px-6">
        <h3 className="text-sm font-semibold text-ink">K 线走势（30日）</h3>
        <span className="text-xs text-muted">模拟数据</span>
      </div>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full cursor-crosshair"
        style={{ height: 240 }}
      />
      {tooltip && (
        <div
          className={cn(
            "pointer-events-none absolute z-10 rounded-lg border border-rule bg-surface2 px-3 py-2 shadow-lg",
            tooltip.x > 200 ? "right-4" : "left-4",
          )}
          style={{ top: tooltip.y - 80 }}
        >
          <p className="text-xs font-medium text-muted">{tooltip.data.date}</p>
          <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
            <span className="text-muted">开盘</span>
            <span className="text-right text-ink">
              {tooltip.data.open.toFixed(2)}
            </span>
            <span className="text-muted">收盘</span>
            <span className="text-right text-ink">
              {tooltip.data.close.toFixed(2)}
            </span>
            <span className="text-muted">最高</span>
            <span className="text-right text-accent">
              {tooltip.data.high.toFixed(2)}
            </span>
            <span className="text-muted">最低</span>
            <span className="text-right text-danger">
              {tooltip.data.low.toFixed(2)}
            </span>
            <span className="text-muted">成交量</span>
            <span className="text-right text-ink">
              {(tooltip.data.volume / 10000).toFixed(1)}万
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
