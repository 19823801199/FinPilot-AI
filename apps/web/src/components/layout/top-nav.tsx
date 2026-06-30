"use client";

import { usePathname } from "next/navigation";
import { Menu, Search, Bell } from "lucide-react";
import { useSidebarStore } from "@/store/sidebar-store";
import { useUserStore } from "@/store/user-store";
import { cn } from "@/lib/utils";

const breadcrumbMap: Record<string, string> = {
  workspace: "工作台",
  learn: "学习中心",
  stocks: "股票研究员",
  knowledge: "知识库",
  settings: "设置",
};

export function TopNav() {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebarStore();
  const { user } = useUserStore();

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg) => ({
    label: breadcrumbMap[seg] || seg,
    href: "/" + segments.slice(0, segments.indexOf(seg) + 1).join("/"),
  }));

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-rule bg-bg2 px-4">
      {/* Hamburger (mobile) */}
      <button
        onClick={toggleSidebar}
        className="rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-ink lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Breadcrumb */}
      <nav className="hidden items-center gap-1.5 text-sm sm:flex">
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.href} className="flex items-center gap-1.5">
            {index > 0 && <span className="text-muted">/</span>}
            <span
              className={cn(
                index === breadcrumbs.length - 1 ? "text-ink" : "text-muted",
              )}
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button className="rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-ink">
          <Search className="h-5 w-5" />
        </button>
        <button className="relative rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-ink">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
        </button>

        {/* User avatar placeholder */}
        <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent2 text-xs font-bold text-bg">
          {user?.nickname?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}
