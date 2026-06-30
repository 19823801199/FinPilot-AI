# -*- coding: utf-8 -*-
"""Alembic 环境配置 - 支持异步迁移"""

import asyncio
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context

# 导入 Base 以便 autogenerate 能检测到所有模型
from database.base import Base

# Alembic Config 对象
config = context.config

# 设置 Python 日志
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# MetaData 目标，用于 autogenerate
target_metadata = Base.metadata

# 从 alembic.ini 覆盖 sqlalchemy.url（支持从环境变量读取）
# 如果需要从环境变量读取，可以取消下面的注释：
# import os
# from core.config import settings
# config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)


def run_migrations_offline() -> None:
    """以 'offline' 模式运行迁移。

    仅需要配置调用 context.execute() 的回调即可。
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection):
    """执行迁移操作"""
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """以异步模式运行迁移"""
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    """以 'online' 模式运行迁移（异步）"""
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
