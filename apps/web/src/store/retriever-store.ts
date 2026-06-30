"use client";

import { create } from "zustand";
import type { RAGAnswer } from "@/types/knowledge";

interface MockQA {
  keywords: string[];
  answer: RAGAnswer;
}

const mockQAPairs: MockQA[] = [
  {
    keywords: ["财务", "营收", "利润", "Q1", "季度"],
    answer: {
      answer:
        "根据2025年Q1财务报告，公司整体业绩表现优异：\n\n1. **营业收入**：同比增长23.5%，达到156.8亿元，超出市场预期\n2. **净利润**：净利润率提升至18.2%，同比增长31.2%\n3. **研发投入**：占比12.8%，同比增加2.3个百分点，持续加大技术创新\n4. **现金流**：经营现金流净额34.5亿元，财务状况健康\n5. **毛利率**：维持在42.6%的较高水平，产品竞争力强劲\n\n整体来看，公司正处于高速成长期，各项核心指标均呈现良好态势。",
      sources: [
        {
          chunkId: "chunk-001",
          documentId: "doc-001",
          documentName: "2025年Q1财务报告.pdf",
          pageNumber: 3,
          content:
            "2025年第一季度，公司实现营业收入156.8亿元，同比增长23.5%，其中主营业务收入占比92.3%...",
          similarity: 0.95,
        },
        {
          chunkId: "chunk-002",
          documentId: "doc-001",
          documentName: "2025年Q1财务报告.pdf",
          pageNumber: 5,
          content:
            "净利润率达到18.2%，较去年同期提升2.1个百分点。研发投入占营收比重12.8%...",
          similarity: 0.88,
        },
        {
          chunkId: "chunk-003",
          documentId: "doc-001",
          documentName: "2025年Q1财务报告.pdf",
          pageNumber: 8,
          content:
            "经营活动产生的现金流量净额为34.5亿元，同比增长15.8%，现金流状况良好...",
          similarity: 0.82,
        },
      ],
      retrievalCount: 3,
      responseTime: 1.23,
    },
  },
  {
    keywords: ["新能源", "汽车", "电动", "电池", "比亚迪"],
    answer: {
      answer:
        "根据新能源汽车行业深度研究报告，当前行业呈现以下关键趋势：\n\n1. **市场规模**：2025年全球新能源汽车销量预计突破2000万辆，渗透率达28%\n2. **技术路线**：固态电池技术取得突破，能量密度提升至400Wh/kg以上\n3. **竞争格局**：比亚迪、特斯拉、宁德时代占据核心市场份额\n4. **政策驱动**：各国补贴政策逐步退坡，市场驱动成为主要增长动力\n5. **投资机会**：重点关注产业链上游锂矿资源、中游电池制造、下游智能驾驶\n\n建议投资者关注具备核心技术优势的龙头企业。",
      sources: [
        {
          chunkId: "chunk-010",
          documentId: "doc-002",
          documentName: "新能源汽车行业深度研究.pdf",
          pageNumber: 2,
          content:
            "2025年全球新能源汽车市场持续高速增长，预计全年销量将突破2000万辆...",
          similarity: 0.92,
        },
        {
          chunkId: "chunk-011",
          documentId: "doc-002",
          documentName: "新能源汽车行业深度研究.pdf",
          pageNumber: 7,
          content:
            "固态电池技术取得重大突破，多家企业宣布量产计划，能量密度提升至400Wh/kg...",
          similarity: 0.85,
        },
      ],
      retrievalCount: 2,
      responseTime: 1.56,
    },
  },
  {
    keywords: ["货币", "央行", "利率", "降息", "政策", "LPR"],
    answer: {
      answer:
        "根据央行货币政策解读报告，当前货币政策要点如下：\n\n1. **政策基调**：稳健的货币政策灵活适度，保持流动性合理充裕\n2. **利率走势**：LPR（贷款市场报价利率）年内已下调2次，1年期LPR降至3.10%\n3. **定向支持**：加大对科技创新、绿色金融、普惠小微等重点领域支持\n4. **汇率管理**：人民币汇率在合理均衡水平上保持基本稳定\n5. **未来展望**：预计下半年仍有降准降息空间，但幅度有限\n\n建议关注央行公开市场操作及政策利率变化对市场的影响。",
      sources: [
        {
          chunkId: "chunk-020",
          documentId: "doc-003",
          documentName: "央行货币政策解读.docx",
          pageNumber: 1,
          content:
            "央行将继续实施稳健的货币政策，灵活精准，合理适度，保持流动性合理充裕...",
          similarity: 0.93,
        },
        {
          chunkId: "chunk-021",
          documentId: "doc-003",
          documentName: "央行货币政策解读.docx",
          pageNumber: 3,
          content:
            "1年期LPR已下调至3.10%，5年期以上LPR下调至3.60%，降低实体经济融资成本...",
          similarity: 0.87,
        },
        {
          chunkId: "chunk-022",
          documentId: "doc-003",
          documentName: "央行货币政策解读.docx",
          pageNumber: 5,
          content:
            "加大对科技创新、绿色金融等重点领域的结构性货币政策工具支持力度...",
          similarity: 0.79,
        },
      ],
      retrievalCount: 3,
      responseTime: 1.08,
    },
  },
  {
    keywords: ["价值投资", "巴菲特", "学习", "笔记", "投资策略"],
    answer: {
      answer:
        '根据价值投资学习笔记，核心要点总结如下：\n\n1. **价值投资本质**：寻找市场价格低于内在价值的投资机会，安全边际是核心\n2. **选股标准**：护城河宽广、ROE持续>15%、负债率合理、管理层优秀\n3. **估值方法**：DCF现金流折现法、PE/PB相对估值法、PEG成长性估值\n4. **投资纪律**：逆向思维、长期持有、适度分散、情绪管理\n5. **巴菲特原则**："别人贪婪时恐惧，别人恐惧时贪婪"\n\n价值投资需要耐心和纪律，短期市场波动不应影响长期投资判断。',
      sources: [
        {
          chunkId: "chunk-030",
          documentId: "doc-004",
          documentName: "价值投资学习笔记.md",
          content:
            "价值投资的核心：寻找市场价格低于内在价值的标的，安全边际是最重要的概念...",
          similarity: 0.91,
        },
        {
          chunkId: "chunk-031",
          documentId: "doc-004",
          documentName: "价值投资学习笔记.md",
          content:
            "巴菲特选股标准：1. 简单可理解的商业模式 2. 持续的竞争优势（护城河）3. 优秀的管理层...",
          similarity: 0.86,
        },
      ],
      retrievalCount: 2,
      responseTime: 0.95,
    },
  },
  {
    keywords: ["半导体", "芯片", "行业", "数据", "产业链"],
    answer: {
      answer:
        "根据半导体行业数据汇总，行业关键数据如下：\n\n1. **市场规模**：2025年全球半导体市场规模预计达6500亿美元，同比增长16%\n2. **区域格局**：中国大陆市场占比约32%，是全球最大的半导体消费市场\n3. **技术节点**：3nm量产稳步推进，2nm研发取得阶段性突破\n4. **国产替代**：国产芯片自给率提升至28%，在成熟制程领域进展显著\n5. **投资热点**：AI芯片、汽车芯片、存储芯片三大方向最受关注\n\n半导体行业正处于新一轮上升周期，建议关注具备先进制程能力的龙头企业。",
      sources: [
        {
          chunkId: "chunk-040",
          documentId: "doc-005",
          documentName: "半导体行业数据汇总.pptx",
          pageNumber: 2,
          content:
            "2025年全球半导体市场规模预计达6500亿美元，同比增长16%，创历史新高...",
          similarity: 0.89,
        },
        {
          chunkId: "chunk-041",
          documentId: "doc-005",
          documentName: "半导体行业数据汇总.pptx",
          pageNumber: 5,
          content:
            "中国大陆半导体消费市场占比约32%，国产芯片自给率提升至28%...",
          similarity: 0.83,
        },
        {
          chunkId: "chunk-042",
          documentId: "doc-005",
          documentName: "半导体行业数据汇总.pptx",
          pageNumber: 8,
          content:
            "AI芯片、汽车芯片、存储芯片三大方向成为投资热点，相关企业估值持续提升...",
          similarity: 0.76,
        },
      ],
      retrievalCount: 3,
      responseTime: 1.34,
    },
  },
];

