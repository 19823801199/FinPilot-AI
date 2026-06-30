# -*- coding: utf-8 -*-
"""FinPilot AI API - Mock 课程服务模块"""

import uuid
from typing import List, Optional

from schemas.learning import Course, Chapter


# ---------- Mock 课程数据（10 门金融课程） ----------

MOCK_COURSES: List[dict] = [
    {
        "id": str(uuid.uuid4()),
        "name": "货币金融学",
        "description": "系统讲授货币、信用、利率、金融市场、金融机构与货币政策的理论与实践，是金融学的基础入门课程。",
        "category": "金融学基础",
        "chapter_count": 4,
        "total_questions": 28,
        "estimated_hours": 40.0,
        "icon": "💰",
    },
    {
        "id": str(uuid.uuid4()),
        "name": "公司金融",
        "description": "聚焦企业投融资决策、资本结构、股利政策、公司治理与并购重组等核心内容，培养公司金融分析能力。",
        "category": "金融学核心",
        "chapter_count": 5,
        "total_questions": 35,
        "estimated_hours": 48.0,
        "icon": "🏢",
    },
    {
        "id": str(uuid.uuid4()),
        "name": "投资学",
        "description": "涵盖投资组合理论、资本资产定价模型、套利定价理论、有效市场假说与行为金融学等经典理论。",
        "category": "金融学核心",
        "chapter_count": 4,
        "total_questions": 26,
        "estimated_hours": 42.0,
        "icon": "📈",
    },
    {
        "id": str(uuid.uuid4()),
        "name": "金融市场学",
        "description": "全面介绍货币市场、资本市场、外汇市场与衍生品市场的运行机制、定价原理与监管框架。",
        "category": "金融市场",
        "chapter_count": 4,
        "total_questions": 24,
        "estimated_hours": 36.0,
        "icon": "📊",
    },
    {
        "id": str(uuid.uuid4()),
        "name": "商业银行经营学",
        "description": "讲授商业银行的资产负债管理、信贷风险管理、中间业务、表外业务及银行监管等内容。",
        "category": "金融机构",
        "chapter_count": 4,
        "total_questions": 25,
        "estimated_hours": 38.0,
        "icon": "🏦",
    },
    {
        "id": str(uuid.uuid4()),
        "name": "中央银行学",
        "description": "深入分析中央银行的职能、货币政策工具与传导机制、金融稳定与宏观审慎管理。",
        "category": "金融机构",
        "chapter_count": 3,
        "total_questions": 20,
        "estimated_hours": 30.0,
        "icon": "🏛️",
    },
    {
        "id": str(uuid.uuid4()),
        "name": "证券投资分析",
        "description": "涵盖基本面分析、技术分析、量化投资策略与投资组合管理实务，注重实战能力培养。",
        "category": "投资实务",
        "chapter_count": 5,
        "total_questions": 32,
        "estimated_hours": 45.0,
        "icon": "📉",
    },
    {
        "id": str(uuid.uuid4()),
        "name": "国际金融",
        "description": "讲授国际收支、汇率理论、国际货币体系、国际资本流动与开放经济下的宏观政策协调。",
        "category": "国际金融",
        "chapter_count": 4,
        "total_questions": 26,
        "estimated_hours": 40.0,
        "icon": "🌍",
    },
    {
        "id": str(uuid.uuid4()),
        "name": "金融风险管理",
        "description": "系统介绍市场风险、信用风险、操作风险与流动性风险的度量方法与管理工具。",
        "category": "风险管理",
        "chapter_count": 4,
        "total_questions": 28,
        "estimated_hours": 42.0,
        "icon": "🛡️",
    },
    {
        "id": str(uuid.uuid4()),
        "name": "431金融学综合",
        "description": "金融专硕入学考试综合复习课程，整合货币金融学、公司金融、投资学核心考点，助力考研冲刺。",
        "category": "考研辅导",
        "chapter_count": 5,
        "total_questions": 40,
        "estimated_hours": 60.0,
        "icon": "🎓",
    },
]


# ---------- Mock 章节数据 ----------

