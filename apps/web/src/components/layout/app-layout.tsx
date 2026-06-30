"use client";

import { Sidebar } from "./sidebar";
import { TopNav } from "./top-nav";
import { useSidebarStore } from "@/store/sidebar-store";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { collapsed: sidebarCollapsed } = useSidebarStore();

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-60",
        )}
      >
        <TopNav />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
