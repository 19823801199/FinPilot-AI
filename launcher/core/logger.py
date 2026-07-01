# -*- coding: utf-8 -*-
"""FinPilot AI Launcher - Cross-platform ANSI Color Logger"""

import sys
import os

# Windows ANSI color support
if sys.platform == "win32":
    try:
        import ctypes
        kernel32 = ctypes.windll.kernel32
        # ENABLE_VIRTUAL_TERMINAL_PROCESSING = 0x0004
        kernel32.SetConsoleMode(kernel32.GetStdHandle(-11), 0x0004 | 0x0001)
    except Exception:
        pass


class Colors:
    RESET   = "\033[0m"
    BOLD    = "\033[1m"
    DIM     = "\033[2m"

    RED     = "\033[91m"
    GREEN   = "\033[92m"
    YELLOW  = "\033[93m"
    BLUE    = "\033[94m"
    MAGENTA = "\033[95m"
    CYAN    = "\033[96m"
    WHITE   = "\033[97m"
    GRAY    = "\033[90m"

    BG_RED     = "\033[41m"
    BG_GREEN   = "\033[42m"


class Logger:
    """Unified logger with ANSI colors and log levels."""

    def __init__(self, verbose: bool = False):
        self.verbose = verbose
        self._errors = 0
        self._warnings = 0
        self._successes = 0

    @property
    def stats(self) -> dict:
        return {
            "errors": self._errors,
            "warnings": self._warnings,
            "successes": self._successes,
        }

    def _print(self, level: str, color: str, msg: str):
        prefix = f"{color}[{level}]{Colors.RESET}"
        print(f"  {prefix} {msg}")

    def info(self, msg: str):
        self._print("INFO", Colors.BLUE, msg)

    def success(self, msg: str):
        self._successes += 1
        self._print("SUCCESS", Colors.GREEN, msg)

    def warn(self, msg: str):
        self._warnings += 1
        self._print("WARN", Colors.YELLOW, msg)

    def error(self, msg: str):
        self._errors += 1
        self._print("ERROR", Colors.RED, msg)

    def step(self, step: int, total: int, text: str):
        print(f"\n{Colors.CYAN}[{step}/{total}]{Colors.RESET} {Colors.BOLD}{text}{Colors.RESET}")

    def verbose_info(self, msg: str):
        if self.verbose:
            self.info(msg)

    def banner(self, version: str):
        print(f"""
{Colors.CYAN}{'=' * 48}{Colors.RESET}
{Colors.BOLD}  🚀  FinPilot AI Launcher v{version}{Colors.RESET}
{Colors.CYAN}{'=' * 48}{Colors.RESET}""")

    def result(self, frontend_url: str, backend_url: str, docs_url: str):
        has_errors = self._errors > 0
        border_color = Colors.GREEN if not has_errors else Colors.YELLOW
        status = "启动完成" if not has_errors else "启动完成（有警告）"

        print(f"""
{border_color}{'=' * 48}{Colors.RESET}
{Colors.BOLD}  ✔  {status}{Colors.RESET}
{border_color}{'=' * 48}{Colors.RESET}
{Colors.GREEN}  前端:     {frontend_url}{Colors.RESET}
{Colors.GREEN}  后端:     {backend_url}{Colors.RESET}
{Colors.GREEN}  API文档:  {docs_url}{Colors.RESET}
{Colors.DIM}  关闭: Ctrl+C 或关闭终端窗口{Colors.RESET}
{border_color}{'=' * 48}{Colors.RESET}""")

        if self.stats["errors"] > 0:
            print(f"\n{Colors.YELLOW}  ⚠ 错误: {self.stats['errors']}  警告: {self.stats['warnings']}{Colors.RESET}")

    def fatal(self, msg: str):
        print(f"""
{Colors.RED}{'=' * 48}{Colors.RESET}
{Colors.BOLD}  ✖  启动失败{Colors.RESET}
{Colors.RED}{'=' * 48}{Colors.RESET}
{Colors.RED}  {msg}{Colors.RESET}
{Colors.DIM}  请修复上方错误后重试{Colors.RESET}
{Colors.RED}{'=' * 48}{Colors.RESET}""")
