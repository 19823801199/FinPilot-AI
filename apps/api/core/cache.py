# -*- coding: utf-8 -*-
"""FinPilot AI API - 简单内存缓存模块 (Sprint 7)"""

import time
from typing import Any, Dict, Optional, Tuple


class SimpleCache:
    """基于内存的键值缓存，支持 TTL（生存时间）。"""

    def __init__(self, ttl: int = 300) -> None:
        """
        Args:
            ttl: 默认缓存生存时间（秒），默认 300 秒（5 分钟）。
        """
        self._data: Dict[str, Tuple[Any, float]] = {}
        self._ttl = ttl

    def get(self, key: str) -> Optional[Any]:
        """获取缓存值，若已过期则返回 None 并删除。

        Args:
            key: 缓存键。

        Returns:
            缓存值，或 None（不存在/已过期）。
        """
        if key not in self._data:
            return None

        value, expiry = self._data[key]
        if time.time() > expiry:
            del self._data[key]
            return None

        return value

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """设置缓存值。

        Args:
            key: 缓存键。
            value: 缓存值。
            ttl: 可选的自定义 TTL（秒），默认使用实例初始化时的 TTL。
        """
        effective_ttl = ttl if ttl is not None else self._ttl
        expiry = time.time() + effective_ttl
        self._data[key] = (value, expiry)

    def delete(self, key: str) -> bool:
        """删除指定缓存键。

        Args:
            key: 缓存键。

        Returns:
            是否成功删除（键是否存在）。
        """
        if key in self._data:
            del self._data[key]
            return True
        return False

    def clear(self) -> None:
        """清空所有缓存。"""
        self._data.clear()

    def keys(self) -> list:
        """返回当前所有未过期的键列表。"""
        now = time.time()
        valid_keys = [k for k, (_, expiry) in self._data.items() if now <= expiry]
        return valid_keys

    def __len__(self) -> int:
        """返回当前未过期的缓存项数量。"""
        now = time.time()
        return sum(1 for _, expiry in self._data.values() if now <= expiry)


# ------------------------------------------------------------------ #
# 全局缓存实例
# ------------------------------------------------------------------ #

# AI 对话缓存（5 分钟）
ai_cache = SimpleCache(ttl=300)

# Embedding 缓存（10 分钟）
embedding_cache = SimpleCache(ttl=600)

# 股票数据缓存（1 分钟）
stock_cache = SimpleCache(ttl=60)

# 文档缓存（1 小时）
document_cache = SimpleCache(ttl=3600)