MOCK_CHAPTERS: List[dict] = [
    # === 货币金融学 ===
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[0]["id"],
        "title": "货币与货币制度",
        "index": 1,
        "description": "货币的起源、本质、职能与货币制度的演变，包括人民币制度与国际货币体系。",
        "key_points": ["货币的职能与本质", "货币层次的划分(M0/M1/M2)", "货币制度的演变历程", "信用货币与电子货币"],
        "question_count": 7,
        "estimated_minutes": 90,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[0]["id"],
        "title": "信用与利率",
        "index": 2,
        "description": "信用的形式与作用、利率的决定理论、利率的结构与期限结构理论。",
        "key_points": ["信用的形式与工具", "利率决定理论(古典/流动性偏好/可贷资金)", "利率的期限结构(预期假说/分割市场/优先偏好)", "名义利率与实际利率的费雪关系"],
        "question_count": 7,
        "estimated_minutes": 100,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[0]["id"],
        "title": "金融市场",
        "index": 3,
        "description": "货币市场与资本市场的构成、金融工具的特点与定价方法。",
        "key_points": ["货币市场工具(商业票据/国库券/回购协议)", "资本市场工具(股票/债券/证券投资基金)", "金融衍生品基础(远期/期货/期权/互换)", "金融市场功能与效率"],
        "question_count": 7,
        "estimated_minutes": 110,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[0]["id"],
        "title": "货币政策",
        "index": 4,
        "description": "货币政策目标、工具与传导机制，以及货币政策与财政政策的配合。",
        "key_points": ["货币政策最终目标与中介目标", "三大传统货币政策工具", "货币政策传导机制(利率/信用/资产价格渠道)", "泰勒规则与货币政策规则"],
        "question_count": 7,
        "estimated_minutes": 100,
    },
    # === 公司金融 ===
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[1]["id"],
        "title": "公司金融导论",
        "index": 1,
        "description": "公司金融的基本概念、企业组织形式、财务目标与代理问题。",
        "key_points": ["企业组织形式(独资/合伙/公司制)", "股东财富最大化目标", "代理问题与公司治理", "金融市场环境"],
        "question_count": 7,
        "estimated_minutes": 80,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[1]["id"],
        "title": "货币时间价值与估值",
        "index": 2,
        "description": "现值、终值、年金计算，债券与股票的估值方法。",
        "key_points": ["复利与单利计算", "现值与终值", "年金(普通/预付/永续)", "债券定价(附息/零息/到期收益率)", "股票估值(DDM/DCF/相对估值)"],
        "question_count": 7,
        "estimated_minutes": 120,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[1]["id"],
        "title": "资本预算",
        "index": 3,
        "description": "投资项目评价方法、现金流估算、资本预算实务与风险分析。",
        "key_points": ["NPV/IRR/PI/回收期法", "增量现金流估算", "互斥项目选择", "敏感性分析与情景分析"],
        "question_count": 7,
        "estimated_minutes": 110,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[1]["id"],
        "title": "资本结构与股利政策",
        "index": 4,
        "description": "MM定理、权衡理论、优序融资理论与股利政策的理论与实践。",
        "key_points": ["MM无税/有税定理", "权衡理论与财务困境成本", "优序融资理论", "股利政策类型与信号效应", "股票回购与拆股"],
        "question_count": 7,
        "estimated_minutes": 120,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[1]["id"],
        "title": "公司治理与并购",
        "index": 5,
        "description": "公司治理机制、并购动因、并购估值与反收购策略。",
        "key_points": ["董事会结构与独立董事", "并购协同效应分析", "DCF与乘数法估值", "杠杆收购(LBO)", "反收购防御策略"],
        "question_count": 7,
        "estimated_minutes": 100,
    },
    # === 投资学 ===
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[2]["id"],
        "title": "投资组合理论",
        "index": 1,
        "description": "马科维茨均值-方差模型、有效前沿与最优投资组合选择。",
        "key_points": ["收益与风险的度量", "马科维茨投资组合模型", "有效前沿与无差异曲线", "两基金分离定理"],
        "question_count": 7,
        "estimated_minutes": 110,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[2]["id"],
        "title": "资本资产定价模型",
        "index": 2,
        "description": "CAPM模型推导、Beta系数、证券市场线与Alpha。",
        "key_points": ["CAPM假设与推导", "Beta系数计算与经济含义", "证券市场线(SML)", "Alpha与业绩评估"],
        "question_count": 7,
        "estimated_minutes": 100,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[2]["id"],
        "title": "套利定价与有效市场",
        "index": 3,
        "description": "APT模型、因素模型、有效市场假说的三种形式与实证检验。",
        "key_points": ["套利定价理论(APT)", "单因素与多因素模型", "弱式/半强式/强式有效市场", "市场异象与行为金融解释"],
        "question_count": 6,
        "estimated_minutes": 100,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[2]["id"],
        "title": "固定收益证券分析",
        "index": 4,
        "description": "债券定价、久期与凸性、利率期限结构、债券组合策略。",
        "key_points": ["债券定价与收益率计算", "麦考利久期与修正久期", "凸性与免疫策略", "利率期限结构理论"],
        "question_count": 6,
        "estimated_minutes": 100,
    },
    # === 金融市场学 ===
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[3]["id"],
        "title": "货币市场",
        "index": 1,
        "description": "同业拆借市场、票据市场、国库券市场与回购市场的运行机制。",
        "key_points": ["同业拆借利率(SHIBOR/LIBOR)", "商业票据市场", "国库券发行与定价", "回购协议机制"],
        "question_count": 6,
        "estimated_minutes": 90,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[3]["id"],
        "title": "资本市场",
        "index": 2,
        "description": "股票市场与债券市场的发行、交易与监管体系。",
        "key_points": ["IPO注册制与核准制", "债券发行方式与信用评级", "证券交易所交易机制", "做市商制度与竞价制度"],
        "question_count": 6,
        "estimated_minutes": 100,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[3]["id"],
        "title": "外汇市场",
        "index": 3,
        "description": "外汇市场结构、汇率报价、外汇交易与外汇风险管理。",
        "key_points": ["即期与远期外汇交易", "汇率报价方式(直接/间接)", "套汇与套利", "外汇期货与期权"],
        "question_count": 6,
        "estimated_minutes": 90,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[3]["id"],
        "title": "金融衍生品市场",
        "index": 4,
        "description": "远期、期货、期权与互换合约的定价原理与交易策略。",
        "key_points": ["期货定价(持有成本模型)", "期权定价(Black-Scholes模型)", "期权交易策略(牛市/熊市/套利)", "利率互换与货币互换"],
        "question_count": 6,
        "estimated_minutes": 110,
    },
    # === 商业银行经营学 ===
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[4]["id"],
        "title": "商业银行概述",
        "index": 1,
        "description": "商业银行的起源、性质、职能与组织形式，以及银行监管体系。",
        "key_points": ["商业银行的职能(信用中介/支付中介/信用创造)", "商业银行的组织形式", "巴塞尔协议体系(I/II/III)", "中国银行业监管框架"],
        "question_count": 6,
        "estimated_minutes": 90,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[4]["id"],
        "title": "资产负债管理",
        "index": 2,
        "description": "资产负债表结构、利率敏感性分析、缺口管理与持续期管理。",
        "key_points": ["资产负债表结构分析", "利率敏感性缺口管理", "持续期缺口管理", "流动性管理策略"],
        "question_count": 7,
        "estimated_minutes": 110,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[4]["id"],
        "title": "信贷业务管理",
        "index": 3,
        "description": "贷款分类、信用分析(5C)、贷款定价与不良贷款管理。",
        "key_points": ["贷款种类与信用分析(5C原则)", "贷款定价方法", "不良贷款处置方式", "信贷资产证券化"],
        "question_count": 6,
        "estimated_minutes": 100,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[4]["id"],
        "title": "中间业务与表外业务",
        "index": 4,
        "description": "结算、代理、担保、承诺、衍生品交易等非利息收入业务。",
        "key_points": ["中间业务类型与收入模式", "表外业务风险特征", "担保与承诺业务", "金融科技对银行业务的影响"],
        "question_count": 6,
        "estimated_minutes": 90,
    },
    # === 中央银行学 ===
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[5]["id"],
        "title": "中央银行制度",
        "index": 1,
        "description": "中央银行的产生与发展、性质与职能、组织形式与独立性。",
        "key_points": ["中央银行的产生历史", "中央银行的职能(发行的银行/银行的银行/政府的银行)", "中央银行独立性", "中国人民银行的组织架构"],
        "question_count": 7,
        "estimated_minutes": 90,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[5]["id"],
        "title": "货币政策工具与操作",
        "index": 2,
        "description": "公开市场操作、存款准备金政策、再贴现政策及非常规货币政策工具。",
        "key_points": ["三大传统政策工具比较", "公开市场操作机制", "存款准备金制度", "量化宽松(QE)与非常规工具"],
        "question_count": 7,
        "estimated_minutes": 100,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[5]["id"],
        "title": "金融稳定与宏观审慎",
        "index": 3,
        "description": "金融稳定框架、宏观审慎政策工具、系统性风险监测与金融安全网。",
        "key_points": ["最后贷款人职能", "存款保险制度", "宏观审慎政策框架", "系统性风险识别与防范"],
        "question_count": 6,
        "estimated_minutes": 90,
    },
    # === 证券投资分析 ===
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[6]["id"],
        "title": "基本面分析",
        "index": 1,
        "description": "宏观经济分析、行业分析与公司财务分析的方法与框架。",
        "key_points": ["宏观经济指标解读(GDP/CPI/PMI)", "行业生命周期分析", "波特五力模型", "财务报表分析(杜邦分析)"],
        "question_count": 7,
        "estimated_minutes": 110,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[6]["id"],
        "title": "技术分析",
        "index": 2,
        "description": "K线理论、趋势分析、形态分析、技术指标与量价关系。",
        "key_points": ["K线形态(反转/持续)", "趋势线与支撑阻力", "MACD/KDJ/RSI指标", "波浪理论基本原理"],
        "question_count": 6,
        "estimated_minutes": 100,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[6]["id"],
        "title": "量化投资策略",
        "index": 3,
        "description": "多因子模型、统计套利、机器学习在投资中的应用。",
        "key_points": ["多因子选股模型", "均值回归与动量策略", "统计套利基本原理", "量化回测与风险控制"],
        "question_count": 6,
        "estimated_minutes": 110,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[6]["id"],
        "title": "投资组合管理",
        "index": 4,
        "description": "积极与消极投资策略、资产配置、业绩评价与归因分析。",
        "key_points": ["战略资产配置与战术资产配置", "积极与消极管理策略", "夏普比率/特雷诺比率/詹森Alpha", "Brinson业绩归因模型"],
        "question_count": 7,
        "estimated_minutes": 100,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[6]["id"],
        "title": "行为金融学",
        "index": 5,
        "description": "投资者心理偏差、市场异象与行为金融投资策略。",
        "key_points": ["前景理论与损失厌恶", "过度自信与锚定效应", "羊群效应与信息瀑布", "动量效应与反转效应"],
        "question_count": 6,
        "estimated_minutes": 90,
    },
    # === 国际金融 ===
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[7]["id"],
        "title": "国际收支",
        "index": 1,
        "description": "国际收支平衡表的编制、国际收支失衡的原因与调节。",
        "key_points": ["国际收支平衡表结构", "经常账户/资本与金融账户", "国际收支失衡类型", "弹性分析法/吸收分析法/货币分析法"],
        "question_count": 7,
        "estimated_minutes": 100,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[7]["id"],
        "title": "汇率理论与制度",
        "index": 2,
        "description": "汇率决定理论、汇率制度选择与人民币汇率问题。",
        "key_points": ["购买力平价(绝对/相对)", "利率平价(无套补/套补)", "货币模型与资产组合平衡模型", "固定汇率与浮动汇率制度比较"],
        "question_count": 7,
        "estimated_minutes": 110,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[7]["id"],
        "title": "国际货币体系",
        "index": 3,
        "description": "国际金本位、布雷顿森林体系、牙买加体系与区域货币一体化。",
        "key_points": ["金本位制的运行与崩溃", "布雷顿森林体系的双挂钩", "牙买加体系特征", "欧元区与最优货币区理论"],
        "question_count": 6,
        "estimated_minutes": 90,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[7]["id"],
        "title": "国际资本流动",
        "index": 4,
        "description": "国际资本流动的类型、动因、影响与危机防范。",
        "key_points": ["国际资本流动类型(FDI/FPI/银行信贷)", "国际资本流动动因", "货币危机理论(第一/二/三代模型)", "资本管制与金融开放"],
        "question_count": 6,
        "estimated_minutes": 90,
    },
    # === 金融风险管理 ===
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[8]["id"],
        "title": "风险管理概论",
        "index": 1,
        "description": "金融风险的分类、风险管理流程、风险偏好与风险文化。",
        "key_points": ["金融风险分类(市场/信用/操作/流动性)", "风险管理流程(识别/度量/监测/控制)", "COSO与巴塞尔风险管理框架", "风险偏好与限额管理"],
        "question_count": 7,
        "estimated_minutes": 90,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[8]["id"],
        "title": "市场风险管理",
        "index": 2,
        "description": "VaR方法、压力测试、情景分析与市场风险度量体系。",
        "key_points": ["VaR计算(历史模拟/参数法/蒙特卡洛)", "VaR的局限性与补充", "压力测试与情景分析", "回溯检验与模型验证"],
        "question_count": 7,
        "estimated_minutes": 110,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[8]["id"],
        "title": "信用风险管理",
        "index": 3,
        "description": "信用风险度量模型、信用衍生品与信用风险缓释技术。",
        "key_points": ["信用评级体系", "KMV模型与CreditMetrics模型", "信用违约互换(CDS)", "信用风险缓释(CRM)工具"],
        "question_count": 7,
        "estimated_minutes": 110,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[8]["id"],
        "title": "操作风险与全面风险管理",
        "index": 4,
        "description": "操作风险度量、全面风险管理框架与金融科技风险管理。",
        "key_points": ["操作风险分类与度量(基本指标/标准法/高级法)", "关键风险指标(KRI)", "全面风险管理(ERM)框架", "金融科技与新型风险"],
        "question_count": 7,
        "estimated_minutes": 100,
    },
    # === 431金融学综合 ===
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[9]["id"],
        "title": "431考试大纲与命题规律",
        "index": 1,
        "description": "431金融学综合考试大纲解读、命题规律分析与备考策略。",
        "key_points": ["431考试大纲核心考点", "各校命题风格差异", "近年真题趋势分析", "高效备考时间规划"],
        "question_count": 8,
        "estimated_minutes": 60,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[9]["id"],
        "title": "货币金融学核心考点",
        "index": 2,
        "description": "431考试中货币金融学高频考点精讲，包括货币创造、利率理论、货币政策等。",
        "key_points": ["货币乘数与货币创造", "利率期限结构三大理论", "货币政策传导机制", "通货膨胀与通货紧缩"],
        "question_count": 8,
        "estimated_minutes": 120,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[9]["id"],
        "title": "公司金融核心考点",
        "index": 3,
        "description": "431考试中公司金融高频考点精讲，包括NPV、CAPM、MM定理等。",
        "key_points": ["NPV与IRR决策准则", "CAPM模型应用", "MM定理(无税/有税)", "WACC计算与应用", "实物期权"],
        "question_count": 8,
        "estimated_minutes": 130,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[9]["id"],
        "title": "投资学核心考点",
        "index": 4,
        "description": "431考试中投资学高频考点精讲，包括有效市场、APT、债券久期等。",
        "key_points": ["有效市场假说三种形式", "APT与CAPM比较", "久期与凸性计算", "期权定价基础"],
        "question_count": 8,
        "estimated_minutes": 120,
    },
    {
        "id": str(uuid.uuid4()),
        "course_id": MOCK_COURSES[9]["id"],
        "title": "真题模拟与冲刺",
        "index": 5,
        "description": "历年真题精选模拟、高频错题精讲与考前冲刺策略。",
        "key_points": ["名校431真题精选", "计算题解题技巧", "论述题答题框架", "考前一周冲刺计划"],
        "question_count": 8,
        "estimated_minutes": 150,
    },
]


