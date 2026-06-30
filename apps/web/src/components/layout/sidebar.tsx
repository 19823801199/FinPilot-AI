"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  Database,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebar-store";

const navItems = [
  { label: "工作台", href: "/workspace", icon: LayoutDashboard },
  { label: "学习中心", href: "/learn", icon: BookOpen },
  { label: "股票研究员", href: "/stocks", icon: TrendingUp },
  { label: "知识库", href: "/knowledge", icon: Database },
];

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed: sidebarCollapsed, toggleSidebar } = useSidebarStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-rule bg-surface transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-60",
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-rule px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent2">
          <LayoutDashboard className="h-5 w-5 text-bg" />
        </div>
        {!sidebarCollapsed && (
          <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-lg font-bold text-transparent">
            FinPilot AI
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-surface2 text-accent"
                      : "text-muted hover:bg-surface2 hover:text-ink",
                  )}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-accent" />
                  )}
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom: Settings + Collapse toggle */}
      <div className="border-t border-rule px-2 py-4">
        <ul className="flex flex-col gap-1">
          <li>
            <Link
              href="/settings"
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === "/settings"
                  ? "bg-surface2 text-accent"
                  : "text-muted hover:bg-surface2 hover:text-ink",
              )}
            >
              {pathname === "/settings" && (
                <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-accent" />
              )}
              <Settings className="h-5 w-5 shrink-0" />
              {!sidebarCollapsed && <span>设置</span>}
            </Link>
          </li>
        </ul>

        {/* Collapse button */}
        <button
          onClick={toggleSidebar}
          className="mt-2 flex w-full items-center justify-center rounded-lg px-3 py-2 text-muted transition-colors hover:bg-surface2 hover:text-ink"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
