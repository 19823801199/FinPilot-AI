# -*- coding: utf-8 -*-
"""FinPilot AI API - RAG 检索服务模块"""

import random
import time
from typing import List, Optional

from schemas.knowledge import RetrievalResult, RAGAnswer


# 内置 5 个金融主题的 Mock Q&A 对
MOCK_QA_PAIRS: list[dict] = [
    {
        "keywords": ["A股", "市场", "行情", "大盘", "股市"],
        "answer": (
            "根据知识库中的最新分析报告，2024年A股市场整体呈现震荡上行态势。"
            "上证综指全年累计上涨12.5%，深证成指上涨8.3%。大盘蓝筹股表现突出，"
            "金融、能源板块领涨市场。从估值来看，A股整体PE（TTM）为15.2倍，"
            "处于近十年35%分位数，仍具备一定的配置价值。建议关注沪深300成分股中"
            "股息率较高的标的，以及受益于经济复苏的顺周期板块。"
        ),
        "sources": [
            {
                "chunk_id": "chunk-a1",
                "document_id": "doc-report-2024",
                "document_name": "2024年A股市场年度报告.pdf",
                "page_number": 1,
                "content": "2024年A股市场整体呈现震荡上行态势，上证综指全年累计上涨12.5%...",
                "similarity": 0.92,
            },
            {
                "chunk_id": "chunk-a2",
                "document_id": "doc-report-2024",
                "document_name": "2024年A股市场年度报告.pdf",
                "page_number": 3,
                "content": "估值方面，截至2024年末，A股整体PE（TTM）为15.2倍...",
                "similarity": 0.87,
            },
        ],
    },
    {
        "keywords": ["新能源汽车", "电动车", "EV", "比亚迪", "宁德时代"],
        "answer": (
            "根据行业研究报告分析，新能源汽车行业2024年全球销量突破1,800万辆，"
            "同比增长28%。中国市场渗透率达到38%。比亚迪以302万辆年销量稳居全球第一，"
            "宁德时代动力电池全球装机量达289GWh，市场份额36.5%。投资建议关注三条主线："
            "1）具备技术壁垒的电池龙头；2）智能化领先的车企；3）产业链上游资源型企业。"
            "需注意价格战加剧和海外贸易壁垒等风险因素。"
        ),
        "sources": [
            {
                "chunk_id": "chunk-ev1",
                "document_id": "doc-ev-research",
                "document_name": "新能源汽车行业深度研究报告.docx",
                "page_number": 1,
                "content": "新能源汽车行业2024年全球销量突破1,800万辆，同比增长28%...",
                "similarity": 0.95,
            },
            {
                "chunk_id": "chunk-ev2",
                "document_id": "doc-ev-research",
                "document_name": "新能源汽车行业深度研究报告.docx",
                "page_number": 2,
                "content": "动力电池领域，宁德时代2024年全球装机量达289GWh...",
                "similarity": 0.89,
            },
        ],
    },
    {
        "keywords": ["金融监管", "政策", "法规", "证监会", "银保监会", "监管"],
        "answer": (
            "根据最新政策法规汇编，2025年金融监管政策围绕防范化解金融风险、"
            "深化金融改革、服务实体经济三大主线展开。主要政策要点包括："
            "1）券商净资本充足率不低于150%；2）系统重要性银行附加资本要求提高至2.5%；"
            "3）注册制深化改革持续推进，退市新规实施后全年退市公司达52家；"
            "4）金融科技监管框架基本成型，算法备案制度全面实施。"
            "建议密切关注政策变化对相关行业的影响。"
        ),
        "sources": [
            {
                "chunk_id": "chunk-pol1",
                "document_id": "doc-policy-2025",
                "document_name": "2025年金融监管政策汇编.md",
                "page_number": None,
                "content": "2025年金融监管政策重点围绕防范化解金融风险、深化金融改革...",
                "similarity": 0.93,
            },
            {
                "chunk_id": "chunk-pol2",
                "document_id": "doc-policy-2025",
                "document_name": "2025年金融监管政策汇编.md",
                "page_number": None,
                "content": "注册制深化改革持续推进。2025年全面实行注册制后的配套制度...",
                "similarity": 0.85,
            },
        ],
    },
    {
        "keywords": ["价值投资", "巴菲特", "护城河", "安全边际", "投资策略"],
        "answer": (
            "根据巴菲特致股东信解读笔记，价值投资的核心原则包括："
            "1）寻找具有持久竞争优势（护城河）的企业；"
            "2）以合理的价格买入优秀的企业；"
            "3）保持耐心，好的投资机会值得等待；"
            "4）在能力圈内做投资决策。护城河分为五种类型：无形资产、客户转换成本、"
            "网络效应、成本优势和规模优势。安全边际建议至少为25%，"
            "即买入价格不应超过内在价值的75%。"
        ),
        "sources": [
            {
                "chunk_id": "chunk-learn1",
                "document_id": "doc-learning-notes",
                "document_name": "价值投资学习笔记-巴菲特致股东信解读.txt",
                "page_number": None,
                "content": "巴菲特2024年致股东信核心要点：1）投资的核心是寻找具有持久竞争优势的企业...",
                "similarity": 0.96,
            },
            {
                "chunk_id": "chunk-learn2",
                "document_id": "doc-learning-notes",
                "document_name": "价值投资学习笔记-巴菲特致股东信解读.txt",
                "page_number": None,
                "content": "关于护城河理论：巴菲特将企业竞争优势分为五种类型...",
                "similarity": 0.91,
            },
        ],
    },
    {
        "keywords": ["半导体", "芯片", "AI芯片", "光刻机", "存储"],
        "answer": (
            "根据半导体行业市场分析报告，2025年半导体行业迎来新一轮景气周期，"
            "全球销售额预计达6,500亿美元，同比增长18%。AI芯片需求爆发式增长，"
            "英伟达数据中心GPU出货量同比增长120%。国产替代进程加速，"
            "半导体设备国产化率提升至35%。投资建议关注三条主线："
            "1）AI芯片设计龙头；2）半导体设备国产替代；3）存储芯片周期反转。"
            "需注意地缘政治风险和产能过剩风险。"
        ),
        "sources": [
            {
                "chunk_id": "chip-s1",
                "document_id": "doc-semi-analysis",
                "document_name": "半导体芯片行业市场分析与投资策略.pptx",
                "page_number": 1,
                "content": "2025年半导体行业迎来新一轮景气周期。全球半导体销售额预计达到6,500亿美元...",
                "similarity": 0.94,
            },
            {
                "chunk_id": "chip-s2",
                "document_id": "doc-semi-analysis",
                "document_name": "半导体芯片行业市场分析与投资策略.pptx",
                "page_number": 3,
                "content": "AI芯片市场格局分析：英伟达凭借H100/B200系列GPU占据数据中心AI训练市场85%的份额...",
                "similarity": 0.88,
            },
        ],
    },
]


