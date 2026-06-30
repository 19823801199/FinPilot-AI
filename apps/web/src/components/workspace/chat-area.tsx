"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import {
  Bot,
  User,
  Copy,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  TrendingUp,
  BookOpen,
  Database,
  MessageCircle,
  Users,
  ChevronDown,
  ChevronUp,
  GitBranch,
  CheckCircle2,
  Circle,
  Loader2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMessageStore } from "@/store/message-store";
import { useConversationStore } from "@/store/conversation-store";
import { useWorkspaceStore } from "@/store/workspace-store";
import type { Message } from "@/types";
import type { TaskPlan } from "@/types/workspace";

/** HTML 转义 — 防止 XSS */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** 简单 Markdown 渲染：**bold** -> <strong>, \n -> <br> */
function renderMarkdown(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}

/** 消息操作按钮 */
function MessageActions({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: ignore
    }
  };

  if (message.role === "user") return null;

  return (
    <div className="mt-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
      <button
        onClick={handleCopy}
        className="flex h-6 w-6 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface2 hover:text-ink"
        title="复制"
      >
        <Copy className={cn("h-3 w-3", copied && "text-accent")} />
      </button>
      <button
        className="flex h-6 w-6 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface2 hover:text-ink"
        title="重新生成"
      >
        <RefreshCw className="h-3 w-3" />
      </button>
      <button
        className="flex h-6 w-6 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface2 hover:text-accent"
        title="有帮助"
      >
        <ThumbsUp className="h-3 w-3" />
      </button>
      <button
        className="flex h-6 w-6 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface2 hover:text-danger"
        title="无帮助"
      >
        <ThumbsDown className="h-3 w-3" />
      </button>
    </div>
  );
}

/** 任务计划状态图标 */
function TaskPlanStatusIcon({ status }: { status: TaskPlan["status"] }) {
  switch (status) {
    case "pending":
      return <Circle className="h-3 w-3 text-muted/40" />;
    case "running":
      return <Loader2 className="h-3 w-3 animate-spin text-accent" />;
    case "done":
      return <CheckCircle2 className="h-3 w-3 text-success" />;
    case "error":
      return <XCircle className="h-3 w-3 text-danger" />;
  }
}

/** Multi-Agent 协同提示 */
function MultiAgentFooter() {
  const [expanded, setExpanded] = useState(false);
  const orchestratorResponse = useWorkspaceStore((s) => s.orchestratorResponse);
  const taskPlan = useWorkspaceStore((s) => s.taskPlan);

  if (!orchestratorResponse) return null;

  const { agentsInvolved, executionTime } = orchestratorResponse;

  return (
    <div className="mt-2 rounded-xl border border-rule bg-surface">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-3 py-2 text-left"
      >
        <div className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-accent" />
          <span className="text-xs text-muted">
            由 {agentsInvolved.length} 位专家协同完成
            {" · "}
            耗时 {(executionTime / 1000).toFixed(2)}s
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="h-3.5 w-3.5 text-muted" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-muted" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-rule px-3 py-2">
          {/* 专家头像列表 */}
          <div className="mb-3 flex items-center gap-2">
            {agentsInvolved.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center gap-1.5 rounded-full border border-rule bg-bg px-2 py-1"
                title={agent.description}
              >
                <span className="text-sm">{agent.avatar}</span>
                <span className="text-[10px] text-ink">{agent.name}</span>
              </div>
            ))}
          </div>

          {/* 任务计划详情 */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1 text-[10px] font-medium text-muted">
              <GitBranch className="h-3 w-3" />
              任务执行计划
            </div>
            {taskPlan.map((task, index) => (
              <div
                key={task.id}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-2 py-1.5",
                  task.status === "running"
                    ? "border-accent/30 bg-accent/5"
                    : task.status === "done"
                      ? "border-success/20 bg-success/5"
                      : "border-rule bg-bg",
                )}
              >
                <TaskPlanStatusIcon status={task.status} />
                <span className="text-[10px] font-mono text-muted">
                  #{index + 1}
                </span>
                <span className="text-xs text-ink">{task.description}</span>
                <span className="ml-auto text-[10px] text-muted">
                  {task.assignedAgent === "learning" && "学习导师"}
                  {task.assignedAgent === "research" && "研究分析师"}
                  {task.assignedAgent === "knowledge" && "知识库专家"}
                  {task.assignedAgent === "report" && "报告撰写员"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** 单条消息气泡 */
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const orchestratorResponse = useWorkspaceStore((s) => s.orchestratorResponse);
  const isLatestAssistant = !isUser && orchestratorResponse !== null;

  return (
    <div
      className={cn(
        "group flex gap-3",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          isUser ? "bg-accent/15" : "bg-accent2/15",
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-accent" />
        ) : (
          <Bot className="h-4 w-4 text-accent2" />
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          "max-w-[75%] min-w-0",
          isUser ? "items-end" : "items-start",
        )}
      >
        <div
          className={cn(
            "rounded-xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "bg-accent/15 text-ink rounded-tr-sm"
              : "bg-surface text-ink rounded-tl-sm",
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div
              className="prose-invert max-w-none [&_strong]:text-accent [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(message.content),
              }}
            />
          )}
        </div>
        <MessageActions message={message} />
        {isLatestAssistant && <MultiAgentFooter />}
      </div>
    </div>
  );
}

