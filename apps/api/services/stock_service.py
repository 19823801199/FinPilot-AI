# -*- coding: utf-8 -*-
"""FinPilot AI API - 股票数据服务模块"""

import random
import uuid
from datetime import datetime, timedelta
from typing import List, Optional

from schemas.stock import StockSearchResult, StockDetail, StockChartData, PricePoint, WatchlistItem


# Mock 股票池（至少 10 只）
MOCK_STOCKS: list[dict] = [
    {
        "code": "600519.SH",
        "name": "贵州茅台",
        "exchange": "上海证券交易所",
        "industry": "白酒",
        "price": 1688.88,
        "change": 12.50,
        "change_percent": 0.75,
        "volume": "2.35万手",
        "market_cap": "2.12万亿",
        "pe": 28.5,
        "pb": 8.2,
        "high_52w": 1888.00,
        "low_52w": 1388.00,
        "avg_volume": "3.12万手",
        "dividend_yield": 1.52,
    },
    {
        "code": "300750.SZ",
        "name": "宁德时代",
        "exchange": "深圳证券交易所",
        "industry": "动力电池",
        "price": 215.60,
        "change": 5.30,
        "change_percent": 2.52,
        "volume": "15.68万手",
        "market_cap": "9475亿",
        "pe": 22.3,
        "pb": 5.8,
        "high_52w": 268.00,
        "low_52w": 148.00,
        "avg_volume": "18.45万手",
        "dividend_yield": 0.85,
    },
    {
        "code": "002594.SZ",
        "name": "比亚迪",
        "exchange": "深圳证券交易所",
        "industry": "新能源汽车",
        "price": 268.50,
        "change": -3.20,
        "change_percent": -1.18,
        "volume": "12.35万手",
        "market_cap": "7812亿",
        "pe": 25.6,
        "pb": 4.9,
        "high_52w": 318.00,
        "low_52w": 168.00,
        "avg_volume": "14.22万手",
        "dividend_yield": 0.65,
    },
    {
        "code": "00700.HK",
        "name": "腾讯控股",
        "exchange": "香港交易所",
        "industry": "互联网",
        "price": 388.20,
        "change": 6.80,
        "change_percent": 1.78,
        "volume": "28.56万手",
        "market_cap": "3.68万亿港元",
        "pe": 18.5,
        "pb": 3.8,
        "high_52w": 468.00,
        "low_52w": 268.00,
        "avg_volume": "32.15万手",
        "dividend_yield": 0.92,
    },
    {
        "code": "09988.HK",
        "name": "阿里巴巴",
        "exchange": "香港交易所",
        "industry": "电子商务",
        "price": 88.65,
        "change": -1.35,
        "change_percent": -1.50,
        "volume": "45.32万手",
        "market_cap": "1.82万亿港元",
        "pe": 15.2,
        "pb": 1.6,
        "high_52w": 118.00,
        "low_52w": 62.50,
        "avg_volume": "52.18万手",
        "dividend_yield": 1.25,
    },
    {
        "code": "000333.SZ",
        "name": "美的集团",
        "exchange": "深圳证券交易所",
        "industry": "家电",
        "price": 72.35,
        "change": 0.85,
        "change_percent": 1.19,
        "volume": "8.56万手",
        "market_cap": "5068亿",
        "pe": 14.8,
        "pb": 3.2,
        "high_52w": 88.00,
        "low_52w": 48.00,
        "avg_volume": "10.12万手",
        "dividend_yield": 3.85,
    },
    {
        "code": "000858.SZ",
        "name": "五粮液",
        "exchange": "深圳证券交易所",
        "industry": "白酒",
        "price": 145.20,
        "change": 2.10,
        "change_percent": 1.47,
        "volume": "6.78万手",
        "market_cap": "5635亿",
        "pe": 18.2,
        "pb": 4.5,
        "high_52w": 188.00,
        "low_52w": 108.00,
        "avg_volume": "8.35万手",
        "dividend_yield": 2.35,
    },
    {
        "code": "601318.SH",
        "name": "中国平安",
        "exchange": "上海证券交易所",
        "industry": "保险",
        "price": 48.65,
        "change": -0.35,
        "change_percent": -0.71,
        "volume": "22.15万手",
        "market_cap": "8885亿",
        "pe": 8.5,
        "pb": 0.92,
        "high_52w": 58.00,
        "low_52w": 32.00,
        "avg_volume": "28.56万手",
        "dividend_yield": 5.85,
    },
    {
        "code": "600036.SH",
        "name": "招商银行",
        "exchange": "上海证券交易所",
        "industry": "银行",
        "price": 35.80,
        "change": 0.25,
        "change_percent": 0.70,
        "volume": "18.92万手",
        "market_cap": "9025亿",
        "pe": 5.8,
        "pb": 0.88,
        "high_52w": 42.00,
        "low_52w": 28.00,
        "avg_volume": "22.35万手",
        "dividend_yield": 6.25,
    },
    {
        "code": "600030.SH",
        "name": "中信证券",
        "exchange": "上海证券交易所",
        "industry": "证券",
        "price": 22.85,
        "change": 0.45,
        "change_percent": 2.01,
        "volume": "35.68万手",
        "market_cap": "3385亿",
        "pe": 16.5,
        "pb": 1.35,
        "high_52w": 32.00,
        "low_52w": 16.00,
        "avg_volume": "42.15万手",
        "dividend_yield": 2.85,
    },
]


