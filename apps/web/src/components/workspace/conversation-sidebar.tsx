"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  MessageSquare,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useConversationStore } from "@/store/conversation-store";
import { useMessageStore } from "@/store/message-store";

interface ConversationSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function ConversationSidebar({
  collapsed,
  onToggle,
}: ConversationSidebarProps) {
  const {
    conversations,
    currentConversationId,
    createConversation,
    selectConversation,
    deleteConversation,
  } = useConversationStore();

  const clearMessages = useMessageStore((s) => s.clearMessages);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreate = () => {
    createConversation();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    clearMessages(id);
    deleteConversation(id);
  };

  const handleSelect = (id: string) => {
    selectConversation(id);
  };

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-rule bg-bg2 transition-all duration-300",
        collapsed ? "w-0 overflow-hidden opacity-0" : "w-[280px] opacity-100",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-rule px-4 py-3">
        <h2 className="text-sm font-semibold text-ink">会话列表</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCreate}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-accent"
            title="新建会话"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={onToggle}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-ink"
            title="收起侧栏"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 rounded-lg bg-surface px-3 py-2">
          <Search className="h-3.5 w-3.5 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索会话..."
            className="flex-1 bg-transparent text-xs text-ink placeholder:text-muted outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-muted hover:text-ink"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-2 py-1">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="mb-2 h-8 w-8 text-muted/40" />
            <p className="text-xs text-muted">
              {searchQuery ? "未找到匹配的会话" : "暂无会话记录"}
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                role="button"
                tabIndex={0}
                onClick={() => handleSelect(conv.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSelect(conv.id);
                }}
                className={cn(
                  "group flex w-full cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                  currentConversationId === conv.id
                    ? "bg-surface text-ink"
                    : "text-muted hover:bg-surface/60 hover:text-ink",
                )}
              >
                <MessageSquare
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0",
                    currentConversationId === conv.id
                      ? "text-accent"
                      : "text-muted",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{conv.title}</p>
                  {conv.lastMessage && (
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {conv.lastMessage}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => handleDelete(conv.id, e)}
                  className="mt-0.5 shrink-0 rounded p-0.5 text-muted opacity-0 transition-all hover:bg-danger/10 hover:text-danger group-hover:opacity-100"
                  title="删除会话"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expand button (shown when collapsed) */}
      {collapsed && (
        <button
          onClick={onToggle}
          className="absolute -right-3 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-rule bg-surface text-muted transition-colors hover:text-accent"
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      )}
    </aside>
  );
}
