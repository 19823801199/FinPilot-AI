import { create } from "zustand";
import type { ExerciseQuestion, SubmitResult } from "@/types/learning";

const mockQuestions: ExerciseQuestion[] = [
  // 货币金融学 - 货币与货币制度
  {
    id: "q-1-1",
    chapterId: "ch-1-1",
    type: "single_choice",
    question: "在货币的五大职能中，作为商品交换媒介的职能是？",
    options: ["价值尺度", "流通手段", "贮藏手段", "支付手段"],
    correctAnswer: "流通手段",
    explanation:
      "流通手段是货币在商品交换中充当媒介的职能，即货币充当商品交换的媒介。价值尺度是货币充当衡量商品价值大小的职能。",
    difficulty: "easy",
    knowledgePoint: "货币职能",
  },
  {
    id: "q-1-2",
    chapterId: "ch-1-1",
    type: "single_choice",
    question: "M1包括以下哪项？",
    options: [
      "现金+活期存款",
      "现金+定期存款",
      "现金+活期存款+定期存款",
      "现金+所有存款",
    ],
    correctAnswer: "现金+活期存款",
    explanation:
      "M1 = 流通中的现金（M0）+ 活期存款，是流动性最强的货币层次，反映现实购买力。",
    difficulty: "easy",
    knowledgePoint: "货币层次",
  },
  {
    id: "q-1-3",
    chapterId: "ch-1-1",
    type: "true_false",
    question: "电子货币已经完全取代了纸币的职能。",
    options: null,
    correctAnswer: "错误",
    explanation:
      "电子货币虽然发展迅速，但尚未完全取代纸币。纸币在匿名交易、小额支付和应急场景中仍有不可替代的作用。",
    difficulty: "easy",
    knowledgePoint: "电子货币",
  },
  // 货币金融学 - 信用与利率
  {
    id: "q-1-4",
    chapterId: "ch-1-2",
    type: "single_choice",
    question:
      "费雪方程式表述的是名义利率、实际利率与通货膨胀率之间的关系，其公式为？",
    options: ["i = r + π", "i = r × π", "i = r - π", "i = r / π"],
    correctAnswer: "i = r + π",
    explanation:
      "费雪方程式：名义利率(i) = 实际利率(r) + 预期通货膨胀率(π)。精确公式为 (1+i)=(1+r)(1+π)，近似即为 i ≈ r + π。",
    difficulty: "medium",
    knowledgePoint: "费雪方程",
  },
  {
    id: "q-1-5",
    chapterId: "ch-1-2",
    type: "single_choice",
    question: "利率期限结构理论中，预期假说认为长期利率取决于？",
    options: [
      "当前短期利率",
      "市场对未来短期利率的预期",
      "流动性溢价",
      "风险偏好",
    ],
    correctAnswer: "市场对未来短期利率的预期",
    explanation:
      "预期假说认为，长期利率等于未来各期预期短期利率的平均值。投资者对任何期限的债券没有偏好，收益率曲线的形状取决于市场对未来利率的预期。",
    difficulty: "medium",
    knowledgePoint: "利率期限结构",
  },
  {
    id: "q-1-6",
    chapterId: "ch-1-2",
    type: "multiple_choice",
    question: "以下哪些属于利率的决定因素？（多选）",
    options: [
      "平均利润率",
      "资金供求状况",
      "物价水平",
      "国际利率水平",
      "企业盈利能力",
    ],
    correctAnswer: "平均利润率,资金供求状况,物价水平,国际利率水平",
    explanation:
      "利率的决定因素包括：平均利润率（上限）、资金供求状况、物价水平（通胀预期）、国际利率水平、中央银行政策等。企业盈利能力不是直接决定因素。",
    difficulty: "medium",
    knowledgePoint: "利率决定",
  },
  // 货币金融学 - 货币供求
  {
    id: "q-1-7",
    chapterId: "ch-1-3",
    type: "single_choice",
    question: "凯恩斯的流动性偏好理论认为，人们持有货币的动机不包括？",
    options: ["交易动机", "预防动机", "投机动机", "投资动机"],
    correctAnswer: "投资动机",
    explanation:
      "凯恩斯认为人们持有货币的三种动机为：交易动机、预防动机和投机动机。投资动机不属于持有货币的动机。",
    difficulty: "medium",
    knowledgePoint: "凯恩斯货币需求",
  },
  {
    id: "q-1-8",
    chapterId: "ch-1-3",
    type: "calculation",
    question:
      "假设基础货币B=1000亿元，法定存款准备金率为10%，超额准备金率为2%，现金漏损率为5%，求货币乘数和货币供给量M1。",
    options: null,
    correctAnswer:
      "货币乘数m = 1/(10%+2%+5%) = 1/0.17 ≈ 5.88；M1 = 1000 × 5.88 = 5880亿元",
    explanation:
      "货币乘数 m = 1/(rd + re + c)，其中rd为法定准备金率，re为超额准备金率，c为现金漏损率。m = 1/(0.1+0.02+0.05) = 1/0.17 ≈ 5.88。M1 = B × m = 1000 × 5.88 = 5880亿元。",
    difficulty: "hard",
    knowledgePoint: "货币乘数",
  },
  // 货币金融学 - 通胀与货币政策
  {
    id: "q-1-9",
    chapterId: "ch-1-4",
    type: "single_choice",
    question: "菲利普斯曲线描述的是以下哪两个变量之间的关系？",
    options: [
      "经济增长率与失业率",
      "通货膨胀率与失业率",
      "利率与汇率",
      "货币供给量与物价水平",
    ],
    correctAnswer: "通货膨胀率与失业率",
    explanation:
      "菲利普斯曲线最初描述的是失业率与工资上涨率之间的交替关系，后被发展为描述通货膨胀率与失业率之间的此消彼长关系。",
    difficulty: "easy",
    knowledgePoint: "菲利普斯曲线",
  },
  {
    id: "q-1-10",
    chapterId: "ch-1-4",
    type: "single_choice",
    question: "以下哪项不是中国人民银行的货币政策工具？",
    options: ["公开市场操作", "存款准备金率", "再贴现率", "财政赤字"],
    correctAnswer: "财政赤字",
    explanation:
      "货币政策三大工具为：公开市场操作、存款准备金率、再贴现率。财政赤字属于财政政策范畴，不是央行的货币政策工具。",
    difficulty: "easy",
    knowledgePoint: "三大工具",
  },
  // 公司金融 - 财务报表分析
  {
    id: "q-2-1",
    chapterId: "ch-2-1",
    type: "single_choice",
    question: "杜邦分析法将ROE分解为三个驱动因素，正确的分解式是？",
    options: [
      "ROE = 利润率 × 资产周转率 × 权益乘数",
      "ROE = 毛利率 × 存货周转率 × 负债比率",
      "ROE = 净利率 × 应收账款周转率 × 权益乘数",
      "ROE = 营业利润率 × 资产周转率 × 债务比率",
    ],
    correctAnswer: "ROE = 利润率 × 资产周转率 × 权益乘数",
    explanation:
      "杜邦分析：ROE = 净利率(Net Profit Margin) × 资产周转率(Asset Turnover) × 权益乘数(Equity Multiplier)，即 ROE = (净利润/营业收入) × (营业收入/总资产) × (总资产/股东权益)。",
    difficulty: "medium",
    knowledgePoint: "杜邦分析",
  },
  {
    id: "q-2-2",
    chapterId: "ch-2-1",
    type: "single_choice",
    question: "流动比率一般认为合理的经验值是？",
    options: ["1:1", "2:1", "3:1", "0.5:1"],
    correctAnswer: "2:1",
    explanation:
      "流动比率 = 流动资产 / 流动负债，一般认为 2:1 是比较合理的比率，表明企业有足够的流动资产来覆盖流动负债。",
    difficulty: "easy",
    knowledgePoint: "财务比率分析",
  },
  // 公司金融 - 货币时间价值
  {
    id: "q-2-3",
    chapterId: "ch-2-2",
    type: "calculation",
    question:
      "某人现在存入银行10万元，年利率为6%，按复利计算，5年后本利和是多少？（保留两位小数）",
    options: null,
    correctAnswer: "FV = 100000 × (1+6%)^5 = 100000 × 1.3382 = 133,822.56元",
    explanation:
      "复利终值公式：FV = PV × (1+r)^n = 100000 × (1.06)^5 = 100000 × 1.3382 ≈ 133,822.56元。",
    difficulty: "easy",
    knowledgePoint: "现值终值",
  },
  {
    id: "q-2-4",
    chapterId: "ch-2-2",
    type: "single_choice",
    question: "关于年金，以下说法正确的是？",
    options: [
      "普通年金的现值大于即付年金的现值",
      "普通年金的终值等于即付年金的终值",
      "即付年金的现值等于普通年金现值乘以(1+r)",
      "永续年金没有现值",
    ],
    correctAnswer: "即付年金的现值等于普通年金现值乘以(1+r)",
    explanation:
      "即付年金（先付年金）的现值 = 普通年金现值 × (1+r)，因为即付年金的每笔支付都比普通年金提前一期，因此现值更大。永续年金有现值 = A/r。",
    difficulty: "medium",
    knowledgePoint: "年金计算",
  },
  // 公司金融 - 资本预算
  {
    id: "q-2-5",
    chapterId: "ch-2-3",
    type: "single_choice",
    question:
      "在进行互斥项目决策时，当NPV与IRR结论冲突时，应该以哪个指标为准？",
    options: ["IRR", "NPV", "回收期", "盈利指数"],
    correctAnswer: "NPV",
    explanation:
      "当NPV与IRR冲突时，应以NPV为准。因为NPV直接衡量项目创造的价值增量，而IRR在互斥项目中可能因规模差异或现金流时间分布不同而产生误导。",
    difficulty: "medium",
    knowledgePoint: "互斥项目",
  },
  {
    id: "q-2-6",
    chapterId: "ch-2-3",
    type: "true_false",
    question: "净现值(NPV)大于零的项目一定应该被接受。",
    options: null,
    correctAnswer: "正确",
    explanation:
      "NPV > 0 意味着项目能为股东创造价值，增加企业价值，因此应该被接受。这是资本预算决策的基本准则。",
    difficulty: "easy",
    knowledgePoint: "净现值法",
  },
  // 公司金融 - 资本结构
  {
    id: "q-2-7",
    chapterId: "ch-2-4",
    type: "single_choice",
    question: "在无税条件下，MM定理I（无税）认为企业价值与资本结构的关系是？",
    options: ["正相关", "负相关", "无关", "先正后负"],
    correctAnswer: "无关",
    explanation:
      "MM定理I（无税）认为，在无税、无破产成本等完美市场假设下，企业价值与资本结构无关。这是因为套利机制会消除不同资本结构之间的价值差异。",
    difficulty: "medium",
    knowledgePoint: "MM定理",
  },
  {
    id: "q-2-8",
    chapterId: "ch-2-4",
    type: "single_choice",
    question: "权衡理论认为最优资本结构是在以下哪两者之间权衡？",
    options: [
      "债务成本与权益成本",
      "利息税盾与财务困境成本",
      "经营风险与财务风险",
      "短期债务与长期债务",
    ],
    correctAnswer: "利息税盾与财务困境成本",
    explanation:
      "权衡理论认为，企业通过权衡债务的税盾收益与财务困境成本来确定最优资本结构。适度的债务可以利用税盾效应，但过多的债务会增加破产风险。",
    difficulty: "medium",
    knowledgePoint: "权衡理论",
  },
  // 投资学 - CAPM
  {
    id: "q-3-1",
    chapterId: "ch-3-2",
    type: "calculation",
    question:
      "已知无风险利率为4%，市场组合期望收益率为12%，某股票的Beta系数为1.5，根据CAPM计算该股票的期望收益率。",
    options: null,
    correctAnswer: "E(Ri) = 4% + 1.5 × (12% - 4%) = 4% + 12% = 16%",
    explanation:
      "CAPM公式：E(Ri) = Rf + βi × [E(Rm) - Rf] = 4% + 1.5 × (12% - 4%) = 4% + 1.5 × 8% = 4% + 12% = 16%。",
    difficulty: "medium",
    knowledgePoint: "CAPM公式",
  },
  {
    id: "q-3-2",
    chapterId: "ch-3-2",
    type: "single_choice",
    question: "Beta系数衡量的是？",
    options: ["总风险", "系统风险", "非系统风险", "特有风险"],
    correctAnswer: "系统风险",
    explanation:
      "Beta系数衡量的是证券收益率对市场收益率的敏感程度，即系统风险（市场风险）的大小。非系统风险可以通过分散化消除，不反映在Beta中。",
    difficulty: "easy",
    knowledgePoint: "Beta系数",
  },
  {
    id: "q-3-3",
    chapterId: "ch-3-4",
    type: "single_choice",
    question: "半强式有效市场假说认为当前股价反映了哪些信息？",
    options: [
      "仅历史价格信息",
      "所有公开信息",
      "所有公开和内幕信息",
      "仅基本面信息",
    ],
    correctAnswer: "所有公开信息",
    explanation:
      "EMH三种形式：弱式有效（反映历史价格）、半强式有效（反映所有公开信息）、强式有效（反映所有公开和内幕信息）。",
    difficulty: "medium",
    knowledgePoint: "半强式有效",
  },
  // 金融市场学
  {
    id: "q-4-1",
    chapterId: "ch-4-2",
    type: "single_choice",
    question: "债券价格与市场利率之间的关系是？",
    options: ["正相关", "负相关", "不相关", "不确定"],
    correctAnswer: "负相关",
    explanation:
      "债券价格与市场利率呈反比关系。当市场利率上升时，新发行的债券收益率更高，已发行的固定利率债券价格下降以匹配市场收益率。",
    difficulty: "easy",
    knowledgePoint: "债券定价",
  },
  {
    id: "q-4-2",
    chapterId: "ch-4-3",
    type: "single_choice",
    question: "看涨期权的买方在行权时获得的收益取决于？",
    options: [
      "标的资产市场价格低于执行价格",
      "标的资产市场价格高于执行价格",
      "标的资产市场价格等于执行价格",
      "标的资产价格波动率",
    ],
    correctAnswer: "标的资产市场价格高于执行价格",
    explanation:
      "看涨期权(Call Option)赋予买方以执行价格买入标的资产的权利。当标的资产市场价格高于执行价格时，买方行权可获得价差收益。",
    difficulty: "easy",
    knowledgePoint: "期权定价",
  },
  // 商业银行
  {
    id: "q-5-1",
    chapterId: "ch-5-3",
    type: "single_choice",
    question: "巴塞尔协议III要求核心一级资本充足率不低于？",
    options: ["4.5%", "6%", "8%", "10%"],
    correctAnswer: "4.5%",
    explanation:
      "巴塞尔协议III规定核心一级资本充足率(CET1)不低于4.5%，一级资本充足率不低于6%，总资本充足率不低于8%。此外还增加了资本缓冲要求。",
    difficulty: "medium",
    knowledgePoint: "巴塞尔协议",
  },
  // 431金融综合
  {
    id: "q-10-1",
    chapterId: "ch-10-2",
    type: "calculation",
    question:
      "某项目初始投资100万元，第1-3年每年现金流分别为40万元、50万元、60万元，折现率为10%，求NPV。（PVIF: 1年0.909, 2年0.826, 3年0.751）",
    options: null,
    correctAnswer:
      "NPV = -100 + 40×0.909 + 50×0.826 + 60×0.751 = -100 + 36.36 + 41.30 + 45.06 = 22.72万元",
    explanation:
      "NPV = -初始投资 + 各期现金流现值之和 = -100 + 40/(1.1)^1 + 50/(1.1)^2 + 60/(1.1)^3 = -100 + 36.36 + 41.30 + 45.06 = 22.72万元。NPV > 0，项目可行。",
    difficulty: "hard",
    knowledgePoint: "NPV法则",
  },
  {
    id: "q-10-2",
    chapterId: "ch-10-3",
    type: "short_answer",
    question: "简述CAPM模型的基本假设及其在投资决策中的应用。",
    options: null,
    correctAnswer:
      "CAPM假设：1.投资者是风险厌恶的；2.市场是完全竞争的；3.所有投资者具有相同的投资期限；4.无税收和交易成本；5.信息完全对称；6.可以无风险利率自由借贷。应用：用于计算股权资本成本、评估投资组合绩效、确定必要收益率。",
    explanation:
      "CAPM模型的核心假设构成了完美资本市场的基本框架，虽然现实中难以完全满足，但模型仍被广泛应用于资本成本估算和投资决策中。",
    difficulty: "hard",
    knowledgePoint: "CAPM",
  },
  {
    id: "q-10-3",
    chapterId: "ch-10-4",
    type: "single_choice",
    question: "在IS-LM模型中，IS曲线代表的是以下哪个市场的均衡？",
    options: ["货币市场", "商品市场", "劳动市场", "外汇市场"],
    correctAnswer: "商品市场",
    explanation:
      "IS曲线(Investment-Saving)代表商品市场均衡，即投资等于储蓄时利率与国民收入的组合。LM曲线(Liquidity-Money)代表货币市场均衡。",
    difficulty: "medium",
    knowledgePoint: "货币需求",
  },
  {
    id: "q-10-4",
    chapterId: "ch-10-5",
    type: "single_choice",
    question: "购买力平价理论(PPP)认为汇率是由什么决定的？",
    options: ["利率差异", "两国货币购买力之比", "国际收支差额", "黄金储备"],
    correctAnswer: "两国货币购买力之比",
    explanation:
      "购买力平价理论认为，两国货币的汇率等于两国物价水平之比，即汇率由两国货币的相对购买力决定。分为绝对PPP和相对PPP。",
    difficulty: "medium",
    knowledgePoint: "汇率理论",
  },
  // 国际金融
  {
    id: "q-8-1",
    chapterId: "ch-8-2",
    type: "single_choice",
    question: "利率平价理论认为，远期汇率与即期汇率之间的差额取决于？",
    options: [
      "两国通胀率之差",
      "两国利率之差",
      "两国GDP增长率之差",
      "两国贸易差额",
    ],
    correctAnswer: "两国利率之差",
    explanation:
      "利率平价理论(IRP)认为，远期汇率的升贴水等于两国利率之差。高利率国家的货币在远期市场上倾向于贬值，以抵消利率优势。",
    difficulty: "medium",
    knowledgePoint: "利率平价",
  },
  // 金融风险管理
  {
    id: "q-9-1",
    chapterId: "ch-9-3",
    type: "short_answer",
    question: "请简述VaR(Value at Risk)的三种主要计算方法及其优缺点。",
    options: null,
    correctAnswer:
      "1.历史模拟法：利用历史数据模拟未来收益分布。优点：简单直观，不需要假设分布。缺点：依赖历史数据，可能不反映极端情况。2.方差-协方差法：假设收益服从正态分布。优点：计算简便。缺点：低估尾部风险。3.蒙特卡洛模拟法：通过随机模拟生成大量情景。优点：灵活，可处理非线性。缺点：计算量大，模型风险。",
    explanation:
      "VaR的三种方法各有优劣，实践中常结合使用，并配合压力测试和回溯验证来提高风险度量的准确性。",
    difficulty: "hard",
    knowledgePoint: "VaR方法",
  },
  {
    id: "q-9-2",
    chapterId: "ch-9-2",
    type: "single_choice",
    question: "CDS（信用违约互换）的作用是？",
    options: ["转移信用风险", "转移市场风险", "转移操作风险", "转移汇率风险"],
    correctAnswer: "转移信用风险",
    explanation:
      "CDS是一种信用衍生品，买方支付保费，在参考实体发生信用事件（如违约）时获得补偿，本质上是对信用风险的转移和对冲工具。",
    difficulty: "medium",
    knowledgePoint: "CDS",
  },
  // 证券投资分析
  {
    id: "q-7-1",
    chapterId: "ch-7-3",
    type: "calculation",
    question:
      "某公司当前股价为50元，预期下一年每股股利为2元，股利增长率为5%，用DDM模型计算该股票的内在价值。",
    options: null,
    correctAnswer:
      "V = D1/(r-g)，假设必要收益率r=9%，则V = 2/(9%-5%) = 2/0.04 = 50元",
    explanation:
      "Gordon增长模型（DDM）：V = D1/(r-g)，其中D1为下期股利，r为必要收益率，g为永续增长率。当V=P时，股票被合理定价。",
    difficulty: "medium",
    knowledgePoint: "DDM模型",
  },
  {
    id: "q-7-2",
    chapterId: "ch-7-2",
    type: "single_choice",
    question: "MACD指标的DIF线是以下哪两条移动平均线的差值？",
    options: [
      "5日和10日均线",
      "12日和26日均线",
      "10日和20日均线",
      "20日和60日均线",
    ],
    correctAnswer: "12日和26日均线",
    explanation:
      "MACD中，DIF(差离值) = 12日EMA - 26日EMA。DEA是DIF的9日EMA。MACD柱状图 = 2×(DIF - DEA)。",
    difficulty: "easy",
    knowledgePoint: "MACD",
  },
  // 中央银行学
  {
    id: "q-6-1",
    chapterId: "ch-6-2",
    type: "single_choice",
    question: "中国人民银行提高法定存款准备金率，对货币供给的影响是？",
    options: ["增加", "减少", "不变", "不确定"],
    correctAnswer: "减少",
    explanation:
      "提高法定存款准备金率会降低货币乘数，商业银行可用于放贷的资金减少，从而收缩货币供给量。这是紧缩性货币政策工具之一。",
    difficulty: "easy",
    knowledgePoint: "存款准备金",
  },
  {
    id: "q-6-2",
    chapterId: "ch-6-3",
    type: "multiple_choice",
    question: "以下哪些属于宏观审慎政策工具？（多选）",
    options: [
      "资本缓冲要求",
      "逆周期资本缓冲",
      "LTV比率上限",
      "公开市场操作",
      "存款准备金率",
    ],
    correctAnswer: "资本缓冲要求,逆周期资本缓冲,LTV比率上限",
    explanation:
      "宏观审慎政策工具包括：资本缓冲要求、逆周期资本缓冲、LTV(贷款价值比)上限、流动性覆盖率等。公开市场操作和存款准备金率属于货币政策工具。",
    difficulty: "medium",
    knowledgePoint: "宏观审慎",
  },
];