class StockService:
    """股票数据服务类，提供 Mock 股票数据查询与管理"""

    def __init__(self) -> None:
        """初始化股票服务，加载 Mock 股票池与自选股列表"""
        self._stocks: list[dict] = MOCK_STOCKS.copy()
        self._watchlist: list[dict] = []
        # 预置一些默认自选股
        self._watchlist.append({
            "code": "600519.SH",
            "name": "贵州茅台",
            "price": 1688.88,
            "change_percent": 0.75,
            "added_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        })
        self._watchlist.append({
            "code": "300750.SZ",
            "name": "宁德时代",
            "price": 215.60,
            "change_percent": 2.52,
            "added_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        })

    def search_stocks(self, query: str) -> list[StockSearchResult]:
        """模糊搜索股票

        Args:
            query: 搜索关键词（股票代码或名称）

        Returns:
            匹配的股票搜索结果列表
        """
        query_lower = query.lower()
        results: list[StockSearchResult] = []
        for stock in self._stocks:
            if query_lower in stock["code"].lower() or query_lower in stock["name"]:
                results.append(StockSearchResult(
                    code=stock["code"],
                    name=stock["name"],
                    exchange=stock["exchange"],
                    industry=stock["industry"],
                    market_cap=stock.get("market_cap"),
                ))
        return results

    def get_stock_detail(self, code: str) -> StockDetail:
        """获取股票详情

        Args:
            code: 股票代码

        Returns:
            股票详情数据

        Raises:
            ValueError: 股票代码不存在时抛出
        """
        for stock in self._stocks:
            if stock["code"] == code:
                return StockDetail(
                    code=stock["code"],
                    name=stock["name"],
                    exchange=stock["exchange"],
                    industry=stock["industry"],
                    price=stock["price"],
                    change=stock["change"],
                    change_percent=stock["change_percent"],
                    volume=stock["volume"],
                    market_cap=stock["market_cap"],
                    pe=stock.get("pe"),
                    pb=stock.get("pb"),
                    high_52w=stock.get("high_52w"),
                    low_52w=stock.get("low_52w"),
                    avg_volume=stock.get("avg_volume"),
                    dividend_yield=stock.get("dividend_yield"),
                )
        raise ValueError(f"未找到股票代码: {code}")

    def get_chart_data(self, code: str, period: str = "1m") -> StockChartData:
        """获取股票K线数据

        Args:
            code: 股票代码
            period: 时间周期，默认1个月

        Returns:
            股票K线数据
        """
        # 获取基准价格
        base_price = 100.0
        for stock in self._stocks:
            if stock["code"] == code:
                base_price = stock["price"]
                break

        # 生成30天随机K线数据
        data_points: list[PricePoint] = []
        current_price = base_price * 0.92  # 从略低于当前价开始
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)

        for i in range(30):
            date = start_date + timedelta(days=i)
            # 跳过周末
            if date.weekday() >= 5:
                continue

            # 模拟价格波动 (-3% ~ +3%)
            change = random.uniform(-0.03, 0.03)
            open_price = round(current_price, 2)
            close_price = round(current_price * (1 + change), 2)
            high_price = round(max(open_price, close_price) * (1 + random.uniform(0, 0.015)), 2)
            low_price = round(min(open_price, close_price) * (1 - random.uniform(0, 0.015)), 2)
            volume = int(random.uniform(50000, 500000))

            data_points.append(PricePoint(
                date=date.strftime("%Y-%m-%d"),
                open=open_price,
                high=high_price,
                low=low_price,
                close=close_price,
                volume=volume,
            ))
            current_price = close_price

        return StockChartData(
            code=code,
            period=period,
            data=data_points,
        )

    def get_watchlist(self) -> list[WatchlistItem]:
        """获取自选股列表

        Returns:
            自选股列表
        """
        return [WatchlistItem(
            code=item["code"],
            name=item["name"],
            price=item["price"],
            change_percent=item["change_percent"],
            added_at=item["added_at"],
        ) for item in self._watchlist]

    def add_to_watchlist(self, code: str) -> WatchlistItem:
        """添加股票到自选股

        Args:
            code: 股票代码

        Returns:
            添加的自选股项

        Raises:
            ValueError: 股票代码不存在或已在自选股中时抛出
        """
        # 检查是否已在自选股
        for item in self._watchlist:
            if item["code"] == code:
                raise ValueError(f"股票 {code} 已在自选股中")

        # 查找股票信息
        stock: Optional[dict] = None
        for s in self._stocks:
            if s["code"] == code:
                stock = s
                break

        if stock is None:
            raise ValueError(f"未找到股票代码: {code}")

        watchlist_item = {
            "code": stock["code"],
            "name": stock["name"],
            "price": stock["price"],
            "change_percent": stock["change_percent"],
            "added_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }
        self._watchlist.append(watchlist_item)
        return WatchlistItem(
            code=watchlist_item["code"],
            name=watchlist_item["name"],
            price=watchlist_item["price"],
            change_percent=watchlist_item["change_percent"],
            added_at=watchlist_item["added_at"],
        )

    def remove_from_watchlist(self, code: str) -> bool:
        """从自选股中移除股票

        Args:
            code: 股票代码

        Returns:
            是否成功移除
        """
        for i, item in enumerate(self._watchlist):
            if item["code"] == code:
                self._watchlist.pop(i)
                return True
        return False


# 全局单例实例
stock_service = StockService()
