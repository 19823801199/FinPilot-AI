import { create } from "zustand";
import type {
  TaskType,
  WorkflowStep,
  WorkspaceState,
  AgentInfo,
  TaskPlan,
  OrchestratorResponse,
  AgentRole,
} from "@/types/workspace";

interface WorkspaceStore extends WorkspaceState {
  startGenerating: (taskType: TaskType, steps: WorkflowStep[]) => void;
  updateStep: (stepId: string, status: WorkflowStep["status"]) => void;
  stopGenerating: () => void;
  resetWorkflow: () => void;

  // 新增 Multi-Agent 状态
  agents: AgentInfo[];
  taskPlan: TaskPlan[];
  orchestratorResponse: OrchestratorResponse | null;
  setAgents: (agents: AgentInfo[]) => void;
  setTaskPlan: (plan: TaskPlan[]) => void;
  setOrchestratorResponse: (response: OrchestratorResponse | null) => void;
  simulateOrchestrator: (query: string) => Promise<void>;

  // 新增 Streaming 状态
  streamingContent: string;
  isStreaming: boolean;
  setStreamingContent: (content: string) => void;
  appendStreamingContent: (chunk: string) => void;
  startStreaming: () => void;
  stopStreaming: () => void;
}

const DEFAULT_AGENTS: AgentInfo[] = [
  {
    id: "agent-learning",
    name: "学习导师",
    role: "learning",
    avatar: "📚",
    description: "负责投资知识讲解、概念解析和学习路径规划",
    capabilities: ["概念讲解", "习题生成", "学习路径规划"],
    status: "idle",
    currentTask: null,
    completedTasks: 0,
  },
  {
    id: "agent-research",
    name: "研究分析师",
    role: "research",
    avatar: "🔬",
    description: "负责股票分析、市场研究和数据挖掘",
    capabilities: ["股票分析", "市场研究", "数据挖掘"],
    status: "idle",
    currentTask: null,
    completedTasks: 0,
  },
  {
    id: "agent-knowledge",
    name: "知识库专家",
    role: "knowledge",
    avatar: "🗂️",
    description: "负责知识库检索、文档分析和信息整合",
    capabilities: ["知识库检索", "文档分析", "信息整合"],
    status: "idle",
    currentTask: null,
    completedTasks: 0,
  },
  {
    id: "agent-report",
    name: "报告撰写员",
    role: "report",
    avatar: "📝",
    description: "负责报告生成、内容整合和格式排版",
    capabilities: ["报告生成", "内容整合", "格式排版"],
    status: "idle",
    currentTask: null,
    completedTasks: 0,
  },
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function getScenario(query: string): {
  roles: AgentRole[];
  steps: { description: string; assignedAgent: AgentRole }[];
  finalAnswer: string;
} {
  const q = query.toLowerCase();
  const hasMaotai = q.includes("茅台") || q.includes("maotai");
  const hasStock =
    q.includes("股票") || q.includes("stock") || q.includes("股价");
  const hasCapm = q.includes("capm") || q.includes("资本资产定价");
  const hasLearning =
    q.includes("学习") ||
    q.includes("教程") ||
    q.includes("怎么") ||
    q.includes("如何");
  const hasReport =
    q.includes("研报") || q.includes("报告") || q.includes("文档");
  const has431 = q.includes("431");

  // 场景4: 最复杂
  if (hasMaotai && hasReport && has431) {
    return {
      roles: ["research", "knowledge", "learning", "report"],
      steps: [
        { description: "检索茅台相关研报和文档", assignedAgent: "knowledge" },
        { description: "分析茅台股票基本面数据", assignedAgent: "research" },
        { description: "查询431金融学相关知识点", assignedAgent: "learning" },
        { description: "整合研报数据与财务指标", assignedAgent: "research" },
        { description: "结合431理论进行深度分析", assignedAgent: "learning" },
        { description: "生成综合分析草稿", assignedAgent: "report" },
        { description: "输出最终研究报告", assignedAgent: "report" },
      ],
      finalAnswer:
        "基于知识库研报、股票基本面分析和431金融学理论，为您生成了一份贵州茅台的深度研究报告。",
    };
  }

  // 场景1: 股票分析
  if (hasMaotai || hasStock) {
    return {
      roles: ["research", "report"],
      steps: [
        { description: "收集股票行情和基本面数据", assignedAgent: "research" },
        { description: "进行技术面和财务分析", assignedAgent: "research" },
        { description: "生成分析摘要", assignedAgent: "report" },
        { description: "输出最终股票分析报告", assignedAgent: "report" },
      ],
      finalAnswer:
        "已完成股票分析，为您提供技术面、基本面及投资建议的综合报告。",
    };
  }

  // 场景2: 学习
  if (hasCapm || hasLearning) {
    return {
      roles: ["learning", "report"],
      steps: [
        { description: "解析用户学习需求", assignedAgent: "learning" },
        { description: "生成知识点讲解和示例", assignedAgent: "learning" },
        { description: "整理学习总结", assignedAgent: "report" },
      ],
      finalAnswer: "已为您生成投资学习材料，包含核心概念讲解和实例分析。",
    };
  }

  // 场景3: 知识库/研报
  if (hasReport) {
    return {
      roles: ["knowledge", "report"],
      steps: [
        { description: "检索知识库相关文档", assignedAgent: "knowledge" },
        { description: "分析和提取关键信息", assignedAgent: "knowledge" },
        { description: "生成检索报告", assignedAgent: "report" },
      ],
      finalAnswer: "已从知识库检索并整合相关文档，为您生成检索报告。",
    };
  }

  // 场景5: 默认
  return {
    roles: ["report"],
    steps: [
      { description: "分析用户查询意图", assignedAgent: "report" },
      { description: "生成回复内容", assignedAgent: "report" },
    ],
    finalAnswer: "已根据您的问题生成回复。",
  };
}

export const useWorkspaceStore = create<WorkspaceStore>()((set, get) => ({
  isGenerating: false,
  currentTaskType: null,
  workflowSteps: [],
  abortController: null,

  agents: DEFAULT_AGENTS.map((a) => ({ ...a })),
  taskPlan: [],
  orchestratorResponse: null,

  streamingContent: "",
  isStreaming: false,

  startGenerating: (taskType, steps) =>
    set({
      isGenerating: true,
      currentTaskType: taskType,
      workflowSteps: steps,
      abortController: new AbortController(),
    }),

  updateStep: (stepId, status) =>
    set((state) => ({
      workflowSteps: state.workflowSteps.map((step) =>
        step.id === stepId ? { ...step, status } : step,
      ),
    })),

  stopGenerating: () =>
    set((state) => {
      state.abortController?.abort();
      return {
        isGenerating: false,
        currentTaskType: null,
        workflowSteps: [],
        abortController: null,
      };
    }),

  resetWorkflow: () =>
    set({
      isGenerating: false,
      currentTaskType: null,
      workflowSteps: [],
      abortController: null,
    }),

  setAgents: (agents) => set({ agents }),
  setTaskPlan: (taskPlan) => set({ taskPlan }),
  setOrchestratorResponse: (orchestratorResponse) =>
    set({ orchestratorResponse }),

  setStreamingContent: (content) => set({ streamingContent: content }),
  appendStreamingContent: (chunk) =>
    set((state) => ({ streamingContent: state.streamingContent + chunk })),
  startStreaming: () => set({ isStreaming: true, streamingContent: "" }),
  stopStreaming: () => set({ isStreaming: false }),

  simulateOrchestrator: async (query: string) => {
    const startTime = Date.now();
    const scenario = getScenario(query);

    // 初始化 agents
    const initialAgents = DEFAULT_AGENTS.map((a) => ({
      ...a,
      status: (scenario.roles.includes(a.role)
        ? "idle"
        : "offline") as AgentInfo["status"],
      currentTask: null,
      completedTasks: 0,
    }));
    set({ agents: initialAgents, taskPlan: [], orchestratorResponse: null });

    // 构建 taskPlan
    const plan: TaskPlan[] = scenario.steps.map((step, index) => ({
      id: `task-${index + 1}`,
      description: step.description,
      assignedAgent: step.assignedAgent,
      dependencies: index > 0 ? [`task-${index}`] : [],
      status: "pending",
      result: null,
      startedAt: null,
      completedAt: null,
    }));
    set({ taskPlan: plan });

    // 模拟执行每一步
    for (let i = 0; i < plan.length; i++) {
      const task = plan[i];
      const delay = 400 + Math.floor(Math.random() * 401); // 400-800ms

      // 更新 agent 为 busy
      set((state) => ({
        agents: state.agents.map((a) =>
          a.role === task.assignedAgent
            ? { ...a, status: "busy" as const, currentTask: task.description }
            : a,
        ),
        taskPlan: state.taskPlan.map((t) =>
          t.id === task.id
            ? {
                ...t,
                status: "running" as const,
                startedAt: new Date().toISOString(),
              }
            : t,
        ),
      }));

      await sleep(delay);

      // 更新 agent 为 idle，增加 completedTasks
      set((state) => ({
        agents: state.agents.map((a) =>
          a.role === task.assignedAgent
            ? {
                ...a,
                status: "idle" as const,
                currentTask: null,
                completedTasks: a.completedTasks + 1,
              }
            : a,
        ),
        taskPlan: state.taskPlan.map((t) =>
          t.id === task.id
            ? {
                ...t,
                status: "done" as const,
                completedAt: new Date().toISOString(),
                result: `完成: ${t.description}`,
              }
            : t,
        ),
      }));
    }

    const executionTime = Date.now() - startTime;
    const involvedAgents = get().agents.filter((a) =>
      scenario.roles.includes(a.role),
    );

    const response: OrchestratorResponse = {
      finalAnswer: scenario.finalAnswer,
      taskPlan: get().taskPlan,
      agentsInvolved: involvedAgents,
      executionTime,
    };

    set({ orchestratorResponse: response });
  },
}));

export type { WorkspaceState };
