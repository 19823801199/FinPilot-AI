# -*- coding: utf-8 -*-
"""FinPilot AI API - 股票相关 Schema"""

from pydantic import BaseModel, Field
from typing import Optional, List


class StockSearchResult(BaseModel):
    """股票搜索结果模型"""

    code: str = Field(..., description="股票代码")
    name: str = Field(..., description="股票名称")
    exchange: str = Field(..., description="交易所")
    industry: str = Field(..., description="所属行业")
    market_cap: Optional[str] = Field(None, description="市值")


class StockDetail(BaseModel):
    """股票详情模型"""

    code: str = Field(..., description="股票代码")
    name: str = Field(..., description="股票名称")
    exchange: str = Field(..., description="交易所")
    industry: str = Field(..., description="所属行业")
    price: float = Field(..., description="当前价格")
    change: float = Field(..., description="涨跌额")
    change_percent: float = Field(..., description="涨跌幅(%)")
    volume: str = Field(..., description="成交量")
    market_cap: str = Field(..., description="市值")
    pe: Optional[float] = Field(None, description="市盈率")
    pb: Optional[float] = Field(None, description="市净率")
    high_52w: Optional[float] = Field(None, description="52周最高价")
    low_52w: Optional[float] = Field(None, description="52周最低价")
    avg_volume: Optional[str] = Field(None, description="平均成交量")
    dividend_yield: Optional[float] = Field(None, description="股息率(%)")


class PricePoint(BaseModel):
    """K线数据点模型"""

    date: str = Field(..., description="日期")
    open: float = Field(..., description="开盘价")
    high: float = Field(..., description="最高价")
    low: float = Field(..., description="最低价")
    close: float = Field(..., description="收盘价")
    volume: int = Field(..., description="成交量")


class StockChartData(BaseModel):
    """股票K线数据模型"""

    code: str = Field(..., description="股票代码")
    period: str = Field(..., description="时间周期")
    data: List[PricePoint] = Field(..., description="K线数据列表")


class ResearchStep(BaseModel):
    """研究工作流步骤模型"""

    id: str = Field(..., description="步骤ID")
    label: str = Field(..., description="步骤名称")
    status: str = Field(..., description="步骤状态: pending, running, done, error")


class ResearchReport(BaseModel):
    """个股研究报告模型"""

    stock_code: str = Field(..., description="股票代码")
    stock_name: str = Field(..., description="股票名称")
    overview: str = Field(..., description="公司概况")
    core_view: str = Field(..., description="核心观点")
    technical_analysis: str = Field(..., description="技术分析")
    fundamental_analysis: str = Field(..., description="基本面分析")
    risk_analysis: str = Field(..., description="风险分析")
    valuation_analysis: str = Field(..., description="估值分析")
    investment_advice: str = Field(..., description="投资建议")
    composite_score: int = Field(..., ge=0, le=100, description="综合评分 0-100")
    key_points: List[str] = Field(..., description="关键要点列表")
    workflow_steps: List[ResearchStep] = Field(..., description="工作流步骤状态")
    generated_at: str = Field(..., description="报告生成时间")


class StockAnalyzeRequest(BaseModel):
    """股票分析请求模型"""

    code: str = Field(..., description="股票代码")
    name: Optional[str] = Field(None, description="股票名称(可选)")


class WatchlistItem(BaseModel):
    """自选股模型"""

    code: str = Field(..., description="股票代码")
    name: str = Field(..., description="股票名称")
    price: float = Field(..., description="当前价格")
    change_percent: float = Field(..., description="涨跌幅(%)")
    added_at: str = Field(..., description="添加时间")
