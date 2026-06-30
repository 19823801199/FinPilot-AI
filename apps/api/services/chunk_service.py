# -*- coding: utf-8 -*-
"""FinPilot AI API - Chunk 管理服务模块"""

import uuid
from typing import List, Optional

from schemas.knowledge import ChunkInfo


# 预置 Mock Chunk 数据，按文档 ID 索引
MOCK_CHUNKS: dict[str, list[dict]] = {}


def _init_mock_chunks(document_service) -> None:
    """根据文档服务中的文档生成 Mock Chunk 数据

    Args:
        document_service: 文档服务实例
    """
    documents = document_service.list_documents()
    for doc in documents:
        chunks: list[dict] = []
        for idx in range(doc.chunk_count):
            chunk_id = str(uuid.uuid4())
            page_number = (idx // 3) + 1 if doc.content_type == "pdf" else None
            chunk = {
                "id": chunk_id,
                "document_id": doc.id,
                "content": _generate_chunk_content(doc.filename, doc.category, idx, doc.chunk_count),
                "page_number": page_number,
                "chunk_index": idx,
                "metadata": {
                    "document_name": doc.filename,
                    "category": doc.category,
                    "tags": doc.tags,
                    "char_count": len(_generate_chunk_content(doc.filename, doc.category, idx, doc.chunk_count)),
                },
            }
            chunks.append(chunk)
        MOCK_CHUNKS[doc.id] = chunks


# 各类文档的 Mock 内容模板
_CHUNK_TEMPLATES: dict[str, list[str]] = {
    "财务报告": [
        "2024年A股市场整体呈现震荡上行态势，上证综指全年累计上涨12.5%，深证成指上涨8.3%。"
        "其中，大盘蓝筹股表现突出，金融、能源板块领涨市场。中小盘股相对疲弱，"
        "创业板指全年仅上涨3.2%。市场成交量较2023年增长15%，日均成交额突破1.2万亿元。",
        "从行业表现来看，2024年涨幅前三的行业分别为：煤炭（+32.5%）、银行（+28.7%）"
        "和石油石化（+25.3%）。跌幅前三的行业为：房地产（-18.6%）、计算机（-12.4%）"
        "和传媒（-9.8%）。行业分化明显，价值风格显著优于成长风格。",
        "财务分析显示，A股上市公司2024年整体营收同比增长8.2%，净利润增长6.5%。"
        "其中，金融行业贡献了全部利润增量的45%，制造业利润增速放缓至3.1%。"
        "ROE中位数为9.8%，较2023年下降0.3个百分点，显示整体盈利能力有所减弱。",
        "估值方面，截至2024年末，A股整体PE（TTM）为15.2倍，处于近十年35%分位数。"
        "PB为1.45倍，处于近十年25%分位数。从全球比较来看，A股估值仍处于相对低位，"
        "具备一定的安全边际。股息率方面，沪深300平均股息率达3.2%，配置价值凸显。",
        "资金面分析：2024年北向资金净流入1,856亿元，较2023年增长42%。"
        "其中，沪股通净流入1,120亿元，深股通净流入736亿元。外资偏好消费和新能源板块，"
        "贵州茅台、宁德时代、中国平安为净买入前三。公募基金新发行规模达1.2万亿元。",
    ],
    "行业研究": [
        "新能源汽车行业2024年全球销量突破1,800万辆，同比增长28%。中国市场贡献了65%的销量，"
        "渗透率达到38%。比亚迪以302万辆的年销量稳居全球第一，市场份额达16.8%。"
        "特斯拉全球销量181万辆，同比增长6.5%，市场份额有所下滑。",
        "动力电池领域，宁德时代2024年全球装机量达289GWh，市场份额36.5%，连续七年全球第一。"
        "比亚迪弗迪电池装机量突破100GWh，市场份额12.8%。中创新航、国轩高科、亿纬锂能"
        "等二线厂商加速追赶，行业竞争格局趋于激烈。",
        "技术路线方面，磷酸铁锂电池凭借成本优势，在乘用车市场占比提升至62%。"
        "三元锂电池在高端车型中仍占主导。固态电池技术取得突破性进展，"
        "多家企业宣布2026年量产计划。钠离子电池开始进入商业化应用阶段。",
        "智能化成为新能源汽车竞争的核心维度。2024年L2+级辅助驾驶渗透率达45%，"
        "L3级自动驾驶在特定场景开始落地。华为、小鹏、理想在智驾领域领先，"
        "城市NOA功能成为标配。智能座舱方面，大模型上车成为趋势。",
        "投资建议：新能源汽车行业已从政策驱动转向市场驱动，行业增速放缓但结构优化。"
        "建议关注：1）具备技术壁垒的电池龙头；2）智能化领先的车企；3）产业链上游"
        "资源型企业。风险提示：价格战加剧、海外贸易壁垒、原材料价格波动。",
    ],
    "政策法规": [
        "2025年金融监管政策重点围绕防范化解金融风险、深化金融改革、服务实体经济三大主线展开。"
        "证监会发布《关于加强证券基金经营机构监管的指导意见》，要求券商净资本"
        "充足率不低于150%，基金公司风险准备金计提比例上调至管理费的5%。",
        "银保监会出台《商业银行资本管理办法》修订版，新规对系统重要性银行附加资本要求"
        "提高1.5个百分点至2.5%。同时，对中小银行实施差异化监管，鼓励通过合并重组"
        "化解风险。个人住房贷款首付比例统一调整为不低于20%。",
        "注册制深化改革持续推进。2025年全面实行注册制后的配套制度不断完善，"
        "IPO审核周期缩短至平均6个月。退市新规实施后，全年退市公司数量达52家，"
        "创历史新高。财务造假退市标准更加严格，重大违法退市流程进一步简化。",
        "资本市场对外开放步伐加快。沪深港通标的范围进一步扩大，纳入更多中盘股和ETF。"
        "QFII/RQFII额度管理取消，外资准入门槛大幅降低。债券市场互联互通取得进展，"
        "境外投资者可直接参与银行间债券市场交易。",
        "金融科技监管框架基本成型。《金融科技发展规划（2025-2027）》明确了对AI、"
        "大数据、区块链等技术在金融领域应用的监管要求。算法备案制度全面实施，"
        "大模型在金融场景的应用需通过专项评估。数据安全法与个人信息保护法"
        "在金融领域的实施细则进一步细化。",
    ],
    "学习笔记": [
        "巴菲特2024年致股东信核心要点：1）投资的核心是寻找具有持久竞争优势的企业；"
        "2）以合理的价格买入优秀的企业，远胜于以便宜的价格买入平庸的企业；"
        "3）耐心是投资者最重要的品质，好的投资机会值得等待；"
        "4）集中投资于自己理解的领域，分散化是'对无知的保护'。",
        "价值投资的四大原则：企业原则——投资于简单、易懂、有持续经营历史的企业；"
        "管理原则——寻找诚实能干的管理层；财务原则——关注ROE而非每股收益的增长；"
        "市场原则——在市场恐惧时贪婪，在市场贪婪时恐惧。这四大原则构成了"
        "巴菲特投资哲学的核心框架。",
        "关于护城河理论：巴菲特将企业竞争优势分为五种类型——无形资产（品牌、专利、"
        "法定许可）、客户转换成本、网络效应、成本优势、规模优势。"
        "最持久的护城河是那些能够随着时间推移而不断加宽的竞争优势。"
        "评估护城河的关键是看它是否能让企业在10年、20年后仍然保持领先。",
        "安全边际的概念：格雷厄姆提出的安全边际原则是价值投资的基石。"
        "安全边际 = 内在价值 - 市场价格。当市场价格低于内在价值时，"
        "投资者才应该买入。巴菲特建议安全边际至少为25%，即买入价格"
        "不应超过内在价值的75%。这为判断失误留出了缓冲空间。",
        "能力圈原则：巴菲特强调投资者应该明确自己的能力边界，只投资于自己"
        "真正理解的行业和企业。'在能力圈内做投资决策，能力圈的大小不重要，"
        "重要的是清楚边界在哪里。'跨出能力圈的投资往往伴随着巨大的风险。"
        "持续学习可以逐步扩大能力圈，但永远不要假装自己什么都懂。",
    ],
    "市场分析": [
        "2025年半导体行业迎来新一轮景气周期。全球半导体销售额预计达到6,500亿美元，"
        "同比增长18%。AI芯片需求爆发式增长，英伟达数据中心GPU出货量同比增长120%。"
        "中国市场方面，国产替代进程加速，半导体设备国产化率提升至35%。",
        "AI芯片市场格局分析：英伟达凭借H100/B200系列GPU占据数据中心AI训练市场"
        "85%的份额。AMD MI300X在推理市场取得突破，份额提升至12%。国产AI芯片方面，"
        "华为昇腾910B性能接近A100水平，在政企市场加速替代。寒武纪、海光信息"
        "等厂商产品也在持续迭代。",
        "存储芯片周期触底回升。DRAM价格自2024年Q3起连续三个季度上涨，"
        "累计涨幅达45%。NAND Flash价格同步回升，涨幅约35%。三星、SK海力士"
        "HBM3E产能扩建加速，以满足AI服务器需求。长江存储在NAND领域技术突破，"
        "232层堆叠产品进入量产。",
        "半导体设备与材料市场：ASML 2024年EUV光刻机出货量达52台，2025年预计"
        "出货65台。国产光刻机方面，上海微电子28nm DUV光刻机通过产线验证。"
        "EDA工具国产化率提升至15%，北方华创、中微公司等设备厂商订单饱满。",
        "投资策略建议：半导体行业处于AI驱动的超级周期中，建议关注三条主线："
        "1）AI芯片设计龙头，受益于算力需求爆发；2）半导体设备国产替代，"
        "政策支持力度持续加大；3）存储芯片周期反转，量价齐升带来业绩弹性。"
        "风险提示：地缘政治风险、技术迭代加速、产能过剩风险。",
    ],
}


def _generate_chunk_content(filename: str, category: str, chunk_index: int, total_chunks: int) -> str:
    """根据文档信息生成 Mock Chunk 内容

    Args:
        filename: 文件名称
        category: 文档分类
        chunk_index: 切块序号
        total_chunks: 总切块数

    Returns:
        模拟的切块内容
    """
    templates = _CHUNK_TEMPLATES.get(category, _CHUNK_TEMPLATES["学习笔记"])
    template_index = chunk_index % len(templates)
    base_content = templates[template_index]
    # 添加切块标识信息
    header = f"[{filename} - 第{chunk_index + 1}/{total_chunks}段]\n\n"
    return header + base_content


class ChunkService:
    """Chunk 管理服务类，提供 Mock 文档切块的查询功能"""

    def __init__(self) -> None:
        """初始化 Chunk 服务"""
        self._initialized = False
        self._chunks: dict[str, list[dict]] = {}

    def _ensure_initialized(self) -> None:
        """延迟初始化，避免循环导入"""
        if not self._initialized:
            from services.document_service import document_service as _doc_svc
            _init_mock_chunks(_doc_svc)
            self._chunks = MOCK_CHUNKS
            self._initialized = True

    def get_document_chunks(self, document_id: str) -> List[ChunkInfo]:
        """获取文档的所有切块

        Args:
            document_id: 文档ID

        Returns:
            切块信息列表

        Raises:
            ValueError: 文档ID不存在时抛出
        """
        self._ensure_initialized()
        if document_id not in self._chunks:
            raise ValueError(f"未找到文档的切块数据: {document_id}")
        return [self._to_chunk_info(chunk) for chunk in self._chunks[document_id]]

    def get_chunk(self, chunk_id: str) -> ChunkInfo:
        """获取单个切块详情

        Args:
            chunk_id: 切块ID

        Returns:
            切块信息

        Raises:
            ValueError: 切块ID不存在时抛出
        """
        self._ensure_initialized()
        for chunks in self._chunks.values():
            for chunk in chunks:
                if chunk["id"] == chunk_id:
                    return self._to_chunk_info(chunk)
        raise ValueError(f"未找到切块: {chunk_id}")

    def _to_chunk_info(self, chunk: dict) -> ChunkInfo:
        """将内部切块字典转换为 ChunkInfo 模型"""
        return ChunkInfo(
            id=chunk["id"],
            document_id=chunk["document_id"],
            content=chunk["content"],
            page_number=chunk.get("page_number"),
            chunk_index=chunk["chunk_index"],
            metadata=chunk["metadata"],
        )


# 全局单例实例
chunk_service = ChunkService()
