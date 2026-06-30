"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { cn } from "@/lib/utils";

export type ChartType = "bar" | "line" | "pie" | "area";

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface ChartProps {
  type: ChartType;
  data: ChartDataPoint[];
  dataKeys?: string[];
  colors?: string[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  title?: string;
  className?: string;
}

const defaultColors = [
  "#00e5a0",
  "#6366f1",
  "#f59e0b",
  "#ef4444",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
];

const tooltipStyle = {
  backgroundColor: "#161922",
  border: "1px solid #232840",
  borderRadius: "8px",
  color: "#e4e8f1",
  fontSize: "12px",
};

const axisStyle = {
  fill: "#6b7394",
  fontSize: 12,
};

const gridStroke = "#232840";

export function Chart({
  type,
  data,
  dataKeys,
  colors = defaultColors,
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  title,
  className,
}: ChartProps) {
  const keys =
    dataKeys ??
    (type === "pie"
      ? ["value"]
      : Object.keys(data[0] ?? {}).filter((k) => k !== "name"));

  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              )}
              <XAxis
                dataKey="name"
                tick={axisStyle}
                axisLine={{ stroke: gridStroke }}
              />
              <YAxis tick={axisStyle} axisLine={{ stroke: gridStroke }} />
              {showTooltip && <Tooltip contentStyle={tooltipStyle} />}
              {showLegend && <Legend wrapperStyle={{ color: "#6b7394" }} />}
              {keys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[index % colors.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              )}
              <XAxis
                dataKey="name"
                tick={axisStyle}
                axisLine={{ stroke: gridStroke }}
              />
              <YAxis tick={axisStyle} axisLine={{ stroke: gridStroke }} />
              {showTooltip && <Tooltip contentStyle={tooltipStyle} />}
              {showLegend && <Legend wrapperStyle={{ color: "#6b7394" }} />}
              {keys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 3, fill: colors[index % colors.length] }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              )}
              <XAxis
                dataKey="name"
                tick={axisStyle}
                axisLine={{ stroke: gridStroke }}
              />
              <YAxis tick={axisStyle} axisLine={{ stroke: gridStroke }} />
              {showTooltip && <Tooltip contentStyle={tooltipStyle} />}
              {showLegend && <Legend wrapperStyle={{ color: "#6b7394" }} />}
              {keys.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              {showTooltip && <Tooltip contentStyle={tooltipStyle} />}
              {showLegend && <Legend wrapperStyle={{ color: "#6b7394" }} />}
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey={keys[0] ?? "value"}
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {title && (
        <h3 className="text-sm font-semibold text-ink mb-4">{title}</h3>
      )}
      {renderChart()}
    </div>
  );
}

// Mock data helpers
export const mockBarData: ChartDataPoint[] = [
  { name: "1月", value: 400, profit: 240 },
  { name: "2月", value: 300, profit: 139 },
  { name: "3月", value: 200, profit: 980 },
  { name: "4月", value: 278, profit: 390 },
  { name: "5月", value: 189, profit: 480 },
  { name: "6月", value: 239, profit: 380 },
];

export const mockLineData: ChartDataPoint[] = [
  { name: "周一", value: 120 },
  { name: "周二", value: 132 },
  { name: "周三", value: 101 },
  { name: "周四", value: 134 },
  { name: "周五", value: 90 },
  { name: "周六", value: 230 },
  { name: "周日", value: 210 },
];

export const mockPieData: ChartDataPoint[] = [
  { name: "股票", value: 400 },
  { name: "基金", value: 300 },
  { name: "债券", value: 300 },
  { name: "现金", value: 200 },
];
