# -*- coding: utf-8 -*-
"""FinPilot AI API - AKShare 股票数据服务模块"""

import time
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

from core.logger import logger

# 尝试导入 akshare，未安装时提供友好的 fallback
_akshare_available = False
try:
    import akshare as ak

    _akshare_available = True
except ImportError:
    logger.warning("akshare 未安装，AKShareService 将使用 Mock 数据")


class _StockCache:
    """简易内存缓存，用于缓存 AKShare 股票数据"""

    def __init__(self, default_ttl: int = 300) -> None:
        self._store: Dict[str, Any] = {}
        self._expires: Dict[str, float] = {}
        self._default_ttl = default_ttl

    def get(self, key: str) -> Any:
        """获取缓存值，过期时返回 None"""
        now = time.time()
        if key in self._store and self._expires.get(key, 0) > now:
            return self._store[key]
        return None

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """设置缓存值"""
        self._store[key] = value
        self._expires[key] = time.time() + (ttl if ttl is not None else self._default_ttl)

    def clear(self) -> None:
        """清空缓存"""
        self._store.clear()
        self._expires.clear()


# 全局缓存实例
stock_cache = _StockCache(default_ttl=300)


class AKShareService:
    """AKShare 股票数据服务类，提供 A 股搜索、详情、K线、热门股票及财务数据查询"""

    # 预置 Mock 股票池，用于 AKShare 调用失败时的 fallback
    _MOCK_STOCKS: List[Dict[str, Any]] = [
        {"code": "600519", "name": "贵州茅台", "exchange": "SH", "industry": "白酒"},
        {"code": "300750", "name": "宁德时代", "exchange": "SZ", "industry": "动力电池"},
        {"code": "002594", "name": "比亚迪", "exchange": "SZ", "industry": "新能源汽车"},
        {"code": "000333", "name": "美的集团", "exchange": "SZ", "industry": "家电"},
        {"code": "000858", "name": "五粮液", "exchange": "SZ", "industry": "白酒"},
        {"code": "601318", "name": "中国平安", "exchange": "SH", "industry": "保险"},
        {"code": "600036", "name": "招商银行", "exchange": "SH", "industry": "银行"},
        {"code": "600030", "name": "中信证券", "exchange": "SH", "industry": "证券"},
        {"code": "000001", "name": "平安银行", "exchange": "SZ", "industry": "银行"},
        {"code": "002415", "name": "海康威视", "exchange": "SZ", "industry": "电子"},
    ]

    def _is_akshare_ready(self) -> bool:
        """检查 akshare 是否可用"""
        return _akshare_available

    def _build_cache_key(self, method: str, *args: Any) -> str:
        """构造缓存 key"""
        parts = [method] + [str(a) for a in args]
        return "|".join(parts)

    def search_stocks(self, keyword: str) -> List[Dict]:
        """搜索股票，支持代码/名称/拼音匹配

        Args:
            keyword: 搜索关键词

        Returns:
            匹配的股票列表，最多返回前 10 条
        """
        cache_key = self._build_cache_key("search_stocks", keyword)
        cached = stock_cache.get(cache_key)
        if cached is not None:
            return cached

        if not self._is_akshare_ready():
            result = self._mock_search_stocks(keyword)
            stock_cache.set(cache_key, result)
            return result

        try:
            df = ak.stock_info_a_code_name()
            keyword_lower = keyword.lower()
            matches: List[Dict] = []
            for _, row in df.iterrows():
                code = str(row.get("code", ""))
                name = str(row.get("name", ""))
                if keyword_lower in code.lower() or keyword_lower in name.lower():
                    exchange = "SH" if code.startswith(("60", "68", "88", "11")) else "SZ"
                    matches.append({
                        "code": code,
                        "name": name,
                        "exchange": exchange,
                    })
                if len(matches) >= 10:
                    break
            stock_cache.set(cache_key, matches)
            return matches
        except Exception as exc:
            logger.warning(f"AKShare 搜索股票失败，使用 Mock 数据: {exc}")
            result = self._mock_search_stocks(keyword)
            stock_cache.set(cache_key, result)
            return result

    def _mock_search_stocks(self, keyword: str) -> List[Dict]:
        """Mock 股票搜索 fallback"""
        keyword_lower = keyword.lower()
        matches: List[Dict] = []
        for stock in self._MOCK_STOCKS:
            if (
                keyword_lower in stock["code"].lower()
                or keyword_lower in stock["name"].lower()
            ):
                matches.append({
                    "code": stock["code"],
                    "name": stock["name"],
                    "exchange": stock["exchange"],
                })
            if len(matches) >= 10:
                break
        return matches

    def get_stock_detail(self, code: str) -> Dict:
        """获取股票详情

        Args:
            code: 股票代码（如 600519）

        Returns:
            包含 name, code, price, change, volume, market_cap, pe, pb, industry 的字典
        """
        cache_key = self._build_cache_key("get_stock_detail", code)
        cached = stock_cache.get(cache_key)
        if cached is not None:
            return cached

        if not self._is_akshare_ready():
            result = self._mock_stock_detail(code)
            stock_cache.set(cache_key, result)
            return result

        try:
            df = ak.stock_individual_info_em(symbol=code)
            info: Dict[str, Any] = {}
            for _, row in df.iterrows():
                key = str(row.get("item", ""))
                value = row.get("value", "")
                info[key] = value

            result = {
                "name": info.get("股票简称", "未知"),
                "code": code,
                "price": float(info.get("最新价", 0)),
                "change": float(info.get("涨跌额", 0)),
                "volume": str(info.get("成交量", "0")),
                "market_cap": str(info.get("总市值", "0")),
                "pe": float(info.get("市盈率", 0)) if info.get("市盈率") else None,
                "pb": float(info.get("市净率", 0)) if info.get("市净率") else None,
                "industry": str(info.get("行业", "")),
            }
            stock_cache.set(cache_key, result)
            return result
        except Exception as exc:
            logger.warning(f"AKShare 获取股票详情失败，使用 Mock 数据: {exc}")
            result = self._mock_stock_detail(code)
            stock_cache.set(cache_key, result)
            return result

    def _mock_stock_detail(self, code: str) -> Dict:
        """Mock 股票详情 fallback"""
        for stock in self._MOCK_STOCKS:
            if stock["code"] == code:
                return {
                    "name": stock["name"],
                    "code": code,
                    "price": 100.0,
                    "change": 1.5,
                    "volume": "10.5万手",
                    "market_cap": "5000亿",
                    "pe": 20.0,
                    "pb": 3.0,
                    "industry": stock["industry"],
                }
        return {
            "name": "未知股票",
            "code": code,
            "price": 0.0,
            "change": 0.0,
            "volume": "0",
            "market_cap": "0",
            "pe": None,
            "pb": None,
            "industry": "",
        }

    def get_stock_chart(self, code: str, period: str = "daily") -> List[Dict]:
        """获取 K 线数据

        Args:
            code: 股票代码
            period: 周期，默认 daily（日K）

        Returns:
            K 线数据列表，每项包含 date, open, close, high, low, volume
        """
        cache_key = self._build_cache_key("get_stock_chart", code, period)
        cached = stock_cache.get(cache_key)
        if cached is not None:
            return cached

        if not self._is_akshare_ready():
            result = self._mock_stock_chart(code)
            stock_cache.set(cache_key, result)
            return result

        try:
            end_date = datetime.now().strftime("%Y%m%d")
            start_date = (datetime.now() - timedelta(days=90)).strftime("%Y%m%d")
            df = ak.stock_zh_a_hist(
                symbol=code,
                period="daily",
                start_date=start_date,
                end_date=end_date,
                adjust="qfq",
            )
            result: List[Dict] = []
            for _, row in df.iterrows():
                result.append({
                    "date": str(row.get("日期", "")),
                    "open": float(row.get("开盘", 0)),
                    "close": float(row.get("收盘", 0)),
                    "high": float(row.get("最高", 0)),
                    "low": float(row.get("最低", 0)),
                    "volume": int(row.get("成交量", 0)),
                })
            stock_cache.set(cache_key, result)
            return result
        except Exception as exc:
            logger.warning(f"AKShare 获取 K 线数据失败，使用 Mock 数据: {exc}")
            result = self._mock_stock_chart(code)
            stock_cache.set(cache_key, result)
            return result

    def _mock_stock_chart(self, code: str) -> List[Dict]:
        """Mock K 线数据 fallback"""
        import random

        base_price = 100.0
        result: List[Dict] = []
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)
        current_price = base_price * 0.95

        for i in range(30):
            date = start_date + timedelta(days=i)
            if date.weekday() >= 5:
                continue
            change = random.uniform(-0.03, 0.03)
            open_price = round(current_price, 2)
            close_price = round(current_price * (1 + change), 2)
            high_price = round(max(open_price, close_price) * (1 + random.uniform(0, 0.015)), 2)
            low_price = round(min(open_price, close_price) * (1 - random.uniform(0, 0.015)), 2)
            volume = int(random.uniform(50000, 500000))
            result.append({
                "date": date.strftime("%Y-%m-%d"),
                "open": open_price,
                "close": close_price,
                "high": high_price,
                "low": low_price,
                "volume": volume,
            })
            current_price = close_price
        return result

    def get_hot_stocks(self) -> List[Dict]:
        """获取热门股票

        Returns:
            前 10 条热门股票列表
        """
        cache_key = self._build_cache_key("get_hot_stocks")
        cached = stock_cache.get(cache_key)
        if cached is not None:
            return cached

        if not self._is_akshare_ready():
            result = self._mock_hot_stocks()
            stock_cache.set(cache_key, result)
            return result

        try:
            df = ak.stock_hot_rank_em()
            result: List[Dict] = []
            for _, row in df.head(10).iterrows():
                result.append({
                    "rank": int(row.get("排名", 0)),
                    "code": str(row.get("代码", "")),
                    "name": str(row.get("名称", "")),
                    "popularity": str(row.get("人气指数", "")),
                })
            stock_cache.set(cache_key, result)
            return result
        except Exception as exc:
            logger.warning(f"AKShare 获取热门股票失败，使用 Mock 数据: {exc}")
            result = self._mock_hot_stocks()
            stock_cache.set(cache_key, result)
            return result

    def _mock_hot_stocks(self) -> List[Dict]:
        """Mock 热门股票 fallback"""
        return [
            {"rank": 1, "code": s["code"], "name": s["name"], "popularity": f"{10000 - i * 500}"}
            for i, s in enumerate(self._MOCK_STOCKS[:10])
        ]

    def get_stock_financial(self, code: str) -> Dict:
        """获取财务指标

        Args:
            code: 股票代码

        Returns:
            主要财务数据字典
        """
        cache_key = self._build_cache_key("get_stock_financial", code)
        cached = stock_cache.get(cache_key)
        if cached is not None:
            return cached

        if not self._is_akshare_ready():
            result = self._mock_stock_financial(code)
            stock_cache.set(cache_key, result)
            return result

        try:
            df = ak.stock_financial_report_sina(stock=code)
            if df.empty:
                raise ValueError("财务数据为空")
            row = df.iloc[0]
            result = {
                "code": code,
                "report_date": str(row.get("报告期", "")),
                "revenue": str(row.get("营业收入", "")),
                "net_profit": str(row.get("净利润", "")),
                "eps": float(row.get("每股收益", 0)) if "每股收益" in row else None,
                "roe": float(row.get("净资产收益率", 0)) if "净资产收益率" in row else None,
                "gross_margin": float(row.get("毛利率", 0)) if "毛利率" in row else None,
            }
            stock_cache.set(cache_key, result)
            return result
        except Exception as exc:
            logger.warning(f"AKShare 获取财务指标失败，使用 Mock 数据: {exc}")
            result = self._mock_stock_financial(code)
            stock_cache.set(cache_key, result)
            return result

    def _mock_stock_financial(self, code: str) -> Dict:
        """Mock 财务指标 fallback"""
        for stock in self._MOCK_STOCKS:
            if stock["code"] == code:
                return {
                    "code": code,
                    "report_date": "2024-12-31",
                    "revenue": "150.5亿",
                    "net_profit": "35.2亿",
                    "eps": 3.5,
                    "roe": 18.5,
                    "gross_margin": 45.0,
                }
        return {
            "code": code,
            "report_date": "",
            "revenue": "0",
            "net_profit": "0",
            "eps": None,
            "roe": None,
            "gross_margin": None,
        }


# 全局单例实例
akshare_service = AKShareService()
