"use client";

import { useState } from "react";
import {
  ChevronRight,
  Circle,
  Loader2,
  CheckCircle2,
  XCircle,
  TrendingUp,
  BookOpen,
  Database,
  MessageCircle,
  PanelRightClose,
  PanelRightOpen,
  Users,
  GitBranch,
  ScrollText,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/store/workspace-store";
import type {
  TaskType,
  WorkflowStep,
  AgentInfo,
  TaskPlan,
} from "@/types/workspace";

/** 任务类型配置 */
const TASK_TYPE_CONFIG: Record<
  TaskType,
  { label: string; icon: typeof TrendingUp; color: string; bgColor: string }
> = {
  stock: {
    label: "股票分析",
    icon: TrendingUp,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  learning: {
    label: "投资学习",
    icon: BookOpen,
    color: "text-accent2",
    bgColor: "bg-accent2/10",
  },
  knowledge: {
    label: "知识库查询",
    icon: Database,
    color: "text-accent3",
    bgColor: "bg-accent3/10",
  },
  general: {
    label: "通用对话",
    icon: MessageCircle,
    color: "text-muted",
    bgColor: "bg-surface2",
  },
};

/** 步骤状态图标 */
function StepStatusIcon({ status }: { status: WorkflowStep["status"] }) {
  switch (status) {
    case "pending":
      return <Circle className="h-3.5 w-3.5 text-muted/40" />;
    case "running":
      return <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />;
    case "done":
      return <CheckCircle2 className="h-3.5 w-3.5 text-success" />;
    case "error":
      return <XCircle className="h-3.5 w-3.5 text-danger" />;
  }
}

/** 步骤连接线 */
function StepConnector({ status }: { status: WorkflowStep["status"] }) {
  return (
    <div
      className={cn(
        "ml-[6px] h-4 w-0.5",
        status === "done"
          ? "bg-success/40"
          : status === "running"
            ? "bg-accent/40"
            : "bg-rule",
      )}
    />
  );
}

/** 专家状态颜色 */
function AgentStatusBadge({ status }: { status: AgentInfo["status"] }) {
  const config = {
    idle: {
      label: "空闲",
      color: "text-success",
      bg: "bg-success/10",
      dot: "bg-success",
    },
    busy: {
      label: "忙碌",
      color: "text-accent",
      bg: "bg-accent/10",
      dot: "bg-accent",
    },
    offline: {
      label: "离线",
      color: "text-muted",
      bg: "bg-muted/10",
      dot: "bg-muted",
    },
  };
  const c = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
        c.color,
        c.bg,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          c.dot,
          status === "busy" && "animate-pulse",
        )}
      />
      {c.label}
    </span>
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

/** 专家卡片 */
function AgentCard({ agent }: { agent: AgentInfo }) {
  return (
    <div
      className={cn(
        "rounded-lg border p-2 transition-colors",
        agent.status === "busy"
          ? "border-accent/30 bg-accent/5"
          : agent.status === "offline"
            ? "border-rule/50 bg-bg opacity-60"
            : "border-rule bg-surface",
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-surface2 text-base">
          {agent.avatar}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ink truncate">
              {agent.name}
            </span>
            <AgentStatusBadge status={agent.status} />
          </div>
          {agent.currentTask && (
            <p className="mt-0.5 truncate text-[10px] text-accent">
              {agent.currentTask}
            </p>
          )}
          <p className="text-[10px] text-muted">
            已完成 {agent.completedTasks} 项任务
          </p>
        </div>
      </div>
    </div>
  );
}

/** 任务树节点 */
function TaskTreeNode({
  task,
  index,
  total,
}: {
  task: TaskPlan;
  index: number;
  total: number;
}) {
  const isRunning = task.status === "running";
  return (
    <div className="relative">
      <div
        className={cn(
          "flex items-start gap-2 rounded-lg border px-2.5 py-2 transition-colors",
          isRunning
            ? "border-accent/40 bg-accent/5"
            : task.status === "done"
              ? "border-success/20 bg-success/5"
              : "border-rule bg-surface",
        )}
      >
        <div className="mt-0.5 flex flex-col items-center">
          <TaskPlanStatusIcon status={task.status} />
          {index < total - 1 && (
            <div
              className={cn(
                "mt-1 h-full min-h-[16px] w-0.5",
                task.status === "done" ? "bg-success/30" : "bg-rule",
              )}
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-muted">
              #{index + 1}
            </span>
            <span
              className={cn(
                "text-xs",
                isRunning ? "font-medium text-accent" : "text-ink",
              )}
            >
              {task.description}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-1">
            <Users className="h-2.5 w-2.5 text-muted/60" />
            <span className="text-[10px] text-muted/80">
              {task.assignedAgent === "learning" && "学习导师"}
              {task.assignedAgent === "research" && "研究分析师"}
              {task.assignedAgent === "knowledge" && "知识库专家"}
              {task.assignedAgent === "report" && "报告撰写员"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 执行日志 */
function ExecutionLog({ taskPlan }: { taskPlan: TaskPlan[] }) {
  const logs = taskPlan
    .filter((t) => t.startedAt)
    .map((t) => {
      const time = t.startedAt
        ? new Date(t.startedAt).toLocaleTimeString("zh-CN", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        : "";
      const agentName =
        t.assignedAgent === "learning"
          ? "学习导师"
          : t.assignedAgent === "research"
            ? "研究分析师"
            : t.assignedAgent === "knowledge"
              ? "知识库专家"
              : "报告撰写员";
      const action =
        t.status === "running"
          ? `开始执行: ${t.description}`
          : t.status === "done"
            ? `完成: ${t.description}`
            : `执行: ${t.description}`;
      return { time, agentName, action, status: t.status };
    });

  if (logs.length === 0) return null;

  return (
    <div className="space-y-1.5">
      {logs.map((log, i) => (
        <div key={i} className="flex items-start gap-2 text-[11px]">
          <span className="shrink-0 font-mono text-muted/50">[{log.time}]</span>
          <span className="shrink-0 font-medium text-accent">
            {log.agentName}:
          </span>
          <span
            className={cn(
              "text-muted",
              log.status === "running" && "text-accent",
            )}
          >
            {log.action}
          </span>
        </div>
      ))}
    </div>
  );
}

interface StatusPanelProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function StatusPanel({ collapsed, onToggle }: StatusPanelProps) {
  const [localCollapsed, setLocalCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"experts" | "tasks" | "logs">(
    "experts",
  );
  const isGenerating = useWorkspaceStore((s) => s.isGenerating);
  const currentTaskType = useWorkspaceStore((s) => s.currentTaskType);
  const workflowSteps = useWorkspaceStore((s) => s.workflowSteps);
  const agents = useWorkspaceStore((s) => s.agents);
  const taskPlan = useWorkspaceStore((s) => s.taskPlan);
  const orchestratorResponse = useWorkspaceStore((s) => s.orchestratorResponse);
  const isStreaming = useWorkspaceStore((s) => s.isStreaming);

  const isPanelVisible = !collapsed && !localCollapsed;
  const hasMultiAgent =
    agents.some((a) => a.status !== "offline") || taskPlan.length > 0;

  const taskConfig = currentTaskType ? TASK_TYPE_CONFIG[currentTaskType] : null;

  return (
    <aside
      className={cn(
        "relative flex flex-col border-l border-rule bg-bg2 transition-all duration-300",
        collapsed ? "w-0 overflow-hidden opacity-0" : "w-[280px] opacity-100",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-rule px-4 py-3">
        <h2 className="text-sm font-semibold text-ink">工作流状态</h2>
        <button
          onClick={() => {
            setLocalCollapsed(!localCollapsed);
            onToggle();
          }}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-ink"
          title="收起面板"
        >
          <PanelRightClose className="h-4 w-4" />
        </button>
      </div>

      {isPanelVisible && (
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Task Type Badge */}
          {taskConfig && (
            <div className="border-b border-rule px-4 py-3">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg",
                    taskConfig.bgColor,
                  )}
                >
                  <taskConfig.icon
                    className={cn("h-3.5 w-3.5", taskConfig.color)}
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-ink">
                    {taskConfig.label}
                  </p>
                  <p className="text-xs text-muted">
                    {isGenerating
                      ? "处理中..."
                      : orchestratorResponse
                        ? "已完成"
                        : "等待中"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Workflow Steps */}
          <div className="border-b border-rule px-4 py-3">
            {workflowSteps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <ChevronRight className="mb-2 h-6 w-6 text-muted/20" />
                <p className="text-xs text-muted/60">
                  发送消息后，AI 工作流将在此显示
                </p>
              </div>
            ) : (
              <div className="space-y-0">
                {workflowSteps.map((step, index) => (
                  <div key={step.id}>
                    <div className="flex items-center gap-2.5">
                      <StepStatusIcon status={step.status} />
                      <span
                        className={cn(
                          "text-xs transition-colors",
                          step.status === "running"
                            ? "text-accent font-medium"
                            : step.status === "done"
                              ? "text-ink"
                              : step.status === "error"
                                ? "text-danger"
                                : "text-muted",
                        )}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < workflowSteps.length - 1 && (
                      <StepConnector status={step.status} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Multi-Agent 区域 */}
          {hasMultiAgent && (
            <div className="flex flex-1 flex-col">
              {/* Tab 切换 */}
              <div className="flex border-b border-rule">
                {[
                  { key: "experts" as const, label: "专家状态", icon: Users },
                  { key: "tasks" as const, label: "任务树", icon: GitBranch },
                  { key: "logs" as const, label: "执行日志", icon: ScrollText },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors",
                      activeTab === tab.key
                        ? "text-accent border-b-2 border-accent"
                        : "text-muted hover:text-ink",
                    )}
                  >
                    <tab.icon className="h-3 w-3" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab 内容 */}
              <div className="flex-1 px-3 py-3">
                {activeTab === "experts" && (
                  <div className="space-y-2">
                    {agents.map((agent) => (
                      <AgentCard key={agent.id} agent={agent} />
                    ))}
                  </div>
                )}

                {activeTab === "tasks" && (
                  <div className="space-y-0">
                    {taskPlan.map((task, index) => (
                      <TaskTreeNode
                        key={task.id}
                        task={task}
                        index={index}
                        total={taskPlan.length}
                      />
                    ))}
                  </div>
                )}

                {activeTab === "logs" && <ExecutionLog taskPlan={taskPlan} />}
              </div>

              {/* 执行时间 */}
              {orchestratorResponse && (
                <div className="border-t border-rule px-3 py-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-muted">
                    <Clock className="h-3 w-3" />
                    <span>
                      执行耗时:{" "}
                      {(orchestratorResponse.executionTime / 1000).toFixed(2)}s
                      {" · "}
                      {orchestratorResponse.agentsInvolved.length} 位专家协同
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          {(isGenerating || isStreaming) && (
            <div className="border-t border-rule px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                <span className="text-xs text-muted">
                  {isStreaming ? "AI 正在流式输出..." : "AI 正在思考..."}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Expand button (shown when collapsed) */}
      {collapsed && (
        <button
          onClick={onToggle}
          className="absolute -left-3 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-rule bg-surface text-muted transition-colors hover:text-accent"
        >
          <PanelRightOpen className="h-3 w-3" />
        </button>
      )}
    </aside>
  );
}