const defaultAnswer: RAGAnswer = {
  answer:
    "感谢您的提问。基于当前知识库中的文档，我未能找到与您的问题高度相关的内容。建议您：\n\n1. 尝试使用不同的关键词重新提问\n2. 上传更多相关文档以丰富知识库\n3. 使用更具体的金融术语进行查询\n\n目前知识库涵盖的领域包括：财务报告分析、行业研究、政策法规解读、投资学习笔记等。",
  sources: [],
  retrievalCount: 0,
  responseTime: 0.8,
};

export interface RetrieverState {
  query: string;
  isQuerying: boolean;
  answer: RAGAnswer | null;
  queryHistory: Array<{ query: string; timestamp: string }>;
  ragQuery: (query: string) => void;
  clearAnswer: () => void;
}

export const useRetrieverStore = create<RetrieverState>()((set) => ({
  query: "",
  isQuerying: false,
  answer: null,
  queryHistory: [],
  ragQuery: (query: string) => {
    set({ query, isQuerying: true, answer: null });

    const trimmed = query.trim().toLowerCase();
    let matchedAnswer: RAGAnswer | null = null;

    for (const pair of mockQAPairs) {
      if (pair.keywords.some((kw) => trimmed.includes(kw))) {
        matchedAnswer = pair.answer;
        break;
      }
    }

    const finalAnswer = matchedAnswer || defaultAnswer;
    const responseTime = finalAnswer.responseTime;

    setTimeout(() => {
      set((state) => ({
        isQuerying: false,
        answer: finalAnswer,
        queryHistory: [
          { query, timestamp: new Date().toLocaleString("zh-CN") },
          ...state.queryHistory,
        ].slice(0, 20),
      }));
    }, responseTime * 1000);
  },
  clearAnswer: () => set({ answer: null, query: "" }),
}));
