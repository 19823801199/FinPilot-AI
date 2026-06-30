"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Send, Square, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/store/workspace-store";
import { useMessageStore } from "@/store/message-store";
import { useConversationStore } from "@/store/conversation-store";
import { classifyUserInput, generateMockWorkflowSteps } from "@/lib/mock-chat";

export function ChatInput() {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isGenerating = useWorkspaceStore((s) => s.isGenerating);
  const startGenerating = useWorkspaceStore((s) => s.startGenerating);
  const updateStep = useWorkspaceStore((s) => s.updateStep);
  const stopGenerating = useWorkspaceStore((s) => s.stopGenerating);
  const resetWorkflow = useWorkspaceStore((s) => s.resetWorkflow);
  const simulateOrchestrator = useWorkspaceStore((s) => s.simulateOrchestrator);
  const startStreaming = useWorkspaceStore((s) => s.startStreaming);
  const stopStreaming = useWorkspaceStore((s) => s.stopStreaming);
  const appendStreamingContent = useWorkspaceStore(
    (s) => s.appendStreamingContent,
  );
  const setStreamingContent = useWorkspaceStore((s) => s.setStreamingContent);

  const addMessage = useMessageStore((s) => s.addMessage);
  const currentConversationId = useConversationStore(
    (s) => s.currentConversationId,
  );
  const createConversation = useConversationStore((s) => s.createConversation);
  const updateConversationTitle = useConversationStore(
    (s) => s.updateConversationTitle,
  );

  /** 自动调整 textarea 高度 */
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [input, adjustHeight]);

  /** 模拟工作流执行 */
  const simulateWorkflow = useCallback(
    async (
      taskType: ReturnType<typeof classifyUserInput>,
      steps: ReturnType<typeof generateMockWorkflowSteps>,
    ) => {
      for (let i = 0; i < steps.length; i++) {
        if (!useWorkspaceStore.getState().isGenerating) return;

        updateStep(steps[i].id, "running");
        await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
        if (!useWorkspaceStore.getState().isGenerating) return;
        updateStep(steps[i].id, "done");
      }
    },
    [updateStep],
  );

  /** SSE 流式发送消息 */
  const sendStreamMessage = useCallback(
    async (content: string, convId: string) => {
      startStreaming();
      try {
        const response = await fetch("/api/v1/chat/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: content, conversation_id: convId }),
        });
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          // 解析 SSE 格式 data: {...}
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  appendStreamingContent(parsed.content);
                }
              } catch {}
            }
          }
        }

        // 流结束时，将完整内容作为 assistant 消息保存
        const fullContent = useWorkspaceStore.getState().streamingContent;
        if (fullContent) {
          addMessage({
            conversationId: convId,
            role: "assistant",
            content: fullContent,
          });
          const lastMsg =
            fullContent.length > 30
              ? `${fullContent.slice(0, 30)}...`
              : fullContent;
          useConversationStore.setState((state) => ({
            conversations: state.conversations.map((c) =>
              c.id === convId
                ? {
                    ...c,
                    lastMessage: lastMsg,
                    updatedAt: new Date().toISOString(),
                  }
                : c,
            ),
          }));
        }
      } finally {
        stopStreaming();
        setStreamingContent("");
      }
    },
    [
      startStreaming,
      stopStreaming,
      appendStreamingContent,
      setStreamingContent,
      addMessage,
    ],
  );

  /** 发送消息 */
  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    let convId = currentConversationId;
    if (!convId) {
      convId = createConversation();
    }

    // 添加用户消息
    addMessage({ conversationId: convId, role: "user", content: trimmed });

    // 如果是第一条消息，用消息内容更新会话标题
    const convMessages = useMessageStore
      .getState()
      .messages.filter((m) => m.conversationId === convId);
    if (convMessages.length <= 1) {
      const title =
        trimmed.length > 20 ? `${trimmed.slice(0, 20)}...` : trimmed;
      updateConversationTitle(convId, title);
    }

    setInput("");

    // 分类任务类型
    const taskType = classifyUserInput(trimmed);
    const steps = generateMockWorkflowSteps(taskType);
    startGenerating(taskType, steps);

    // 同时触发 Multi-Agent Orchestrator 和原有工作流
    const orchestratorPromise = simulateOrchestrator(trimmed);
    await simulateWorkflow(taskType, steps);
    await orchestratorPromise;

    // 检查是否还在生成中（可能被用户停止）
    if (useWorkspaceStore.getState().isGenerating) {
      // 使用 SSE 流式发送消息替代原有的 Mock 响应
      await sendStreamMessage(trimmed, convId);

      resetWorkflow();
    }
  }, [
    input,
    currentConversationId,
    addMessage,
    createConversation,
    updateConversationTitle,
    startGenerating,
    simulateWorkflow,
    resetWorkflow,
    simulateOrchestrator,
    sendStreamMessage,
  ]);

  /** 键盘事件 */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!isGenerating) {
          handleSend();
        }
      }
    },
    [handleSend, isGenerating],
  );

  const handleStop = useCallback(() => {
    stopGenerating();
  }, [stopGenerating]);

  return (
    <div className="border-t border-rule bg-bg2 px-4 py-3">
      <div className="mx-auto flex max-w-4xl items-end gap-3">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入您的问题，例如：分析贵州茅台的最新财报..."
            rows={1}
            className="w-full resize-none rounded-xl border border-rule bg-surface px-4 py-3 pr-10 text-sm text-ink placeholder:text-muted outline-none transition-colors focus:border-accent/40"
          />
          <div className="absolute bottom-3 right-3 text-muted">
            <Sparkles className="h-4 w-4" />
          </div>
        </div>

        {isGenerating ? (
          <button
            onClick={handleStop}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-danger/15 text-danger transition-colors hover:bg-danger/25"
            title="停止生成"
          >
            <Square className="h-4 w-4 fill-current" />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all",
              input.trim()
                ? "bg-accent text-bg hover:bg-accent/90"
                : "bg-surface text-muted cursor-not-allowed",
            )}
            title="发送消息"
          >
            <Send className="h-4 w-4" />
          </button>
        )}
      </div>
      <p className="mt-2 text-center text-xs text-muted/60">
        Shift + Enter 换行，Enter 发送
      </p>
    </div>
  );
}
