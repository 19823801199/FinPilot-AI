/** 任务类型 - AI 自动识别 */
export type TaskType = "stock" | "learning" | "knowledge" | "general";

/** AI 工作流步骤 */
export interface WorkflowStep {
  id: string;
  label: string;
  status: "pending" | "running" | "done" | "error";
}

/** 工作区状态 */
export interface WorkspaceState {
  isGenerating: boolean;
  currentTaskType: TaskType | null;
  workflowSteps: WorkflowStep[];
  abortController: AbortController | null;
}

export type AgentRole = "learning" | "research" | "knowledge" | "report";

export interface AgentInfo {
  id: string;
  name: string;
  role: AgentRole;
  avatar: string;
  description: string;
  capabilities: string[];
  status: "idle" | "busy" | "offline";
  currentTask: string | null;
  completedTasks: number;
}

export interface TaskPlan {
  id: string;
  description: string;
  assignedAgent: AgentRole;
  dependencies: string[];
  status: "pending" | "running" | "done" | "error";
  result: string | null;
  startedAt: string | null;
  completedAt: string | null;
}

export interface OrchestratorResponse {
  finalAnswer: string;
  taskPlan: TaskPlan[];
  agentsInvolved: AgentInfo[];
  executionTime: number;
}

export interface PromptTemplate {
  id: string;
  name: string;
  role: AgentRole;
  systemPrompt: string;
  taskPrompt: string;
  description: string;
}

export interface StreamingState {
  content: string;
  isStreaming: boolean;
}
