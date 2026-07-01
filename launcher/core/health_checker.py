# -*- coding: utf-8 -*-
"""FinPilot AI Launcher - Health Checker & Browser Opener"""

import subprocess
import sys
import time
import os
import urllib.request
import urllib.error
from core.logger import Logger


class HealthChecker:
    """Wait for services to become healthy."""

    def __init__(self, logger: Logger):
        self.logger = logger

    def check_url(self, url: str, timeout: float = 2.0) -> bool:
        """Check if a URL is responding."""
        try:
            req = urllib.request.Request(url, method="GET")
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return resp.status < 500
        except (urllib.error.URLError, urllib.error.HTTPError, OSError, Exception):
            return False

    def wait_for_backend(self, base_url: str, max_wait: int = 30) -> bool:
        """Wait for backend health endpoint with retries."""
        health_url = f"{base_url}/api/v1/health"
        self.logger.info(f"等待后端启动 ({health_url})...")

        for i in range(max_wait // 2):
            if self.check_url(health_url, timeout=2):
                self.logger.success(f"后端健康检查通过 ({health_url})")
                return True
            time.sleep(2)

        # Fallback: try root URL
        if self.check_url(base_url, timeout=2):
            self.logger.success(f"后端可访问 ({base_url})")
            return True

        self.logger.warn(f"后端健康检查超时（{max_wait}s），但进程仍在运行")
        self.logger.info("服务可能需要更多时间启动，请手动访问确认")
        return False

    def wait_for_frontend(self, url: str, max_wait: int = 30) -> bool:
        """Wait for frontend to respond."""
        self.logger.info(f"等待前端启动 ({url})...")

        for i in range(max_wait // 3):
            if self.check_url(url, timeout=3):
                self.logger.success(f"前端已就绪 ({url})")
                return True
            time.sleep(3)

        self.logger.warn(f"前端健康检查超时（{max_wait}s）")
        return False


class BrowserOpener:
    """Open browser to the application URL."""

    def __init__(self, logger: Logger):
        self.logger = logger

    def open(self, url: str):
        try:
            if sys.platform == "win32":
                os.startfile(url)
            elif sys.platform == "darwin":
                subprocess.Popen(["open", url])
            else:
                subprocess.Popen(["xdg-open", url])
            self.logger.success(f"浏览器已打开: {url}")
        except Exception as e:
            self.logger.warn(f"自动打开浏览器失败: {e}")
            self.logger.info(f"请手动访问: {url}")