class CourseService:
    """Mock 课程服务类，提供金融课程与章节数据查询"""

    def __init__(self) -> None:
        """初始化课程服务，加载 Mock 课程与章节数据"""
        self._courses: List[dict] = MOCK_COURSES
        self._chapters: List[dict] = MOCK_CHAPTERS

    def get_courses(self) -> List[Course]:
        """获取所有课程列表

        Returns:
            全部课程列表
        """
        return [
            Course(**course) for course in self._courses
        ]

    def get_course(self, course_id: str) -> Course:
        """根据ID获取单个课程

        Args:
            course_id: 课程唯一标识

        Returns:
            课程详情

        Raises:
            ValueError: 课程ID不存在时抛出
        """
        for course in self._courses:
            if course["id"] == course_id:
                return Course(**course)
        raise ValueError(f"未找到课程: {course_id}")

    def get_chapters(self, course_id: str) -> List[Chapter]:
        """获取指定课程的所有章节

        Args:
            course_id: 课程唯一标识

        Returns:
            该课程下的所有章节列表
        """
        chapters: List[Chapter] = []
        for ch in self._chapters:
            if ch["course_id"] == course_id:
                chapters.append(Chapter(**ch))
        return chapters

    def get_chapter(self, chapter_id: str) -> Chapter:
        """根据ID获取单个章节

        Args:
            chapter_id: 章节唯一标识

        Returns:
            章节详情

        Raises:
            ValueError: 章节ID不存在时抛出
        """
        for ch in self._chapters:
            if ch["id"] == chapter_id:
                return Chapter(**ch)
        raise ValueError(f"未找到章节: {chapter_id}")


# 全局单例实例
course_service = CourseService()
