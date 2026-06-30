"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: React.ReactNode;
  content?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab?: string;
  defaultActiveTab?: string;
  onChange?: (tabId: string) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
  tabClassName?: string;
  contentClassName?: string;
}

export function Tabs({
  tabs,
  activeTab: controlledActiveTab,
  defaultActiveTab,
  onChange,
  orientation = "horizontal",
  className,
  tabClassName,
  contentClassName,
}: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = React.useState(
    defaultActiveTab ?? tabs[0]?.id,
  );

  const isControlled = controlledActiveTab !== undefined;
  const activeTab = isControlled ? controlledActiveTab : internalActiveTab;

  const handleTabChange = (tabId: string) => {
    if (!isControlled) {
      setInternalActiveTab(tabId);
    }
    onChange?.(tabId);
  };

  const activeTabData = tabs.find((t) => t.id === activeTab);

  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={cn(
        isHorizontal ? "flex flex-col" : "flex flex-row gap-4",
        className,
      )}
    >
      {/* Tab List */}
      <div
        className={cn(
          "flex shrink-0",
          isHorizontal
            ? "flex-row border-b border-rule/60"
            : "flex-col border-r border-rule/60 min-w-[140px]",
        )}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabChange(tab.id)}
              disabled={tab.disabled}
              className={cn(
                "relative font-medium text-sm transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
                isHorizontal ? "px-4 py-3" : "px-4 py-3 text-left w-full",
                isActive
                  ? "text-accent"
                  : "text-muted hover:text-ink hover:bg-surface2/40",
                tab.disabled && "opacity-40 cursor-not-allowed",
                tabClassName,
              )}
            >
              {tab.label}
              {/* Active indicator */}
              {isActive && (
                <span
                  className={cn(
                    "absolute bg-accent transition-all duration-200",
                    isHorizontal
                      ? "bottom-0 left-0 right-0 h-[2px]"
                      : "top-0 bottom-0 left-0 w-[2px]",
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTabData?.content && (
        <div
          className={cn(
            "flex-1 animate-in fade-in slide-in-from-bottom-2 duration-200",
            isHorizontal ? "py-4" : "py-2",
            contentClassName,
          )}
        >
          {activeTabData.content}
        </div>
      )}
    </div>
  );
}
