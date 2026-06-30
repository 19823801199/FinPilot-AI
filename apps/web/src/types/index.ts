/** 用户信息 */
export interface User {
  id: string;
  nickname: string;
  email: string;
  avatar?: string;
  role: "admin" | "user";
}

/** 通用 API 响应 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

/** 对话 */
export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
}

/** 消息 */
export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

/** 股票信息 */
export interface Stock {
  code: string;
  name: string;
  market: "SH" | "SZ" | "HK" | "US";
  price?: number;
  changePercent?: number;
}

/** 知识库文档 */
export interface KnowledgeDoc {
  id: string;
  title: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export type { TaskType, WorkflowStep, WorkspaceState } from "./workspace";

export type {
  AgentRole,
  AgentInfo,
  TaskPlan,
  OrchestratorResponse,
  PromptTemplate,
  StreamingState,
} from "./workspace";

export type {
  StockSearchResult,
  StockDetail,
  PricePoint,
  StockChartData,
  ResearchStep,
  ResearchReport,
  WatchlistItem,
} from "./stock";

export type {
  KnowledgeDocument,
  KnowledgeStats,
  ChunkInfo,
  RetrievalResult,
  RAGQuery,
  RAGAnswer,
  KnowledgeCategory,
} from "./knowledge";

export type {
  Course,
  Chapter,
  ExerciseQuestion,
  SubmitResult,
  MistakeRecord,
  StudyReport,
  AIExplanation,
} from "./learning";
