# -*- coding: utf-8 -*-
"""FinPilot AI Launcher - Port Manager"""

import subprocess
import sys
import time
from typing import Optional
from core.logger import Logger


class PortManager:
    """Detect and free occupied ports."""

    def __init__(self, logger: Logger):
        self.logger = logger
        self.killed_pids: list[int] = []

    def _run_cmd(self, cmd: str) -> tuple[bool, str]:
        try:
            result = subprocess.run(
                cmd, capture_output=True, text=True, timeout=10,
                shell=True,
            )
            return result.returncode == 0, result.stdout.strip() + result.stderr.strip()
        except Exception:
            return False, ""

    def _kill_pid(self, pid: int):
        try:
            if sys.platform == "win32":
                subprocess.run(
                    ["taskkill", "/F", "/PID", str(pid)],
                    capture_output=True, timeout=5, shell=True,
                )
            else:
                subprocess.run(
                    ["kill", "-9", str(pid)],
                    capture_output=True, timeout=5,
                )
            self.killed_pids.append(pid)
        except Exception:
            pass

    def _find_pids_on_port(self, port: int) -> list[int]:
        pids = []
        if sys.platform == "win32":
            ok, output = self._run_cmd(f'netstat -ano | findstr :{port}')
            if ok and output:
                for line in output.splitlines():
                    if "LISTENING" in line or "LISTEN" in line.upper():
                        parts = line.split()
                        if parts:
                            try:
                                pids.append(int(parts[-1]))
                            except ValueError:
                                pass
        else:
            ok, output = self._run_cmd(f"lsof -i :{port} -t")
            if ok and output:
                for line in output.splitlines():
                    try:
                        pids.append(int(line.strip()))
                    except ValueError:
                        pass
        return list(set(pids))

    def _is_port_listening(self, port: int) -> bool:
        pids = self._find_pids_on_port(port)
        return len(pids) > 0

    def free_port(self, port: int) -> bool:
        """Free a port if occupied. Returns True if port is now available."""
        pids = self._find_pids_on_port(port)
        if not pids:
            self.logger.success(f"端口 {port} 可用")
            return True

        self.logger.warn(f"端口 {port} 被占用 (PID: {', '.join(str(p) for p in pids)})")
        for pid in pids:
            self.logger.info(f"正在终止进程 PID {pid}...")
            self._kill_pid(pid)
            time.sleep(1)

        # Verify
        if self._is_port_listening(port):
            self.logger.error(f"端口 {port} 释放失败，请手动终止占用进程")
            return False

        self.logger.success(f"端口 {port} 已释放")
        return True
