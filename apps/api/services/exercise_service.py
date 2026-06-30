# -*- coding: utf-8 -*-
"""FinPilot AI API - Mock 题库服务模块"""

import random
import uuid
from typing import List, Optional

from schemas.learning import (
    ExerciseQuestion,
    ExerciseResponse,
    SubmitResult,
)


# ---------- Mock 题库数据（30+ 道金融专业考题） ----------

MOCK_QUESTIONS: List[dict] = [
    # ===== 货币金融学 - 货币与货币制度 =====
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",  # 运行时填充
        "type": "single_choice",
        "question": "在现代货币体系中，M1通常包括()。",
        "options": ["现金+活期存款", "现金+定期存款", "现金+活期存款+定期存款", "现金+储蓄存款"],
        "correct_answer": "A",
        "explanation": "M1 = 流通中的现金(M0) + 活期存款。M1反映经济中的现实购买力，是货币政策的重要中介指标。",
        "difficulty": "easy",
        "knowledge_point": "货币层次的划分(M0/M1/M2)",
    },
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "single_choice",
        "question": "在货币职能中，货币充当商品交换媒介的职能被称为()。",
        "options": ["价值尺度", "流通手段", "贮藏手段", "支付手段"],
        "correct_answer": "B",
        "explanation": "流通手段是货币在商品交换中充当媒介的职能。货币执行流通手段时必须是现实的货币，但可以是不足值的。",
        "difficulty": "easy",
        "knowledge_point": "货币的职能与本质",
    },
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "true_false",
        "question": "电子货币的出现完全取代了传统货币的职能。",
        "options": None,
        "correct_answer": "错误",
        "explanation": "电子货币虽然改变了货币的存在形式和流通方式，但并未完全取代传统货币。电子货币本质上仍是信用货币的一种表现形式，其基本职能（价值尺度、流通手段等）与传统货币一致。",
        "difficulty": "easy",
        "knowledge_point": "信用货币与电子货币",
    },
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "short_answer",
        "question": "简述货币制度的基本构成要素。",
        "options": None,
        "correct_answer": "货币制度的基本构成要素包括：(1)货币材料的确定；(2)货币单位的确定（名称与含金量）；(3)流通中货币种类的确定（本位币与辅币）；(4)对货币铸造发行流通的管理；(5)准备金制度。",
        "explanation": "货币制度是指一个国家以法律形式规定的货币流通的组织形式，上述五大要素构成完整的货币制度框架。",
        "difficulty": "medium",
        "knowledge_point": "货币制度的演变历程",
    },
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "multiple_choice",
        "question": "下列属于准货币的有()。",
        "options": ["定期存款", "储蓄存款", "活期存款", "外汇存款", "国库券"],
        "correct_answer": "ABD",
        "explanation": "准货币(M2-M1)包括定期存款、储蓄存款、外汇存款及其他短期信用工具。活期存款属于M1，国库券不是存款类资产。",
        "difficulty": "medium",
        "knowledge_point": "货币层次的划分(M0/M1/M2)",
    },
    # ===== 货币金融学 - 信用与利率 =====
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "single_choice",
        "question": "根据费雪方程，若名义利率为8%，通货膨胀率为3%，则实际利率约为()。",
        "options": ["5%", "4.85%", "11%", "3%"],
        "correct_answer": "B",
        "explanation": "费雪方程：(1+名义利率)=(1+实际利率)×(1+通胀率)。实际利率=(1.08/1.03)-1≈4.85%。近似公式：实际利率≈名义利率-通胀率=5%，但精确计算为4.85%。",
        "difficulty": "medium",
        "knowledge_point": "名义利率与实际利率的费雪关系",
    },
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "single_choice",
        "question": "流动性偏好理论认为利率的决定因素是()。",
        "options": ["储蓄与投资", "货币供给与货币需求", "可贷资金的供给与需求", "借贷双方的议价能力"],
        "correct_answer": "B",
        "explanation": "凯恩斯的流动性偏好理论认为利率由货币供给与货币需求决定。货币供给是外生变量（由央行决定），货币需求取决于人们的流动性偏好（交易、预防、投机三大动机）。",
        "difficulty": "medium",
        "knowledge_point": "利率决定理论(古典/流动性偏好/可贷资金)",
    },
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "short_answer",
        "question": "简述利率期限结构的三种主要理论。",
        "options": None,
        "correct_answer": "(1)预期假说：长期利率等于预期未来各期短期利率的几何平均数；(2)市场分割理论：不同期限的债券市场是完全分割的，利率由各自市场的供求决定；(3)优先偏好理论(流动性溢价理论)：综合了前两者，认为长期利率等于预期短期利率的平均加上流动性溢价。",
        "explanation": "三种理论从不同角度解释了收益率曲线的形状。预期假说强调预期，分割理论强调市场结构，优先偏好理论是两者的折中。",
        "difficulty": "hard",
        "knowledge_point": "利率的期限结构(预期假说/分割市场/优先偏好)",
    },
    # ===== 货币金融学 - 金融市场 =====
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "single_choice",
        "question": "下列金融工具中，属于衍生金融工具的是()。",
        "options": ["股票", "国库券", "期权合约", "商业票据"],
        "correct_answer": "C",
        "explanation": "期权合约是衍生金融工具，其价值依赖于标的资产的价格。股票和国库券是基础证券，商业票据是货币市场工具。",
        "difficulty": "easy",
        "knowledge_point": "金融衍生品基础(远期/期货/期权/互换)",
    },
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "single_choice",
        "question": "回购协议(RP)实质上是一种()。",
        "options": ["商业贷款", "抵押贷款", "证券买卖行为", "消费信贷"],
        "correct_answer": "B",
        "explanation": "回购协议是证券出售时约定未来按约定价格买回的协议，实质上是以证券为抵押的短期融资行为，属于抵押贷款性质。",
        "difficulty": "medium",
        "knowledge_point": "货币市场工具(商业票据/国库券/回购协议)",
    },
    # ===== 货币金融学 - 货币政策 =====
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "single_choice",
        "question": "下列货币政策工具中，属于数量型工具的是()。",
        "options": ["再贴现率", "公开市场操作", "法定存款准备金率", "窗口指导"],
        "correct_answer": "C",
        "explanation": "法定存款准备金率通过改变货币乘数来影响货币供应量，属于数量型工具。再贴现率和公开市场操作兼具价格型和数量型特征，窗口指导是行政性工具。",
        "difficulty": "medium",
        "knowledge_point": "三大传统货币政策工具",
    },
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "calculation",
        "question": "若原始存款为1000万元，法定存款准备金率为10%，不考虑现金漏损和超额准备金，求存款乘数和派生存款总额。",
        "options": None,
        "correct_answer": "存款乘数 m = 1/rd = 1/0.1 = 10。派生存款总额 = 原始存款 × (m-1) = 1000 × 9 = 9000万元。存款总额 = 1000 × 10 = 10000万元。",
        "explanation": "在简单存款乘数模型下，m=1/rd。考虑现金漏损率和超额准备金率后，m=1/(rd+e+c)，乘数会变小。",
        "difficulty": "medium",
        "knowledge_point": "货币政策传导机制(利率/信用/资产价格渠道)",
    },
    # ===== 公司金融 - 货币时间价值与估值 =====
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "calculation",
        "question": "某公司发行面值1000元、票面利率8%、期限5年的附息债券，每年付息一次。若市场利率为6%，求该债券的发行价格。",
        "options": None,
        "correct_answer": "债券价格 = 80×(P/A,6%,5) + 1000×(P/F,6%,5) = 80×4.2124 + 1000×0.7473 = 336.99 + 747.30 = 1084.29元。由于票面利率>市场利率，债券溢价发行。",
        "explanation": "当票面利率>市场利率时，债券溢价发行；当票面利率<市场利率时，折价发行；两者相等时，平价发行。",
        "difficulty": "medium",
        "knowledge_point": "债券定价(附息/零息/到期收益率)",
    },
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "calculation",
        "question": "某股票当前股利为2元/股，预计股利年增长率为5%，投资者要求的必要收益率为12%，用戈登增长模型求该股票的内在价值。",
        "options": None,
        "correct_answer": "V = D1 / (r-g) = D0×(1+g) / (r-g) = 2×(1+0.05) / (0.12-0.05) = 2.1 / 0.07 = 30元。",
        "explanation": "戈登增长模型(DDM)适用于股利稳定增长的永续股票估值。注意使用下一期股利D1=D0(1+g)，且要求r>g。",
        "difficulty": "medium",
        "knowledge_point": "股票估值(DDM/DCF/相对估值)",
    },
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "single_choice",
        "question": "净现值(NPV)法的决策准则是()。",
        "options": ["NPV > 0则接受项目", "NPV > 1则接受项目", "NPV = 0则接受项目", "NPV < 0则接受项目"],
        "correct_answer": "A",
        "explanation": "NPV>0表示项目创造的价值超过资本成本，应接受；NPV<0表示项目价值低于资本成本，应拒绝；NPV=0时项目刚好达到必要收益率。",
        "difficulty": "easy",
        "knowledge_point": "NPV/IRR/PI/回收期法",
    },
    # ===== 公司金融 - 资本结构 =====
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "single_choice",
        "question": "根据MM理论(无税)，在完美资本市场中，企业价值()。",
        "options": ["随负债增加而增加", "随负债增加而减少", "与资本结构无关", "在负债率为50%时最大"],
        "correct_answer": "C",
        "explanation": "MM无税定理(命题I)指出：在完美资本市场假设下，企业价值与资本结构无关，仅取决于其资产的盈利能力。",
        "difficulty": "medium",
        "knowledge_point": "MM无税/有税定理",
    },
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "single_choice",
        "question": "优序融资理论(Pecking Order Theory)认为企业融资的优先顺序是()。",
        "options": ["股票>债券>内部融资", "内部融资>债券>股票", "债券>内部融资>股票", "股票>内部融资>债券"],
        "correct_answer": "B",
        "explanation": "优序融资理论认为，由于信息不对称导致的融资成本差异，企业优先使用内部留存收益，其次是债务融资，最后才是发行新股。",
        "difficulty": "medium",
        "knowledge_point": "优序融资理论",
    },
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "short_answer",
        "question": "简述权衡理论(Trade-off Theory)的核心观点。",
        "options": None,
        "correct_answer": "权衡理论认为企业存在最优资本结构。负债的税盾利益(利息抵税)与财务困境成本(破产成本、代理成本等)之间存在权衡。当边际税盾利益等于边际财务困境成本时，企业价值达到最大，此时的负债率为最优资本结构。",
        "explanation": "权衡理论是对MM有税定理的扩展，引入了财务困境成本这一现实因素，使理论更接近实际。",
        "difficulty": "hard",
        "knowledge_point": "权衡理论与财务困境成本",
    },
    # ===== 投资学 - CAPM =====
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "calculation",
        "question": "已知无风险利率为4%，市场组合预期收益率为12%，某股票的Beta系数为1.5。根据CAPM，该股票的预期收益率是多少？",
        "options": None,
        "correct_answer": "E(Ri) = Rf + βi×[E(Rm)-Rf] = 4% + 1.5×(12%-4%) = 4% + 12% = 16%。",
        "explanation": "CAPM表明资产的预期收益率等于无风险利率加上风险溢价。Beta>1表示该股票是进攻型股票，承担高于市场平均的系统风险。",
        "difficulty": "easy",
        "knowledge_point": "CAPM假设与推导",
    },
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "single_choice",
        "question": "在CAPM中，Beta系数衡量的是()。",
        "options": ["总风险", "系统性风险", "非系统性风险", "流动性风险"],
        "correct_answer": "B",
        "explanation": "Beta系数衡量的是资产收益率相对于市场收益率的敏感程度，即系统性风险(市场风险)的大小。非系统性风险可以通过分散化消除，不获得风险补偿。",
        "difficulty": "easy",
        "knowledge_point": "Beta系数计算与经济含义",
    },
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "true_false",
        "question": "根据有效市场假说，在半强式有效市场中，基本面分析可以获得超额收益。",
        "options": None,
        "correct_answer": "错误",
        "explanation": "在半强式有效市场中，所有公开信息(包括财务报表、宏观经济数据等)都已反映在价格中。基本面分析利用的正是公开信息，因此无法获得超额收益。",
        "difficulty": "medium",
        "knowledge_point": "弱式/半强式/强式有效市场",
    },
    # ===== 投资学 - 固定收益证券 =====
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "calculation",
        "question": "某债券面值1000元，票面利率6%，剩余期限3年，每年付息一次，当前市场价格为950元。求该债券的到期收益率(YTM)和麦考利久期。",
        "options": None,
        "correct_answer": "YTM通过试算：950 = 60/(1+r) + 60/(1+r)^2 + 1060/(1+r)^3，解得r≈7.84%。麦考利久期D = [1×60/1.0784 + 2×60/1.0784^2 + 3×1060/1.0784^3] / 950 ≈ 2.82年。",
        "explanation": "到期收益率是使债券未来现金流现值等于当前价格的折现率。麦考利久期是债券各现金流回收时间的加权平均值，权重为各现金流的现值占比。",
        "difficulty": "hard",
        "knowledge_point": "麦考利久期与修正久期",
    },
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "single_choice",
        "question": "关于久期，下列说法正确的是()。",
        "options": ["久期越长，债券价格对利率变动越敏感", "零息债券的久期等于其期限", "票面利率越高，久期越长", "以上说法只有A和B正确"],
        "correct_answer": "D",
        "explanation": "久期越长，利率敏感性越大（A正确）；零息债券久期=期限（B正确）；票面利率越高，久期越短（C错误，因为高票息意味着前期回收更多现金流，加权平均时间变短）。",
        "difficulty": "medium",
        "knowledge_point": "麦考利久期与修正久期",
    },
    # ===== 国际金融 =====
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "single_choice",
        "question": "根据购买力平价(PPP)理论，若A国通胀率为10%，B国通胀率为4%，则A国货币相对于B国货币将()。",
        "options": ["升值6%", "贬值6%", "升值10%", "贬值4%"],
        "correct_answer": "B",
        "explanation": "相对购买力平价：汇率变动率 = 通胀率差 = 10%-4% = 6%。A国通胀更高，其货币购买力下降更快，因此贬值约6%。",
        "difficulty": "medium",
        "knowledge_point": "购买力平价(绝对/相对)",
    },
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "single_choice",
        "question": "在布雷顿森林体系下，国际货币体系的核心特征是()。",
        "options": ["浮动汇率制", "黄金-美元双挂钩", "多元储备货币体系", "纯粹的金本位制"],
        "correct_answer": "B",
        "explanation": "布雷顿森林体系(1944-1973)实行美元与黄金挂钩(35美元/盎司)、各国货币与美元挂钩的双挂钩制度，属于可调整的固定汇率制。",
        "difficulty": "easy",
        "knowledge_point": "布雷顿森林体系的双挂钩",
    },
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "short_answer",
        "question": "简述国际收支失衡的弹性分析法的基本内容。",
        "options": None,
        "correct_answer": "弹性分析法(马歇尔-勒纳条件)研究汇率贬值对贸易收支的影响。核心结论：只有当出口需求弹性与进口需求弹性之和大于1时(即满足马歇尔-勒纳条件)，本币贬值才能改善贸易收支。此外，还存在J曲线效应，即贬值初期贸易收支可能先恶化后改善。",
        "explanation": "弹性分析法是国际收支调节的重要理论之一，强调汇率政策的有效性取决于进出口需求弹性。",
        "difficulty": "hard",
        "knowledge_point": "弹性分析法/吸收分析法/货币分析法",
    },
    # ===== 金融风险管理 =====
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "single_choice",
        "question": "VaR(Value at Risk)的含义是在给定的置信水平和持有期下，投资组合的()。",
        "options": ["最大收益", "最大损失", "预期损失", "平均损失"],
        "correct_answer": "B",
        "explanation": "VaR衡量在给定置信水平和持有期下，投资组合面临的最大可能损失。例如，95%置信水平下的日VaR为100万，意味着有95%的概率日损失不超过100万。",
        "difficulty": "easy",
        "knowledge_point": "VaR计算(历史模拟/参数法/蒙特卡洛)",
    },
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "single_choice",
        "question": "巴塞尔协议III对核心一级资本充足率的要求是不低于()。",
        "options": ["4%", "4.5%", "6%", "8%"],
        "correct_answer": "B",
        "explanation": "巴塞尔协议III要求核心一级资本充足率不低于4.5%，一级资本充足率不低于6%，总资本充足率不低于8%。此外还要求2.5%的资本缓冲。",
        "difficulty": "medium",
        "knowledge_point": "巴塞尔协议体系(I/II/III)",
    },
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "short_answer",
        "question": "简述信用违约互换(CDS)的基本原理与功能。",
        "options": None,
        "correct_answer": "CDS是一种信用衍生品，买方定期向卖方支付保费，当参考资产发生信用事件(违约、破产、债务重组等)时，卖方向买方赔偿损失。功能：(1)对冲信用风险；(2)投机信用事件；(3)套利不同市场间的定价偏差；(4)作为信用风险的度量指标。",
        "explanation": "CDS类似于为债券买保险，但买方不需要持有标的债券。2008年金融危机中CDS的滥用被认为是风险扩散的重要原因之一。",
        "difficulty": "hard",
        "knowledge_point": "信用违约互换(CDS)",
    },
    # ===== 商业银行 =====
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "single_choice",
        "question": "商业银行最基本的职能是()。",
        "options": ["信用中介", "支付中介", "信用创造", "金融服务"],
        "correct_answer": "A",
        "explanation": "信用中介是商业银行最基本、最能反映其经营特征的职能。银行通过吸收存款和发放贷款，在资金盈余者和资金短缺者之间充当信用中介。",
        "difficulty": "easy",
        "knowledge_point": "商业银行的职能(信用中介/支付中介/信用创造)",
    },
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "multiple_choice",
        "question": "商业银行进行信用分析的5C原则包括()。",
        "options": ["品格(Character)", "能力(Capacity)", "资本(Capital)", "担保(Collateral)", "条件(Condition)"],
        "correct_answer": "ABCDE",
        "explanation": "5C原则是商业银行评估借款人信用状况的经典框架：品格(还款意愿)、能力(还款能力)、资本(净资产实力)、担保(抵押品)、条件(经营环境)。",
        "difficulty": "easy",
        "knowledge_point": "贷款种类与信用分析(5C原则)",
    },
    # ===== 431综合 =====
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "calculation",
        "question": "某公司目标资本结构为：债务40%、普通股60%。债务税前成本为8%，公司所得税率为25%，普通股成本(用CAPM计算)为14%。求该公司的WACC。",
        "options": None,
        "correct_answer": "WACC = Wd×Rd×(1-T) + We×Re = 0.4×8%×(1-0.25) + 0.6×14% = 0.4×6% + 0.6×14% = 2.4% + 8.4% = 10.8%。",
        "explanation": "WACC是加权平均资本成本，其中债务成本需考虑利息的税盾效应(乘以1-T)。WACC是公司项目评估中常用的折现率。",
        "difficulty": "medium",
        "knowledge_point": "WACC计算与应用",
    },
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "single_choice",
        "question": "关于系统性风险和非系统性风险，下列说法正确的是()。",
        "options": ["非系统性风险可以通过投资组合分散化消除", "系统性风险可以通过投资组合分散化消除", "两者都可以通过分散化消除", "两者都不能通过分散化消除"],
        "correct_answer": "A",
        "explanation": "非系统性风险(公司特有风险)可以通过充分分散化投资组合来消除；系统性风险(市场风险)影响所有资产，无法通过分散化消除，只能通过风险转移或对冲来管理。",
        "difficulty": "easy",
        "knowledge_point": "收益与风险的度量",
    },
    {
        "id": str(uuid.uuid4()),
        "chapter_id": "",
        "type": "calculation",
        "question": "某投资者持有A、B两只股票，权重分别为60%和40%。A的期望收益率为15%，标准差20%；B的期望收益率为10%，标准差15%。两只股票的相关系数为0.3。求该投资组合的期望收益率和标准差。",
        "options": None,
        "correct_answer": "期望收益率 = 0.6×15% + 0.4×10% = 9% + 4% = 13%。组合方差 = (0.6)^2×(20%)^2 + (0.4)^2×(15%)^2 + 2×0.6×0.4×0.3×20%×15% = 0.0144 + 0.0036 + 0.00432 = 0.02232。组合标准差 = √0.02232 ≈ 14.94%。",
        "explanation": "组合期望收益率是各资产期望收益率的加权平均。组合标准差的计算需考虑协方差(相关系数)，当相关系数<1时，分散化可以降低组合风险。",
        "difficulty": "hard",
        "knowledge_point": "马科维茨投资组合模型",
    },
]