export interface ExerciseState {
  questions: ExerciseQuestion[];
  currentQuestionIndex: number;
  userAnswers: Record<string, string>;
  results: SubmitResult[] | null;
  isSubmitting: boolean;
  showResults: boolean;
  setQuestions: (chapterId: string) => void;
  selectAnswer: (questionId: string, answer: string) => void;
  submitExercise: () => void;
  resetExercise: () => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
}

export const useExerciseStore = create<ExerciseState>()((set, get) => ({
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: {},
  results: null,
  isSubmitting: false,
  showResults: false,

  setQuestions: (chapterId: string) => {
    const filtered = mockQuestions.filter((q) => q.chapterId === chapterId);
    set({
      questions: filtered,
      currentQuestionIndex: 0,
      userAnswers: {},
      results: null,
      isSubmitting: false,
      showResults: false,
    });
  },

  selectAnswer: (questionId: string, answer: string) => {
    set((state) => ({
      userAnswers: { ...state.userAnswers, [questionId]: answer },
    }));
  },

  submitExercise: () => {
    set({ isSubmitting: true });
    const { questions, userAnswers } = get();

    const results: SubmitResult[] = questions.map((q) => {
      const userAnswer = userAnswers[q.id] || "未作答";
      let correct = false;

      if (q.type === "multiple_choice") {
        const userSet = new Set(
          userAnswer
            .split(",")
            .map((s) => s.trim())
            .sort(),
        );
        const correctSet = new Set(
          q.correctAnswer
            .split(",")
            .map((s) => s.trim())
            .sort(),
        );
        correct =
          userSet.size === correctSet.size &&
          [...userSet].every((v) => correctSet.has(v));
      } else {
        correct = userAnswer.trim() === q.correctAnswer.trim();
      }

      return {
        questionId: q.id,
        correct,
        userAnswer,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        knowledgePoint: q.knowledgePoint,
        score: correct ? 1 : 0,
      };
    });

    setTimeout(() => {
      set({ results, isSubmitting: false, showResults: true });
    }, 800);
  },

  resetExercise: () => {
    set({
      currentQuestionIndex: 0,
      userAnswers: {},
      results: null,
      isSubmitting: false,
      showResults: false,
    });
  },

  nextQuestion: () => {
    set((state) => ({
      currentQuestionIndex: Math.min(
        state.currentQuestionIndex + 1,
        state.questions.length - 1,
      ),
    }));
  },

  prevQuestion: () => {
    set((state) => ({
      currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
    }));
  },
}));
