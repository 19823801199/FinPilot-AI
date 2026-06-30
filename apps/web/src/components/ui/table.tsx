"use client";

import * as React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Empty } from "./empty";

export type SortDirection = "asc" | "desc" | null;

export interface Column<T = unknown> {
  key: string;
  title: React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface TableProps<T = unknown> {
  columns: Column<T>[];
  data: T[];
  rowKey?: (row: T, index: number) => string;
  sortKey?: string | null;
  sortDirection?: SortDirection;
  onSort?: (key: string, direction: SortDirection) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  loading?: boolean;
  className?: string;
  headerClassName?: string;
  rowClassName?: string;
  footer?: React.ReactNode;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  sortKey,
  sortDirection,
  onSort,
  emptyTitle,
  emptyDescription,
  loading = false,
  className,
  headerClassName,
  rowClassName,
  footer,
}: TableProps<T>) {
  const handleSort = (column: Column<T>) => {
    if (!column.sortable || !onSort) return;

    let newDirection: SortDirection = "asc";
    if (sortKey === column.key) {
      if (sortDirection === "asc") newDirection = "desc";
      else if (sortDirection === "desc") newDirection = null;
    }
    onSort(column.key, newDirection);
  };

  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;
    if (sortKey !== column.key) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-muted/50" />;
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="h-3.5 w-3.5 text-accent" />;
    }
    if (sortDirection === "desc") {
      return <ArrowDown className="h-3.5 w-3.5 text-accent" />;
    }
    return <ArrowUpDown className="h-3.5 w-3.5 text-muted/50" />;
  };

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className={cn("border-b border-rule/60", headerClassName)}>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  "px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted",
                  column.sortable &&
                    "cursor-pointer select-none hover:text-ink",
                  alignClasses[column.align ?? "left"],
                )}
                style={{ width: column.width }}
                onClick={() => handleSort(column)}
              >
                <div
                  className={cn(
                    "flex items-center gap-1.5",
                    column.align === "center" && "justify-center",
                    column.align === "right" && "justify-end",
                  )}
                >
                  {column.title}
                  {getSortIcon(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && !loading ? (
            <tr>
              <td colSpan={columns.length} className="py-12">
                <Empty
                  title={emptyTitle ?? "暂无数据"}
                  description={emptyDescription ?? "当前列表为空"}
                />
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={rowKey ? rowKey(row, index) : `row-${index}`}
                className={cn(
                  "border-b border-rule/30 transition-colors duration-150 hover:bg-surface2/40",
                  rowClassName,
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      "px-4 py-3 text-sm text-ink",
                      alignClasses[column.align ?? "left"],
                    )}
                  >
                    {column.render
                      ? column.render(row, index)
                      : String(
                          (row as Record<string, unknown>)[column.key] ?? "",
                        )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
        {footer && (
          <tfoot>
            <tr className="border-t border-rule/60 bg-surface2/20">
              <td colSpan={columns.length} className="px-4 py-3">
                {footer}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