class RetrieverService:
    """RAG 检索服务类，提供 Mock 向量检索功能"""

    def __init__(self) -> None:
        """初始化检索服务"""
        self._qa_pairs: list[dict] = MOCK_QA_PAIRS.copy()

    def retrieve(self, query: str, top_k: int = 5, category: Optional[str] = None) -> List[RetrievalResult]:
        """根据查询检索相关文档片段（Mock 实现）

        在实际生产环境中，该流程为：
        1. 使用 embedding_service.embed_query(query) 将查询向量化
        2. 在向量数据库中进行相似度搜索（如 Milvus、Pinecone、Weaviate）
        3. 返回 top_k 个最相关的文档片段

        Args:
            query: 查询文本
            top_k: 返回结果数量
            category: 限定检索的文档分类

        Returns:
            检索结果列表，按相似度降序排列
        """
        # 模拟检索延迟
        time.sleep(0.05)

        # 根据查询关键词匹配 Mock Q&A 对
        matched_results: List[RetrievalResult] = []
        for qa in self._qa_pairs:
            match_score = 0
            for keyword in qa["keywords"]:
                if keyword in query:
                    match_score += 1
            if match_score > 0:
                for source in qa["sources"]:
                    # 如果指定了分类，检查是否匹配
                    if category and category not in source["document_name"]:
                        continue
                    # 添加轻微随机扰动模拟真实检索
                    similarity = source["similarity"] + random.uniform(-0.03, 0.03)
                    similarity = min(1.0, max(0.0, similarity))
                    matched_results.append(RetrievalResult(
                        chunk_id=source["chunk_id"],
                        document_id=source["document_id"],
                        document_name=source["document_name"],
                        page_number=source.get("page_number"),
                        content=source["content"],
                        similarity=round(similarity, 4),
                    ))

        # 如果没有匹配到任何 Q&A 对，返回通用 Mock 结果
        if not matched_results:
            matched_results = self._generate_fallback_results(query, top_k)

        # 按相似度降序排列，返回 top_k 个结果
        matched_results.sort(key=lambda x: x.similarity, reverse=True)
        return matched_results[:top_k]

    def answer(self, query: str, top_k: int = 5, category: Optional[str] = None) -> RAGAnswer:
        """基于 RAG 检索生成回答（Mock 实现）

        在实际生产环境中，该流程为：
        1. 调用 retrieve() 获取相关文档片段
        2. 将检索结果作为上下文，构造 prompt
        3. 调用 LLM（如 DeepSeek、GPT-4）生成回答
        4. 返回回答及引用来源

        Args:
            query: 查询文本
            top_k: 返回结果数量
            category: 限定检索的文档分类

        Returns:
            RAG 回答结果
        """
        start_time = time.time()

        # 执行检索
        sources = self.retrieve(query, top_k, category)

        # 根据检索结果匹配最佳 Q&A 回答
        answer = self._generate_answer(query, sources)

        response_time = time.time() - start_time

        return RAGAnswer(
            answer=answer,
            sources=sources,
            retrieval_count=len(sources),
            response_time=round(response_time, 3),
        )

    def _generate_answer(self, query: str, sources: List[RetrievalResult]) -> str:
        """根据查询和检索结果生成 Mock 回答"""
        # 尝试匹配预置 Q&A
        for qa in self._qa_pairs:
            for keyword in qa["keywords"]:
                if keyword in query:
                    return qa["answer"]

        # 无匹配时生成通用回答
        if sources:
            source_names = list(set(s.document_name for s in sources))
            return (
                f"根据知识库中 {', '.join(source_names)} 等文档的分析，"
                f"关于'{query}'的问题，建议您从以下几个维度进行考量："
                f"1）行业发展趋势与政策环境；"
                f"2）公司基本面与财务指标；"
                f"3）估值水平与市场情绪。"
                f"以上分析仅供参考，不构成投资建议。"
            )
        return (
            f"抱歉，知识库中暂未找到与'{query}'高度相关的内容。"
            f"建议您尝试更具体的查询关键词，或上传相关文档以丰富知识库。"
        )

    def _generate_fallback_results(self, query: str, top_k: int) -> List[RetrievalResult]:
        """生成兜底的 Mock 检索结果"""
        fallback_docs = [
            ("doc-report-2024", "2024年A股市场年度报告.pdf", "pdf"),
            ("doc-ev-research", "新能源汽车行业深度研究报告.docx", "docx"),
            ("doc-policy-2025", "2025年金融监管政策汇编.md", "md"),
            ("doc-learning-notes", "价值投资学习笔记-巴菲特致股东信解读.txt", "txt"),
            ("doc-semi-analysis", "半导体芯片行业市场分析与投资策略.pptx", "pptx"),
        ]
        results: List[RetrievalResult] = []
        for i, (doc_id, doc_name, content_type) in enumerate(fallback_docs[:top_k]):
            similarity = round(0.5 + random.uniform(0, 0.3), 4)
            results.append(RetrievalResult(
                chunk_id=f"chunk-fallback-{i}",
                document_id=doc_id,
                document_name=doc_name,
                page_number=1 if content_type == "pdf" else None,
                content=f"[知识库检索结果] 在{doc_name}中找到了与'{query}'可能相关的内容片段...",
                similarity=similarity,
            ))
        return results


# 全局单例实例
retriever_service = RetrieverService()
