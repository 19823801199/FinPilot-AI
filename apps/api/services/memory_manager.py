# -*- coding: utf-8 -*-
"""记忆管理服务 - Memory Manager"""

import uuid
from datetime import datetime, timezone
from typing import Dict, List, Optional

from schemas.agent import AgentRole, MemoryEntry


class MemoryManager:
    """记忆管理器（全局单例）

    管理短期记忆、长期记忆与用户偏好。
    """

    _instance: Optional["MemoryManager"] = None

    def __new__(cls) -> "MemoryManager":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self) -> None:
        if self._initialized:
            return
        self._memories: Dict[str, MemoryEntry] = {}
        self._init_default_memories()
        self._initialized = True

    def _now(self) -> str:
        """获取当前 ISO 格式时间"""
        return datetime.now(timezone.utc).isoformat()

    def _init_default_memories(self) -> None:
        """初始化 3 条预置记忆"""
        defaults = [
            MemoryEntry(
                id=str(uuid.uuid4()),
                type="preference",
                content="用户偏好：回答风格偏好结构化 Markdown 格式，喜欢包含数据表格与公式推导的详细解释",
                agent_role=None,
                created_at=self._now(),
                relevance_score=0.95,
            ),
            MemoryEntry(
                id=str(uuid.uuid4()),
                type="long_term",
                content="长期记忆：用户正在备考 431 金融学综合，重点关注公司理财、投资学与货币银行学三大模块",
                agent_role=AgentRole.LEARNING,
                created_at=self._now(),
                relevance_score=0.88,
            ),
            MemoryEntry(
                id=str(uuid.uuid4()),
                type="short_term",
                content="短期记忆：用户最近频繁查询贵州茅台相关股票分析与研报总结，对白酒行业投资兴趣浓厚",
                agent_role=AgentRole.RESEARCH,
                created_at=self._now(),
                relevance_score=0.82,
            ),
        ]
        for mem in defaults:
            self._memories[mem.id] = mem

    def add_memory(
        self,
        content: str,
        memory_type: str,
        agent_role: Optional[AgentRole] = None,
        relevance_score: Optional[float] = None,
    ) -> MemoryEntry:
        """添加记忆条目"""
        entry = MemoryEntry(
            id=str(uuid.uuid4()),
            type=memory_type,
            content=content,
            agent_role=agent_role,
            created_at=self._now(),
            relevance_score=relevance_score,
        )
        self._memories[entry.id] = entry
        return entry

    def get_memories(self, memory_type: Optional[str] = None) -> List[MemoryEntry]:
        """获取记忆列表，可按类型过滤"""
        memories = list(self._memories.values())
        if memory_type:
            memories = [m for m in memories if m.type == memory_type]
        return memories

    def get_relevant_memories(
        self,
        query: str,
        top_k: int = 5,
        agent_role: Optional[AgentRole] = None,
    ) -> List[MemoryEntry]:
        """获取与查询相关的记忆（基于简单关键词匹配与相关性评分排序）"""
        memories = list(self._memories.values())

        # 按角色过滤
        if agent_role:
            memories = [m for m in memories if m.agent_role == agent_role or m.agent_role is None]

        # 简单关键词匹配评分
        query_lower = query.lower()
        scored = []
        for m in memories:
            score = m.relevance_score or 0.5
            content_lower = m.content.lower()
            # 关键词匹配加分
            for word in query_lower.split():
                if len(word) > 1 and word in content_lower:
                    score += 0.1
            scored.append((score, m))

        scored.sort(key=lambda x: x[0], reverse=True)
        return [m for _, m in scored[:top_k]]

    def delete_memory(self, memory_id: str) -> bool:
        """删除记忆条目"""
        if memory_id in self._memories:
            del self._memories[memory_id]
            return True
        return False


# 全局单例
memory_manager = MemoryManager()
