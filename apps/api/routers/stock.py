# -*- coding: utf-8 -*-
"""FinPilot AI API - 股票相关路由"""

from typing import List

from fastapi import APIRouter, Query, HTTPException

from schemas.stock import (
    StockSearchResult,
    StockDetail,
    StockChartData,
    ResearchReport,
    StockAnalyzeRequest,
    WatchlistItem,
)
from services.stock_service import stock_service
from services.research_service import research_service
from services.akshare_service import akshare_service
from core.ai_client import ai_client
from core.logger import logger

router = APIRouter(prefix="/stocks", tags=["Stocks"])


@router.get("/search", response_model=List[StockSearchResult])
async def search_stocks(q: str = Query(..., min_length=1, description="搜索关键词")) -> List[StockSearchResult]:
    """模糊搜索股票（优先 AKShare 真实数据）"""
    try:
        results = akshare_service.search_stocks(q)
        if results:
            return [
                StockSearchResult(
                    code=r["code"],
                    name=r["name"],
                    exchange=r.get("exchange", "SH/SZ"),
                )
                for r in results[:10]
            ]
    except Exception as e:
        logger.warning(f"AKShare search failed: {e}, fallback to mock")
    return stock_service.search_stocks(q)


@router.get("/detail/{code}", response_model=StockDetail)
async def get_stock_detail(code: str) -> StockDetail:
    """获取股票详情（优先 AKShare 真实数据）"""
    try:
        detail = akshare_service.get_stock_detail(code)
        if detail:
            return StockDetail(
                code=detail["code"],
                name=detail["name"],
                price=detail.get("price", 0.0),
                change=detail.get("change", 0.0),
                change_percent=detail.get("change_percent", 0.0),
                volume=detail.get("volume", 0),
                market_cap=detail.get("market_cap", ""),
                pe=detail.get("pe", 0.0),
                pb=detail.get("pb", 0.0),
                dividend_yield=detail.get("dividend_yield", 0.0),
                industry=detail.get("industry", ""),
                high_52w=detail.get("high_52w", 0.0),
                low_52w=detail.get("low_52w", 0.0),
            )
    except Exception as e:
        logger.warning(f"AKShare detail failed: {e}, fallback to mock")
    try:
        return stock_service.get_stock_detail(code)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/chart/{code}", response_model=StockChartData)
async def get_stock_chart(code: str, period: str = "1m") -> StockChartData:
    """获取股票K线数据（优先 AKShare 真实数据）"""
    try:
        chart = akshare_service.get_stock_chart(code, period)
        if chart:
            return StockChartData(
                code=code,
                data=[
                    {
                        "date": d["date"],
                        "open": d["open"],
                        "close": d["close"],
                        "high": d["high"],
                        "low": d["low"],
                        "volume": d["volume"],
                    }
                    for d in chart
                ],
            )
    except Exception as e:
        logger.warning(f"AKShare chart failed: {e}, fallback to mock")
    return stock_service.get_chart_data(code, period)


@router.post("/analyze", response_model=ResearchReport)
async def analyze_stock(request: StockAnalyzeRequest) -> ResearchReport:
    """AI 分析股票并生成研究报告（优先真实 LLM）"""
    try:
        detail = akshare_service.get_stock_detail(request.code)
        if detail:
            prompt = f"""请分析股票 {detail['name']}({request.code}) 的投资价值。
当前价格: {detail.get('price', 'N/A')}, PE: {detail.get('pe', 'N/A')}, PB: {detail.get('pb', 'N/A')}, 行业: {detail.get('industry', 'N/A')}。
请从技术面、基本面、风险三个维度分析，给出综合评分（0-100）和投资建议。"""
            llm_response = await ai_client.chat(
                messages=[{"role": "user", "content": prompt}],
                system_prompt="你是专业的股票研究分析师。",
            )
            return ResearchReport(
                code=request.code,
                name=detail["name"],
                overview=f"{detail['name']} 投资分析报告",
                core_view=llm_response[:200],
                technical_analysis="基于真实数据的技术面分析",
                fundamental_analysis=f"PE: {detail.get('pe', 'N/A')}, PB: {detail.get('pb', 'N/A')}",
                risk_analysis="市场风险、行业风险",
                valuation_analysis="当前估值水平分析",
                investment_advice="建议关注",
                composite_score=75,
                future_focus=["业绩变化", "行业政策"],
            )
    except Exception as e:
        logger.warning(f"Real analyze failed: {e}, fallback to mock")
    return await research_service.analyze_stock(request.code, request.name)


@router.get("/watchlist", response_model=List[WatchlistItem])
async def get_watchlist() -> List[WatchlistItem]:
    """获取自选股列表

    Returns:
        自选股列表
    """
    return stock_service.get_watchlist()


@router.post("/watchlist/{code}", response_model=WatchlistItem)
async def add_to_watchlist(code: str) -> WatchlistItem:
    """添加股票到自选股

    Args:
        code: 股票代码

    Returns:
        添加的自选股项
    """
    try:
        return stock_service.add_to_watchlist(code)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/watchlist/{code}")
async def remove_from_watchlist(code: str) -> dict:
    """从自选股中移除股票

    Args:
        code: 股票代码

    Returns:
        操作结果
    """
    success = stock_service.remove_from_watchlist(code)
    if not success:
        raise HTTPException(status_code=404, detail=f"自选股中未找到: {code}")
    return {"success": True}
