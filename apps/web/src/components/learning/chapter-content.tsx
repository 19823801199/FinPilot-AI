"use client";

import { useLearningStore } from "@/store/learning-store";
import { useExerciseStore } from "@/store/exercise-store";
import { ExercisePanel } from "./exercise-panel";
import {
  ArrowLeft,
  ChevronRight,
  Play,
  Clock,
  BookOpen,
  Target,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { AIExplanation } from "@/types/learning";

const mockExplanations: Record<string, AIExplanation> = {
  货币职能: {
    knowledgePoint: "货币职能",
    definition:
      "货币在经济中发挥的基本功能，包括价值尺度、流通手段、贮藏手段、支付手段和世界货币五大职能。",
    detailedExplanation:
      "货币的五大职能是马克思主义货币理论的核心内容。价值尺度是货币充当衡量商品价值大小的尺度；流通手段是货币在商品交换中充当媒介；贮藏手段是货币退出流通领域被保存起来；支付手段是货币用于清偿债务或支付赋税等；世界货币是货币在国际市场上发挥职能。",
    examFocus: "选择题和名词解释的高频考点，重点区分流通手段与支付手段的区别。",
    commonQuestionTypes: ["选择题", "名词解释", "简答题"],
    classicExample:
      "例：用100元购买商品，货币执行的是流通手段职能；用100元偿还债务，货币执行的是支付手段职能。",
    memoryTips:
      "口诀：价流贮支世（价值尺度、流通手段、贮藏手段、支付手段、世界货币）",
    furtherReading: "《货币银行学》第三章 货币制度",
  },
  货币层次: {
    knowledgePoint: "货币层次",
    definition:
      "按流动性大小将货币划分为不同层次，M0、M1、M2是最主要的划分方式。",
    detailedExplanation:
      "M0 = 流通中的现金；M1 = M0 + 活期存款（狭义货币供应量）；M2 = M1 + 定期存款 + 储蓄存款 + 其他存款（广义货币供应量）。货币层次的划分有助于央行实施精准的货币政策。",
    examFocus: "重点考察M0、M1、M2的构成及各层次货币的经济意义。",
    commonQuestionTypes: ["选择题", "判断题", "简答题"],
    classicExample:
      "例：居民将活期存款转为定期存款，M1减少，M2不变。因为活期存款属于M1但不属于M2的增量部分。",
    memoryTips: "M0现金手中拿，M1加活期，M2再加定期和储蓄。",
    furtherReading: "《货币金融学》第二章 货币供给",
  },
  费雪方程: {
    knowledgePoint: "费雪方程",
    definition:
      "描述名义利率、实际利率与预期通货膨胀率之间关系的方程：i = r + π。",
    detailedExplanation:
      "费雪效应由经济学家欧文-费雪提出。精确公式为(1+i)=(1+r)(1+π)，近似为i ≈ r + π。该方程表明，当预期通胀上升时，名义利率也会随之上升，实际利率保持不变。",
    examFocus: "计算题常考，需掌握精确公式和近似公式的应用。",
    commonQuestionTypes: ["计算题", "选择题", "简答题"],
    classicExample:
      "例：若实际利率为3%，预期通胀率为5%，则名义利率 ≈ 3% + 5% = 8%。",
    memoryTips: "名义 = 实际 + 通胀，通胀吃掉购买力。",
    furtherReading: "《货币金融学》利率理论章节",
  },
  凯恩斯货币需求: {
    knowledgePoint: "凯恩斯货币需求",
    definition:
      "凯恩斯认为人们持有货币的三大动机：交易动机、预防动机和投机动机。",
    detailedExplanation:
      "交易动机：为日常交易需要而持有货币；预防动机：为应对意外支出而持有货币；投机动机：为在利率变动中获利而持有货币。其中投机动机是凯恩斯对货币需求理论的重要贡献，它解释了利率与货币需求之间的反向关系。",
    examFocus: "高频考点，常以选择题和简答题形式出现，注意区分三种动机。",
    commonQuestionTypes: ["选择题", "简答题", "论述题"],
    classicExample:
      "例：利率上升时，人们预期利率将下降（债券价格上升），因此减少投机性货币需求，增加债券持有。",
    memoryTips: "交预投——交易、预防、投机，投机与利率反相关。",
    furtherReading: "《货币金融学》货币需求理论章节",
  },
  货币乘数: {
    knowledgePoint: "货币乘数",
    definition:
      "货币乘数表示基础货币通过银行体系的信用创造活动放大为货币供给的倍数。",
    detailedExplanation:
      "货币乘数 m = 1/(rd + re + c)，其中rd为法定准备金率，re为超额准备金率，c为现金漏损率。货币供给 M = B × m，其中B为基础货币。央行通过调节法定准备金率来影响货币乘数，进而控制货币供给。",
    examFocus: "计算题必考，务必记住公式中各参数的含义及相互关系。",
    commonQuestionTypes: ["计算题", "选择题", "简答题"],
    classicExample:
      "例：rd=10%, re=2%, c=5%，则 m = 1/(0.1+0.02+0.05) = 1/0.17 ≈ 5.88。注意不要漏掉超额准备金率。",
    memoryTips: "乘数 = 1 / (法定 + 超额 + 漏损)，漏出越多乘数越小。",
    furtherReading: "《货币金融学》货币供给机制章节",
  },
  杜邦分析: {
    knowledgePoint: "杜邦分析",
    definition:
      "将ROE分解为净利率、资产周转率和权益乘数的乘积，用于分析企业盈利能力的驱动因素。",
    detailedExplanation:
      "ROE = 净利率 × 资产周转率 × 权益乘数 = (净利润/营业收入) × (营业收入/总资产) × (总资产/股东权益)。杜邦分析帮助投资者理解ROE变化的原因：是利润率提升、运营效率改善还是杠杆增加。",
    examFocus: "计算题和简答题常考，需掌握三因素分解及其经济含义。",
    commonQuestionTypes: ["计算题", "简答题", "案例分析"],
    classicExample:
      "例：某公司净利率5%，资产周转率2，权益乘数3，则ROE = 5% × 2 × 3 = 30%。",
    memoryTips: "ROE = 利润率 × 周转率 × 杠杆，三管齐下提升回报。",
    furtherReading: "《公司金融》财务分析章节",
  },
  MM定理: {
    knowledgePoint: "MM定理",
    definition:
      "Modigliani-Miller定理，探讨在完美资本市场条件下资本结构与企业价值的关系。",
    detailedExplanation:
      "MM定理I（无税）：企业价值与资本结构无关；MM定理I（有税）：企业价值随债务增加而增加（税盾效应）；MM定理II（无税）：权益资本成本随杠杆增加而线性上升；MM定理II（有税）：加权平均资本成本随杠杆增加而下降。",
    examFocus: "核心考点，务必区分有税和无税两种条件下的结论差异。",
    commonQuestionTypes: ["选择题", "简答题", "论述题"],
    classicExample:
      "例：无税条件下，WACC不随杠杆变化；有税条件下，WACC随杠杆增加而下降，因为有税盾收益。",
    memoryTips: "无税无关，有税有关（税盾）。无税WACC不变，有税WACC下降。",
    furtherReading: "《公司金融》资本结构理论章节",
  },
  CAPM公式: {
    knowledgePoint: "CAPM公式",
    definition:
      "资本资产定价模型：E(Ri) = Rf + βi × [E(Rm) - Rf]，描述风险与期望收益的线性关系。",
    detailedExplanation:
      "CAPM由Sharpe(1964)、Lintner(1965)和Mossin(1966)独立提出。模型假设投资者是风险厌恶的，市场是完全的。证券的期望收益由无风险利率和风险溢价两部分组成，风险溢价等于Beta乘以市场风险溢价。",
    examFocus: "必考计算题，需熟练运用公式计算期望收益率和Beta系数。",
    commonQuestionTypes: ["计算题", "选择题", "简答题"],
    classicExample:
      "例：Rf=4%, E(Rm)=12%, β=1.5，则E(Ri) = 4% + 1.5 × 8% = 16%。",
    memoryTips: "期望收益 = 无风险 + Beta × 市场溢价，Beta大则风险大收益高。",
    furtherReading: "《投资学》CAPM章节",
  },
  NPV法则: {
    knowledgePoint: "NPV法则",
    definition:
      "净现值法则：如果项目的NPV > 0，则接受该项目；NPV < 0，则拒绝。",
    detailedExplanation:
      "NPV = -C0 + Σ(Ct / (1+r)^t)，即项目未来现金流的现值之和减去初始投资。NPV直接衡量项目创造的价值增量，是资本预算中最可靠的决策准则。当互斥项目NPV与IRR冲突时，以NPV为准。",
    examFocus: "计算题核心考点，务必掌握折现计算和NPV决策规则。",
    commonQuestionTypes: ["计算题", "选择题", "判断题"],
    classicExample:
      "例：初始投资100万，3年现金流40/50/60万，r=10%，NPV = -100 + 36.36 + 41.30 + 45.06 = 22.72万 > 0，接受。",
    memoryTips: "NPV大于零就接受，NPV最大选最优。注意：必须折现！",
    furtherReading: "《公司金融》资本预算章节",
  },
  Beta系数: {
    knowledgePoint: "Beta系数",
    definition: "衡量证券收益率对市场收益率敏感程度的指标，反映系统风险大小。",
    detailedExplanation:
      "Beta = Cov(Ri, Rm) / Var(Rm)。Beta=1表示与市场同步波动；Beta>1表示比市场更敏感（进攻型）；Beta<1表示比市场不敏感（防守型）；Beta<0表示与市场反向变动。Beta只衡量系统风险，不反映非系统风险。",
    examFocus: "选择题和计算题常考，需理解Beta的经济含义和计算方法。",
    commonQuestionTypes: ["选择题", "计算题", "简答题"],
    classicExample:
      "例：某股票Beta=1.5，市场上涨10%时，该股票预期上涨15%；市场下跌10%时，预期下跌15%。",
    memoryTips: "Beta=1同步，>1激进，<1保守，<0反向。只量系统风险。",
    furtherReading: "《投资学》CAPM章节",
  },
  VaR方法: {
    knowledgePoint: "VaR方法",
    definition:
      "Value at Risk，在给定置信水平和时间区间下，投资组合可能遭受的最大损失。",
    detailedExplanation:
      "VaR的三种计算方法：1.历史模拟法——利用历史数据直接模拟；2.方差-协方差法——假设正态分布，计算简便但低估尾部风险；3.蒙特卡洛模拟法——随机生成大量情景，灵活但计算量大。VaR的局限性：不反映尾部极端风险、依赖历史数据、模型风险。",
    examFocus: "简答题和论述题常考，需掌握三种方法的优缺点比较。",
    commonQuestionTypes: ["简答题", "论述题", "选择题"],
    classicExample:
      "例：95%置信度下的日VaR=100万，意味着有95%的概率日损失不超过100万，即5%的概率损失超过100万。",
    memoryTips:
      "历史模拟看过去，方差协方差靠假设，蒙特卡洛随机跑。VaR只管大概率，不管极端尾部。",
    furtherReading: "《金融风险管理》市场风险度量章节",
  },
  巴塞尔协议: {
    knowledgePoint: "巴塞尔协议",
    definition:
      "国际银行业监管标准，规定银行资本充足率要求，以保障银行体系稳健运行。",
    detailedExplanation:
      "巴塞尔协议III核心要求：核心一级资本充足率(CET1) ≥ 4.5%；一级资本充足率 ≥ 6%；总资本充足率 ≥ 8%；此外还有2.5%的资本缓冲要求。引入了杠杆率、流动性覆盖率(LCR)和净稳定资金比率(NSFR)等新指标。",
    examFocus: "选择题和简答题常考，重点记忆各资本充足率的数值要求。",
    commonQuestionTypes: ["选择题", "简答题", "论述题"],
    classicExample:
      "例：某银行风险加权资产1000亿，核心一级资本50亿，则CET1 = 50/1000 = 5% > 4.5%，达标。",
    memoryTips: "CET1=4.5%, 一级=6%, 总=8%, 缓冲=2.5%。",
    furtherReading: "《商业银行经营学》银行监管章节",
  },
};

interface ChapterContentProps {
  onBack: () => void;
  onStartExercise: () => void;
}

export function ChapterContent({
  onBack,
  onStartExercise,
}: ChapterContentProps) {
  const { selectedCourse, selectedChapter, chapters, selectChapter } =
    useLearningStore();
  const { questions, setQuestions, showResults } = useExerciseStore();
  const [activeKnowledgePoint, setActiveKnowledgePoint] = useState<
    string | null
  >(null);

  if (!selectedCourse) return null;

  const courseChapters = chapters.filter(
    (ch) => ch.courseId === selectedCourse.id,
  );

  const handleStartExercise = (chapterId: string) => {
    setQuestions(chapterId);
    onStartExercise();
  };

  // If exercise is active and has questions, show exercise panel
  if (questions.length > 0 && !showResults) {
    return <ExercisePanel />;
  }

  // If showing results
  if (showResults) {
    return <ExercisePanel />;
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-rule px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-surface2"
          >
            <ArrowLeft className="h-4 w-4 text-muted" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-ink">
              {selectedCourse.name}
            </h2>
            <p className="text-xs text-muted">{selectedCourse.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <Clock className="h-3.5 w-3.5" />
          <span>预计 {selectedCourse.estimatedHours} 小时</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chapter List */}
        <div className="w-[280px] shrink-0 overflow-y-auto border-r border-rule p-4">
          <h3 className="mb-3 text-sm font-semibold text-ink">章节目录</h3>
          <div className="flex flex-col gap-1">
            {courseChapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => {
                  selectChapter(chapter);
                  setActiveKnowledgePoint(null);
                }}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all",
                  selectedChapter?.id === chapter.id
                    ? "bg-accent/10 text-accent"
                    : "text-ink hover:bg-surface2",
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold",
                    selectedChapter?.id === chapter.id
                      ? "bg-accent text-bg"
                      : "bg-surface2 text-muted",
                  )}
                >
                  {chapter.index}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {chapter.title}
                  </p>
                  <p className="text-xs text-muted">
                    {chapter.questionCount} 题 / {chapter.estimatedMinutes}min
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {selectedChapter ? (
            <div className="p-6">
              {/* Chapter Title */}
              <div className="mb-6">
                <div className="mb-2 flex items-center gap-2 text-xs text-muted">
                  <span>{selectedCourse.name}</span>
                  <ChevronRight className="h-3 w-3" />
                  <span>第 {selectedChapter.index} 章</span>
                </div>
                <h2 className="text-xl font-bold text-ink">
                  {selectedChapter.title}
                </h2>
                <p className="mt-2 text-sm text-muted">
                  {selectedChapter.description}
                </p>
              </div>

              {/* Key Points */}
              <div className="mb-6">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
                  <Target className="h-4 w-4 text-accent" />
                  核心知识点
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedChapter.keyPoints.map((point) => (
                    <button
                      key={point}
                      onClick={() =>
                        setActiveKnowledgePoint(
                          activeKnowledgePoint === point ? null : point,
                        )
                      }
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-sm transition-all",
                        activeKnowledgePoint === point
                          ? "border-accent/50 bg-accent/10 text-accent"
                          : "border-rule bg-surface text-muted hover:border-accent/30 hover:text-ink",
                      )}
                    >
                      {point}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Explanation Panel */}
              {activeKnowledgePoint &&
                mockExplanations[activeKnowledgePoint] && (
                  <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-accent" />
                      <h3 className="text-sm font-semibold text-accent">
                        AI 讲解 — {activeKnowledgePoint}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="mb-1 text-xs font-semibold text-accent2">
                          定义
                        </h4>
                        <p className="text-sm text-ink">
                          {mockExplanations[activeKnowledgePoint].definition}
                        </p>
                      </div>
                      <div>
                        <h4 className="mb-1 text-xs font-semibold text-accent2">
                          详细解释
                        </h4>
                        <p className="text-sm leading-relaxed text-ink">
                          {
                            mockExplanations[activeKnowledgePoint]
                              .detailedExplanation
                          }
                        </p>
                      </div>
                      <div>
                        <h4 className="mb-1 text-xs font-semibold text-accent3">
                          考试重点
                        </h4>
                        <p className="text-sm text-ink">
                          {mockExplanations[activeKnowledgePoint].examFocus}
                        </p>
                      </div>
                      <div>
                        <h4 className="mb-1 text-xs font-semibold text-accent3">
                          常见题型
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {mockExplanations[
                            activeKnowledgePoint
                          ].commonQuestionTypes.map((t) => (
                            <span
                              key={t}
                              className="rounded bg-accent3/10 px-2 py-0.5 text-xs text-accent3"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="mb-1 text-xs font-semibold text-accent2">
                          经典例题
                        </h4>
                        <p className="rounded-lg bg-surface p-3 text-sm text-ink">
                          {
                            mockExplanations[activeKnowledgePoint]
                              .classicExample
                          }
                        </p>
                      </div>
                      <div>
                        <h4 className="mb-1 text-xs font-semibold text-accent2">
                          记忆技巧
                        </h4>
                        <p className="text-sm text-ink">
                          {mockExplanations[activeKnowledgePoint].memoryTips}
                        </p>
                      </div>
                      <div>
                        <h4 className="mb-1 text-xs font-semibold text-muted">
                          延伸阅读
                        </h4>
                        <p className="text-sm text-muted">
                          {
                            mockExplanations[activeKnowledgePoint]
                              .furtherReading
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {/* Start Exercise Button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleStartExercise(selectedChapter.id)}
                  className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
                >
                  <Play className="h-4 w-4" />
                  开始练习
                </button>
                <span className="text-xs text-muted">
                  共 {selectedChapter.questionCount} 道题
                </span>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <BookOpen className="mb-4 h-12 w-12 text-muted" />
              <p className="text-lg font-medium text-ink">
                选择一个章节开始学习
              </p>
              <p className="mt-1 text-sm text-muted">
                点击左侧章节目录查看详细内容
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
