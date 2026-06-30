# -*- coding: utf-8 -*-
"""FinPilot AI API - 日志模块 (Sprint 7)"""

import logging
import sys
from datetime import datetime

# 创建 logger 实例
logger = logging.getLogger("finpilot")
logger.setLevel(logging.INFO)

# 避免重复添加 handler（在模块热重载时）
if not logger.handlers:
    handler = logging.StreamHandler(sys.stdout)
    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)

    # 同时写入文件（可选）
    try:
        file_handler = logging.FileHandler("logs/finpilot.log", encoding="utf-8")
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    except OSError:
        # logs 目录可能不存在，忽略文件日志
        pass