/** 欢迎界面 */
function WelcomeScreen() {
  const quickActions = [
    {
      icon: TrendingUp,
      label: "分析股票",
      desc: "输入股票名称获取分析报告",
      color: "text-accent",
      bgColor: "bg-accent/10",
      prompt: "帮我分析一下贵州茅台的最新走势",
    },
    {
      icon: BookOpen,
      label: "投资学习",
      desc: "学习金融知识和投资技巧",
      color: "text-accent2",
      bgColor: "bg-accent2/10",
      prompt: "教我如何看懂K线图",
    },
    {
      icon: Database,
      label: "知识库查询",
      desc: "检索研究报告和文档",
      color: "text-accent3",
      bgColor: "bg-accent3/10",
      prompt: "搜索知识库中关于新能源行业的研报",
    },
    {
      icon: MessageCircle,
      label: "自由对话",
      desc: "与AI助手自由交流",
      color: "text-muted",
      bgColor: "bg-surface2",
      prompt: "你好，介绍一下你能做什么",
    },
  ];

  const handleQuickAction = useMessageStore((s) => s.addMessage);
  const createConversation = useConversationStore((s) => s.createConversation);
  const selectConversation = useConversationStore((s) => s.selectConversation);

  const onQuickAction = (prompt: string) => {
    const convId = createConversation();
    selectConversation(convId);
    handleQuickAction({
      conversationId: convId,
      role: "user",
      content: prompt,
    });
  };

  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
        <Sparkles className="h-8 w-8 text-accent" />
      </div>
      <h2 className="mb-2 text-xl font-bold text-ink">FinPilot AI 工作区</h2>
      <p className="mb-8 max-w-md text-center text-sm text-muted">
        输入您的问题，AI 助手将为您分析股票、解答投资疑问、检索知识库
      </p>
      <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => onQuickAction(action.prompt)}
            className="flex items-start gap-3 rounded-xl border border-rule bg-surface p-4 text-left transition-all hover:border-accent/30 hover:bg-surface2"
          >
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                action.bgColor,
              )}
            >
              <action.icon className={cn("h-4 w-4", action.color)} />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">{action.label}</p>
              <p className="mt-0.5 text-xs text-muted">{action.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/** 聊天区域主组件 */
export function ChatArea() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentConversationId = useConversationStore(
    (s) => s.currentConversationId,
  );
  const messages = useMessageStore((s) => s.messages);

  const currentMessages = useMemo(
    () =>
      currentConversationId
        ? messages.filter((m) => m.conversationId === currentConversationId)
        : [],
    [messages, currentConversationId],
  );

  const isStreaming = useWorkspaceStore((s) => s.isStreaming);
  const streamingContent = useWorkspaceStore((s) => s.streamingContent);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentMessages, streamingContent]);

  if (!currentConversationId || currentMessages.length === 0) {
    return (
      <div className="flex flex-1 overflow-hidden">
        <WelcomeScreen />
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-6"
    >
      {currentMessages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {/* Streaming 消息卡片 */}
      {isStreaming && (
        <div className="group flex gap-3 flex-row">
          {/* Avatar */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent2/15">
            <Bot className="h-4 w-4 text-accent2" />
          </div>

          {/* Content */}
          <div className="max-w-[75%] min-w-0 items-start">
            <div className="rounded-xl px-4 py-3 text-sm leading-relaxed bg-surface text-ink rounded-tl-sm border-l-2 border-accent">
              <div
                className="prose-invert max-w-none [&_strong]:text-accent [&_strong]:font-semibold"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(streamingContent),
                }}
              />
              <span className="inline-block h-4 w-0.5 bg-accent animate-blink ml-0.5 align-middle" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
