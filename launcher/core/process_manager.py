# -*- coding: utf-8 -*-
"""FinPilot AI Launcher - Process Manager (Cross-platform)"""

import subprocess
import sys
import time
import os
import signal
from typing import Optional
from core.logger import Logger


class ProcessManager:
    """Start and manage backend/frontend processes."""

    def __init__(self, logger: Logger):
        self.logger = logger
        self._backend_proc: Optional[subprocess.Popen] = None
        self._frontend_proc: Optional[subprocess.Popen] = None
        self.project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    @property
    def api_dir(self) -> str:
        return os.path.join(self.project_root, "apps", "api")

    @property
    def web_dir(self) -> str:
        return os.path.join(self.project_root, "apps", "web")

    def _get_venv_python(self) -> Optional[str]:
        """Find the venv Python executable."""
        if sys.platform == "win32":
            return os.path.join(self.api_dir, "venv", "Scripts", "python.exe")
        return os.path.join(self.api_dir, "venv", "bin", "python")

    def _get_venv_pip(self) -> Optional[str]:
        """Find the venv pip executable."""
        if sys.platform == "win32":
            return os.path.join(self.api_dir, "venv", "Scripts", "pip.exe")
        return os.path.join(self.api_dir, "venv", "bin", "pip")

    def _get_activate_cmd(self) -> str:
        """Return the shell command to activate venv."""
        if sys.platform == "win32":
            return os.path.join(self.api_dir, "venv", "Scripts", "activate") + " && "
        return f"source {os.path.join(self.api_dir, 'venv', 'bin', 'activate')} && "

    def _is_venv_valid(self) -> bool:
        """Check if venv exists and has python executable."""
        python_path = self._get_venv_python()
        return python_path and os.path.isfile(python_path)

    def start_backend(self, port: int) -> bool:
        """Start FastAPI backend with fallback."""
        venv_python = self._get_venv_python()

        # Strategy 1: venv uvicorn
        cmd_candidates = []
        if venv_python:
            cmd_candidates.append(
                ["python", "-m", "uvicorn", "main:app",
                 "--host", "0.0.0.0", "--port", str(port), "--reload"]
            )

        # Strategy 2: system uvicorn
        cmd_candidates.append(
            ["uvicorn", "main:app",
             "--host", "0.0.0.0", "--port", str(port), "--reload"]
        )

        # Strategy 3: direct python main.py
        cmd_candidates.append(["python", "main.py"])

        # Strategy 4: python app.py
        cmd_candidates.append(["python", "app.py"])

        for i, cmd in enumerate(cmd_candidates):
            try:
                env = os.environ.copy()
                if venv_python and i == 0:
                    # Use venv python directly
                    cmd = [venv_python] + cmd[1:]
                    # Set PYTHONPATH to apps/api
                    env["PYTHONPATH"] = self.api_dir

                self.logger.verbose_info(f"尝试启动后端: {' '.join(cmd)}")

                self._backend_proc = subprocess.Popen(
                    cmd,
                    cwd=self.api_dir,
                    env=env,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    text=True,
                    bufsize=1,
                    creationflags=(
                        subprocess.CREATE_NO_WINDOW
                        if sys.platform == "win32" else 0
                    ) if i == len(cmd_candidates) - 1 else 0,
                )

                # Wait briefly to see if it starts
                time.sleep(2)
                if self._backend_proc.poll() is None:
                    self.logger.success(f"后端已启动 (端口 {port})")
                    return True
                else:
                    self.logger.warn(f"启动命令失败 (exit code {self._backend_proc.returncode})，尝试 fallback...")
            except FileNotFoundError:
                self.logger.verbose_info(f"命令不存在: {cmd[0]}")
                continue
            except Exception as e:
                self.logger.warn(f"启动失败: {e}")
                continue

        self.logger.error("后端启动失败（所有 fallback 方案均失败）")
        return False

    def start_frontend(self, port: int) -> bool:
        """Start Next.js frontend."""
        # Try npm run dev first
        cmd_candidates = [
            ["npm", "run", "dev"],
            ["npm", "run", "start"],
        ]

        for cmd in cmd_candidates:
            try:
                self.logger.verbose_info(f"尝试启动前端: {' '.join(cmd)}")

                env = os.environ.copy()
                env["PORT"] = str(port)

                self._frontend_proc = subprocess.Popen(
                    cmd,
                    cwd=self.web_dir,
                    env=env,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    text=True,
                    bufsize=1,
                    shell=(sys.platform == "win32"),
                )

                time.sleep(3)
                if self._frontend_proc.poll() is None:
                    self.logger.success(f"前端已启动 (端口 {port})")
                    return True
                else:
                    self.logger.warn(f"启动命令失败 (exit code {self._frontend_proc.returncode})")
            except Exception as e:
                self.logger.warn(f"前端启动失败: {e}")
                continue

        self.logger.error("前端启动失败")
        return False

    def stream_logs(self):
        """Stream combined logs from backend and frontend in real-time."""
        import threading
        from core.logger import Colors

        def _stream(proc, label, color):
            if proc is None:
                return
            try:
                for line in iter(proc.stdout.readline, ""):
                    line = line.rstrip()
                    if line:
                        print(f"  {color}[{label}]{Colors.RESET} {line}")
                        sys.stdout.flush()
            except Exception:
                pass

        threads = []
        if self._backend_proc:
            t = threading.Thread(
                target=_stream,
                args=(self._backend_proc, "Backend", Colors.MAGENTA),
                daemon=True,
            )
            threads.append(t)
            t.start()

        if self._frontend_proc:
            t = threading.Thread(
                target=_stream,
                args=(self._frontend_proc, "Frontend", Colors.CYAN),
                daemon=True,
            )
            threads.append(t)
            t.start()

        return threads

    def stop_all(self):
        """Gracefully stop all processes."""
        procs = [
            ("前端", self._frontend_proc),
            ("后端", self._backend_proc),
        ]
        for name, proc in procs:
            if proc and proc.poll() is None:
                self.logger.info(f"正在停止{name}服务...")
                try:
                    proc.terminate()
                    try:
                        proc.wait(timeout=5)
                    except subprocess.TimeoutExpired:
                        proc.kill()
                        proc.wait(timeout=3)
                except Exception:
                    pass
        self.logger.info("所有服务已停止")
