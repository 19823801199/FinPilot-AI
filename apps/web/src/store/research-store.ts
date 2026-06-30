"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ResearchReport, ResearchStep } from "@/types/stock";

interface ResearchState {
  currentReport: ResearchReport | null;
  isAnalyzing: boolean;
  analysisSteps: ResearchStep[];
  analyzeStock: (code: string, name: string) => Promise<void>;
  clearReport: () => void;
}

const defaultSteps: ResearchStep[] = [
  { id: "data-collection", label: "数据采集", status: "pending" },
  { id: "technical-analysis", label: "技术分析", status: "pending" },
  { id: "fundamental-analysis", label: "基本面分析", status: "pending" },
  { id: "risk-assessment", label: "风险评估", status: "pending" },
  { id: "valuation-model", label: "估值建模", status: "pending" },
  { id: "report-generation", label: "报告生成", status: "pending" },
];

const mockReports: Record<
  string,
  Omit<ResearchReport, "workflowSteps" | "generatedAt">
> = {
  "600519.SH": {
    stockCode: "600519.SH",
    stockName: "贵州茅台",
    overview:
      "贵州茅台是中国白酒行业的绝对龙头，拥有深厚的品牌护城河和定价权。公司核心产品飞天茅台供不应求，直营化改革持续推进，盈利能力稳居行业首位。",
    coreView:
      "核心观点：茅台作为稀缺性奢侈品资产，长期具备抗通胀属性。短期批价波动属正常渠道调整，不改长期价值。建议关注直营占比提升对吨价的拉动作用。",
    technicalAnalysis:
      "技术面：股价处于上升通道中，MA60 提供有效支撑。MACD 金叉初现，成交量温和放大。RSI 位于 58 中性偏强区域，未出现明显超买。关键支撑位 1580 元，阻力位 1750 元。",
    fundamentalAnalysis:
      "基本面：2024 年营收预计同比增长 15%，净利润率维持 52% 以上高位。直销渠道占比提升至 45%，带动吨价上行。产能扩张稳步推进，2025 年基酒储备充足。",
    riskAnalysis:
      "风险因素：1) 消费复苏不及预期，高端白酒需求疲软；2) 批价大幅波动影响渠道信心；3) 政策风险（禁酒令等）；4) 年轻消费群体偏好转变。",
    valuationAnalysis:
      "估值分析：当前 PE 28.5 倍，处于近五年 40% 分位。DCF 模型测算合理估值区间 1650-1850 元，对应 2024 年 PE 26-30 倍。相对估值法对比国际烈酒龙头，估值溢价合理。",
    investmentAdvice:
      "投资建议：买入。目标价 1800 元，对应上行空间 6.6%。茅台是 A 股核心资产，适合长期配置。建议回调至 1600 元以下分批建仓，仓位占比不超过组合的 15%。",
    compositeScore: 82,
    keyPoints: [
      "白酒行业龙头，品牌护城河深厚",
      "直营化改革提升盈利能力",
      "批价短期波动，长期供不应求",
      "估值处于合理区间，具备安全边际",
      "适合作为核心资产长期持有",
    ],
  },
  "300750.SZ": {
    stockCode: "300750.SZ",
    stockName: "宁德时代",
    overview:
      "宁德时代是全球动力电池龙头，市场份额连续六年全球第一。公司在三元锂和磷酸铁锂领域均保持技术领先，海外扩张加速，储能业务成为第二增长曲线。",
    coreView:
      "核心观点：动力电池行业竞争加剧，但宁王凭借技术迭代和规模优势仍保持领先。储能业务增速超预期，有望平滑动力电池周期波动。",
    technicalAnalysis:
      "技术面：股价跌破 MA60 支撑，短期趋势偏弱。MACD 死叉延续，成交量萎缩。RSI 位于 42 偏弱区域。关键支撑位 200 元，若跌破可能下探 185 元。",
    fundamentalAnalysis:
      "基本面：2024 年出货量预计增长 20%，但单位毛利承压。储能业务营收占比提升至 25%，毛利率高于动力电池。研发投入持续加大，固态电池进展顺利。",
    riskAnalysis:
      "风险因素：1) 动力电池价格战加剧；2) 二线厂商份额提升；3) 原材料价格波动；4) 海外政策风险（IRA 补贴限制）；5) 技术路线变更风险。",
    valuationAnalysis:
      "估值分析：当前 PE 22.1 倍，处于历史低位。PEG 约 1.1，估值与增速匹配。分部估值法：动力电池 15x PE + 储能 25x PE，综合目标价 245 元。",
    investmentAdvice:
      "投资建议：持有。短期业绩承压，但长期竞争力未改。建议现有持仓继续持有，新资金等待 200 元以下布局机会。",
    compositeScore: 68,
    keyPoints: [
      "全球动力电池龙头地位稳固",
      "储能业务成为第二增长曲线",
      "行业价格战压缩短期利润",
      "估值处于历史低位区间",
      "技术迭代能力保持领先",
    ],
  },
  "002594.SZ": {
    stockCode: "002594.SZ",
    stockName: "比亚迪",
    overview:
      "比亚迪是全球新能源汽车销量冠军，垂直整合能力行业最强。从电池、电机、电控到整车制造全产业链自研，成本控制能力突出，品牌向上战略初见成效。",
    coreView:
      "核心观点：比亚迪的规模效应正在释放，单车利润进入上升通道。高端化（仰望、方程豹）和出海是两大看点，有望复制丰田全球化路径。",
    technicalAnalysis:
      "技术面：股价突破前期整理平台，MA5/MA10/MA20 多头排列。MACD 红柱扩大，量价配合良好。RSI 65 接近强势区，短期或有震荡但不改上行趋势。",
    fundamentalAnalysis:
      "基本面：2024 年销量目标 360 万辆，同比增长 28%。单车净利润提升至 8500 元，高端车型占比提升。海外工厂投产，出口量有望翻倍。",
    riskAnalysis:
      "风险因素：1) 行业竞争白热化，价格战持续；2) 智能化水平相对落后；3) 海外贸易壁垒；4) 原材料成本波动；5) 产能利用率下滑。",
    valuationAnalysis:
      "估值分析：当前 PE 25.6 倍，对比特斯拉仍有折价。SOTP 估值：汽车业务 20x + 电池业务 18x + 电子业务 15x，综合目标价 310 元。",
    investmentAdvice:
      "投资建议：买入。目标价 310 元，对应上行空间 15.5%。新能源汽车渗透率仍在提升，比亚迪是最确定的受益者之一。",
    compositeScore: 78,
    keyPoints: [
      "全球新能源销量冠军",
      "垂直整合成本优势显著",
      "高端化和出海双轮驱动",
      "单车利润进入上升通道",
      "智能化补课进度需关注",
    ],
  },
  "00700.HK": {
    stockCode: "00700.HK",
    stockName: "腾讯控股",
    overview:
      "腾讯是中国互联网巨头，微信生态壁垒极高。游戏业务稳健，视频号商业化加速，云业务扭亏为盈，投资组合价值被市场低估。",
    coreView:
      "核心观点：腾讯正在经历业绩拐点，游戏版号常态化+视频号广告放量+云业务减亏，三重驱动下利润增速有望回升至 20%+。",
    technicalAnalysis:
      "技术面：股价在 380-400 元区间整固，MA60 走平。MACD 零轴附近纠缠，方向不明。RSI 52 中性。突破 400 元可打开上行空间，跌破 360 元需警惕。",
    fundamentalAnalysis:
      "基本面：2024 年游戏收入预计增长 8%，视频号广告收入突破 200 亿。云业务毛利率提升至 35%，实现盈亏平衡。降本增效成果显著，人均产出提升。",
    riskAnalysis:
      "风险因素：1) 游戏监管政策不确定性；2) 广告业务受宏观经济影响；3) 视频号竞争加剧；4) 投资组合市值波动；5) 大股东减持压力。",
    valuationAnalysis:
      "估值分析：当前 PE 18.3 倍，处于近十年低位。扣除投资组合后核心业务 PE 仅 14 倍，显著低估。SOTP 估值目标价 450 元。",
    investmentAdvice:
      "投资建议：买入。目标价 450 元，对应上行空间 15.9%。当前估值已充分反映悲观预期，安全边际充足。",
    compositeScore: 85,
    keyPoints: [
      "微信生态壁垒极高",
      "视频号商业化加速",
      "游戏版号常态化",
      "估值处于近十年低位",
      "投资组合价值被低估",
    ],
  },
  "09988.HK": {
    stockCode: "09988.HK",
    stockName: "阿里巴巴",
    overview:
      "阿里巴巴是中国电商和云计算龙头，近期完成组织架构重组。淘宝天猫用户回流，阿里云独立上市计划推进，国际业务增长强劲。",
    coreView:
      "核心观点：阿里正处于变革阵痛期，核心电商市场份额受挑战，但云计算和国际化提供新增长点。估值修复空间较大，但需时间验证改革成效。",
    technicalAnalysis:
      "技术面：股价处于下降通道，屡创阶段新低。MA60 压制明显，反弹乏力。MACD 绿柱缩短，有底背离迹象。RSI 38 偏弱，但尚未进入超卖。",
    fundamentalAnalysis:
      "基本面：2024 财年营收增长 8%，淘天集团 GMV 增速转正。阿里云收入增速回升至 12%，利润率改善。国际业务增速 25%，亏损收窄。",
    riskAnalysis:
      "风险因素：1) 电商市场份额持续流失；2) 云计算竞争加剧；3) 分拆上市不确定性；4) 地缘政治风险；5) 管理层变动影响战略执行。",
    valuationAnalysis:
      "估值分析：当前 PE 15.2 倍，处于历史最低区间。SOTP 估值：淘宝天猫 10x EV/EBITDA + 阿里云 25x PE + 国际业务 2x P/S，综合目标价 105 元。",
    investmentAdvice:
      "投资建议：观望。估值虽低但基本面拐点未现，建议等待财报确认复苏信号后再介入。现有持仓可持有，新资金暂不急于布局。",
    compositeScore: 55,
    keyPoints: [
      "电商市场份额受挑战",
      "云计算和国际化是新增长点",
      "估值处于历史最低区间",
      "改革成效有待验证",
      "适合价值投资者左侧布局",
    ],
  },
  "000333.SZ": {
    stockCode: "000333.SZ",
    stockName: "美的集团",
    overview:
      "美的集团是中国家电龙头，全球化布局领先。空调业务稳健，机器人业务（库卡）整合见效，ToB 业务转型加速，股息率吸引力提升。",
    coreView:
      "核心观点：美的作为稳健价值股，高股息+低估值提供防御属性。机器人业务是长期看点，但短期贡献有限。适合作为组合压舱石。",
    technicalAnalysis:
      "技术面：股价在 58-65 元区间震荡，MA60 提供支撑。MACD 金叉，量能温和。RSI 55 中性偏强。突破 65 元可上看 72 元，跌破 58 元需止损。",
    fundamentalAnalysis:
      "基本面：2024 年营收预计增长 10%，净利润率 9.5%。海外收入占比提升至 42%，OBM 占比提升。库卡订单增速 15%，整合效果显现。",
    riskAnalysis:
      "风险因素：1) 地产后周期需求疲软；2) 海外经济衰退影响出口；3) 原材料价格上涨；4) 汇率波动；5) 机器人业务整合不及预期。",
    valuationAnalysis:
      "估值分析：当前 PE 12.8 倍，股息率 3.5%，具备防御价值。DCF 目标价 72 元，对应 PE 14.5 倍。对比海外家电龙头，估值折价明显。",
    investmentAdvice:
      "投资建议：买入。目标价 72 元，对应上行空间 15.5%。高股息+低估值提供安全边际，适合稳健型投资者配置。",
    compositeScore: 72,
    keyPoints: [
      "家电龙头，全球化领先",
      "高股息率提供防御价值",
      "机器人业务长期看点",
      "估值处于历史低位",
      "适合作为组合压舱石",
    ],
  },
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const useResearchStore = create<ResearchState>()(
  persist(
    (set) => ({
      currentReport: null,
      isAnalyzing: false,
      analysisSteps: [],
      analyzeStock: async (code: string, name: string) => {
        set({
          isAnalyzing: true,
          currentReport: null,
          analysisSteps: defaultSteps.map((s) => ({
            ...s,
            status: "pending" as const,
          })),
        });

        const steps = [...defaultSteps];

        for (let i = 0; i < steps.length; i++) {
          steps[i] = { ...steps[i], status: "running" };
          set({ analysisSteps: [...steps] });
          await delay(800 + Math.random() * 600);
          steps[i] = { ...steps[i], status: "done" };
          set({ analysisSteps: [...steps] });
        }

        const mockData = mockReports[code];
        const report: ResearchReport = {
          stockCode: code,
          stockName: name,
          overview:
            mockData?.overview ??
            `${name}（${code}）是一家优质上市公司，具备良好的行业地位和成长潜力。`,
          coreView:
            mockData?.coreView ?? "公司基本面稳健，建议关注后续业绩表现。",
          technicalAnalysis:
            mockData?.technicalAnalysis ??
            "技术面中性，建议结合市场环境综合判断。",
          fundamentalAnalysis:
            mockData?.fundamentalAnalysis ?? "公司财务状况健康，盈利能力稳定。",
          riskAnalysis:
            mockData?.riskAnalysis ?? "需关注行业竞争和宏观经济波动风险。",
          valuationAnalysis:
            mockData?.valuationAnalysis ?? "当前估值处于合理区间。",
          investmentAdvice:
            mockData?.investmentAdvice ?? "建议观望，等待更明确的入场信号。",
          compositeScore: mockData?.compositeScore ?? 60,
          keyPoints: mockData?.keyPoints ?? [
            "基本面稳健",
            "估值合理",
            "关注行业动态",
          ],
          workflowSteps: steps,
          generatedAt: new Date().toISOString(),
        };

        set({ currentReport: report, isAnalyzing: false });
      },
      clearReport: () =>
        set({ currentReport: null, isAnalyzing: false, analysisSteps: [] }),
    }),
    {
      name: "finpilot-research",
      partialize: (state) => ({
        currentReport: state.currentReport,
      }),
    },
  ),
);