class ExerciseService:
    """Mock 题库服务类，提供金融练习题生成与答案批改"""

    def __init__(self) -> None:
        """初始化题库服务，将题目按章节分组"""
        self._questions: List[dict] = MOCK_QUESTIONS.copy()

    def _get_chapter_questions(self, chapter_id: str) -> List[dict]:
        """获取指定章节的题目（基于章节ID映射）"""
        # 由于 mock 题目需要与 course_service 的章节关联，
        # 这里按索引映射：每个章节分配 5-8 道题
        from services.course_service import course_service

        all_chapters = course_service._chapters
        chapter_index = 0
        for i, ch in enumerate(all_chapters):
            if ch["id"] == chapter_id:
                chapter_index = i
                break

        # 按章节索引分配题目（循环使用题库）
        questions_per_chapter = 6
        start = (chapter_index * questions_per_chapter) % len(self._questions)
        assigned: List[dict] = []
        for j in range(questions_per_chapter):
            idx = (start + j) % len(self._questions)
            q = self._questions[idx].copy()
            q["chapter_id"] = chapter_id
            assigned.append(q)
        return assigned

    def generate_exercise(
        self,
        chapter_id: str,
        question_type: Optional[str] = None,
        count: int = 5,
    ) -> ExerciseResponse:
        """生成练习题

        Args:
            chapter_id: 章节ID
            question_type: 筛选题目类型(可选)
            count: 请求题目数量

        Returns:
            练习题响应，包含题目列表和章节标题

        Raises:
            ValueError: 章节ID不存在时抛出
        """
        from services.course_service import course_service

        chapter = course_service.get_chapter(chapter_id)
        pool = self._get_chapter_questions(chapter_id)

        # 按题目类型筛选
        if question_type:
            pool = [q for q in pool if q["type"] == question_type]

        # 随机抽取指定数量
        actual_count = min(count, len(pool))
        selected = random.sample(pool, actual_count)

        questions = [
            ExerciseQuestion(**q) for q in selected
        ]

        return ExerciseResponse(
            questions=questions,
            chapter_title=chapter.title,
        )

    def get_question(self, question_id: str) -> ExerciseQuestion:
        """根据ID获取单道题目

        Args:
            question_id: 题目ID

        Returns:
            题目详情

        Raises:
            ValueError: 题目ID不存在时抛出
        """
        for q in self._questions:
            if q["id"] == question_id:
                return ExerciseQuestion(**q)
        raise ValueError(f"未找到题目: {question_id}")

    def submit_answer(
        self,
        question_id: str,
        user_answer: str,
    ) -> SubmitResult:
        """批改单道题目

        Args:
            question_id: 题目ID
            user_answer: 用户提交的答案

        Returns:
            批改结果

        Raises:
            ValueError: 题目ID不存在时抛出
        """
        question = self.get_question(question_id)

        # 判断正确性
        correct = user_answer.strip().upper() == question.correct_answer.strip().upper()

        # 计算得分
        score_map = {"easy": 2, "medium": 3, "hard": 5}
        score = score_map.get(question.difficulty, 3) if correct else 0

        return SubmitResult(
            question_id=question.id,
            correct=correct,
            user_answer=user_answer,
            correct_answer=question.correct_answer,
            explanation=question.explanation,
            knowledge_point=question.knowledge_point,
            score=score,
        )


# 全局单例实例
exercise_service = ExerciseService()
