import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Message } from "@/types";

interface MessageStore {
  messages: Message[];
  addMessage: (msg: Omit<Message, "id" | "createdAt">) => string;
  updateMessageContent: (id: string, content: string) => void;
  deleteMessage: (id: string) => void;
  clearMessages: (conversationId: string) => void;
  getMessagesByConversation: (conversationId: string) => Message[];
}

const mockMessages: Message[] = [
  {
    id: "msg-001",
    conversationId: "conv-001",
    role: "user",
    content: "帮我分析一下贵州茅台2025年Q1的财报数据",
    createdAt: "2025-06-20T10:30:00Z",
  },
  {
    id: "msg-002",
    conversationId: "conv-001",
    role: "assistant",
    content:
      "**贵州茅台 2025年Q1财报分析**\n\n根据最新披露的数据，贵州茅台（600519.SH）2025年第一季度表现亮眼：\n\n**营收数据**\n- 营业收入：**412.8亿元**，同比增长 **18.2%**\n- 净利润：**205.6亿元**，同比增长 **20.5%**\n- 毛利率维持在 **91.5%** 的高位\n\n**核心亮点**\n1. 直销渠道收入占比提升至 **42%**，渠道改革成效显著\n2. 系列酒增速达 **28%**，产品矩阵持续优化\n3. 经营性现金流净额 **218亿元**，盈利质量优秀\n\n**风险提示**\n- 基数效应下，下半年增速可能放缓\n- 白酒行业整体消费场景仍待恢复\n\n建议持续关注渠道库存变化和批价走势。",
    createdAt: "2025-06-20T10:31:00Z",
  },
  {
    id: "msg-003",
    conversationId: "conv-001",
    role: "user",
    content: "和五粮液对比一下呢？",
    createdAt: "2025-06-20T11:00:00Z",
  },
  {
    id: "msg-004",
    conversationId: "conv-001",
    role: "assistant",
    content:
      "**茅台 vs 五粮液 2025Q1对比**\n\n| 指标 | 贵州茅台 | 五粮液 |\n|------|---------|--------|\n| 营收 | 412.8亿 | 278.3亿 |\n| 净利润 | 205.6亿 | 108.2亿 |\n| 营收增速 | 18.2% | 12.5% |\n| 净利率 | 49.8% | 38.9% |\n\n茅台在盈利能力和增速上均优于五粮液，但五粮液的估值相对更低，PE约18倍，茅台约32倍。两者各有优势，适合不同风险偏好的投资者。",
    createdAt: "2025-06-20T11:01:00Z",
  },
  {
    id: "msg-005",
    conversationId: "conv-002",
    role: "user",
    content: "什么是MACD指标？怎么使用？",
    createdAt: "2025-06-19T14:20:00Z",
  },
  {
    id: "msg-006",
    conversationId: "conv-002",
    role: "assistant",
    content:
      "**MACD指标详解**\n\nMACD（Moving Average Convergence Divergence）即指数平滑移动平均线，是最常用的技术分析指标之一。\n\n**组成要素**\n- **DIF线**（快线）：12日EMA - 26日EMA\n- **DEA线**（慢线）：DIF的9日EMA\n- **MACD柱状图**：DIF - DEA 的2倍\n\n**核心用法**\n1. **金叉买入**：DIF上穿DEA，尤其是零轴上方金叉信号更可靠\n2. **死叉卖出**：DIF下穿DEA，零轴下方死叉需警惕\n3. **顶背离**：价格创新高但MACD未创新高，预示上涨动力减弱\n4. **底背离**：价格创新低但MACD未创新低，可能形成底部反转\n\n建议配合成交量和其他指标综合判断。",
    createdAt: "2025-06-19T14:21:00Z",
  },
];

export const useMessageStore = create<MessageStore>()(
  persist(
    (set, get) => ({
      messages: mockMessages,

      addMessage: (msg) => {
        const newMsg: Message = {
          ...msg,
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          messages: [...state.messages, newMsg],
        }));
        return newMsg.id;
      },

      updateMessageContent: (id, content) =>
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === id ? { ...m, content } : m,
          ),
        })),

      deleteMessage: (id) =>
        set((state) => ({
          messages: state.messages.filter((m) => m.id !== id),
        })),

      clearMessages: (conversationId) =>
        set((state) => ({
          messages: state.messages.filter(
            (m) => m.conversationId !== conversationId,
          ),
        })),

      getMessagesByConversation: (conversationId) =>
        get().messages.filter((m) => m.conversationId === conversationId),
    }),
    {
      name: "finpilot-messages",
      partialize: (state) => ({
        messages: state.messages,
      }),
    },
  ),
);

export type { MessageStore as MessageState };
