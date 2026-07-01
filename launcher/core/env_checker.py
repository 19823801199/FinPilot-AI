# -*- coding: utf-8 -*-
"""FinPilot AI Launcher - Environment Checker"""

import subprocess
import sys
import re
from typing import Optional
from core.logger import Logger


class EnvChecker:
    """Check if all required tools are installed and meet version requirements."""

    def __init__(self, logger: Logger):
        self.logger = logger
        self.errors: list[str] = []

    def _run(self, cmd: list[str]) -> tuple[bool, str]:
        try:
            result = subprocess.run(
                cmd, capture_output=True, text=True, timeout=10,
                shell=(sys.platform == "win32"),
            )
            return result.returncode == 0, result.stdout.strip() + result.stderr.strip()
        except (subprocess.TimeoutExpired, FileNotFoundError, OSError):
            return False, ""

    def _parse_version(self, output: str) -> Optional[tuple[int, ...]]:
        """Extract version numbers from command output."""
        match = re.search(r"(\d+)\.(\d+)(?:\.(\d+))?", output)
        if match:
            return tuple(int(g) for g in match.groups() if g is not None)
        return None

    def check_node(self) -> bool:
        ok, output = self._run(["node", "-v"])
        if not ok:
            self.logger.error("Node.js >= 18 未安装")
            self.logger.info("下载: https://nodejs.org/")
            self.errors.append("Node.js")
            return False
        ver = self._parse_version(output)
        if ver and ver[0] < 18:
            self.logger.warn(f"Node.js 版本 {output} 低于 18，建议升级")
        self.logger.success(f"Node.js {output}")
        return True

    def check_python(self) -> bool:
        ok, output = self._run(["python", "--version"])
        if not ok:
            self.logger.error("Python >= 3.10 未安装")
            self.logger.info("下载: https://www.python.org/downloads/")
            self.errors.append("Python")
            return False
        ver = self._parse_version(output)
        if ver and (ver[0] < 3 or (ver[0] == 3 and ver[1] < 10)):
            self.logger.warn(f"Python 版本 {output} 低于 3.10，建议升级")
        self.logger.success(f"Python {output}")
        return True

    def check_npm(self) -> bool:
        ok, output = self._run(["npm", "-v"])
        if not ok:
            self.logger.error("npm 未安装")
            self.errors.append("npm")
            return False
        self.logger.success(f"npm {output}")
        return True

    def check_pip(self) -> bool:
        ok, output = self._run(["pip", "--version"])
        if not ok:
            self.logger.error("pip 未安装")
            self.errors.append("pip")
            return False
        self.logger.success("pip 可用")
        return True

    def check_git(self) -> bool:
        ok, output = self._run(["git", "--version"])
        if not ok:
            self.logger.warn("git 未安装（可选，不影响运行）")
            return True
        self.logger.success(f"{output}")
        return True

    def check_gpu(self) -> bool:
        """Optional GPU detection."""
        if sys.platform == "win32":
            ok, output = self._run(["nvidia-smi", "--query-gpu=name", "--format=csv,noheader"])
            if ok and output:
                for line in output.splitlines():
                    name = line.strip().strip('"')
                    if name:
                        self.logger.info(f"GPU: {name}")
                        return True
        return False

    def run_all(self) -> bool:
        """Run all checks. Returns True if all required tools are present."""
        results = [
            self.check_node(),
            self.check_python(),
            self.check_npm(),
            self.check_pip(),
            self.check_git(),
        ]
        self.check_gpu()
        return all(results)
