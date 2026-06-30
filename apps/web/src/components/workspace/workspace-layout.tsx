"use client";

import { useState } from "react";
import { useSidebarStore } from "@/store/sidebar-store";
import { ConversationSidebar } from "./conversation-sidebar";
import { ChatArea } from "./chat-area";
import { ChatInput } from "./chat-input";
import { StatusPanel } from "./status-panel";

export function WorkspaceLayout() {
  const sidebarCollapsed = useSidebarStore((s) => s.collapsed);
  const [chatSidebarCollapsed, setChatSidebarCollapsed] = useState(false);
  const [statusPanelCollapsed, setStatusPanelCollapsed] = useState(false);

  return (
    <div className="flex h-full w-full overflow-hidden bg-bg">
      {/* Left: Conversation Sidebar */}
      <ConversationSidebar
        collapsed={chatSidebarCollapsed || sidebarCollapsed}
        onToggle={() => setChatSidebarCollapsed((prev) => !prev)}
      />

      {/* Center: Chat Area + Input */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <ChatArea />
        <ChatInput />
      </div>

      {/* Right: Status Panel */}
      <StatusPanel
        collapsed={statusPanelCollapsed}
        onToggle={() => setStatusPanelCollapsed((prev) => !prev)}
      />
    </div>
  );
}
