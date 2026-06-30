# -*- coding: utf-8 -*-
"""FinPilot AI API - 配置管理模块 (Sprint 7)"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """应用配置，支持从环境变量和 .env 文件加载"""

    # App
    APP_NAME: str = "FinPilot AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./finpilot.db"

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    # DeepSeek
    DEEPSEEK_API_KEY: str = ""
    DEEPSEEK_BASE_URL: str = "https://api.deepseek.com"
    DEEPSEEK_MODEL: str = "deepseek-chat"
    DEEPSEEK_TIMEOUT: int = 60
    DEEPSEEK_MAX_RETRIES: int = 3

    # ChromaDB
    CHROMADB_PATH: str = "./chroma_data"

    # JWT
    JWT_SECRET: str = "your_jwt_secret_here"
    JWT_EXPIRATION: int = 86400

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
    }


settings = Settings()
