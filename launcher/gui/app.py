# -*- coding: utf-8 -*-
"""
FinPilot AI v1.0.0 - Tkinter GUI 启动器
纯 Python tkinter 实现，无需第三方库
"""

import os
import sys
import subprocess
import threading
import queue
import time
import platform
import shutil
import logging
from datetime import datetime
from urllib.request import urlopen, Request
from urllib.error import URLError

import tkinter as tk
from tkinter import messagebox

# ==============================================================================
# 路径计算（全部动态，不写死绝对路径）
# ==============================================================================
# app.py 位于 launcher/gui/ 下，项目根目录是上两级
_THIS_FILE = os.path.abspath(__file__)
_LAUNCHER_GUI_DIR = os.path.dirname(_THIS_FILE)
_LAUNCHER_DIR = os.path.dirname(_LAUNCHER_GUI_DIR)
PROJECT_ROOT = os.path.dirname(_LAUNCHER_DIR)

APPS_DIR = os.path.join(PROJECT_ROOT, "apps")
API_DIR = os.path.join(APPS_DIR, "api")
WEB_DIR = os.path.join(APPS_DIR, "web")
LOGS_DIR = os.path.join(PROJECT_ROOT, "logs")
ENV_FILE = os.path.join(PROJECT_ROOT, ".env")
API_ENV_FILE = os.path.join(API_DIR, ".env")
INSTALL_LOCK = os.path.join(PROJECT_ROOT, ".install.lock")
LAUNCHER_LOG = os.path.join(LOGS_DIR, "launcher.log")
BACKEND_LOG = os.path.join(LOGS_DIR, "backend.log")
FRONTEND_LOG = os.path.join(LOGS_DIR, "frontend.log")

API_PORT = 8000
WEB_PORT = 3000

# ==============================================================================
# 颜色主题（GitHub Dark 风格）
# ==============================================================================
BG_DARK = "#0d1117"
BG_LOG = "#161b22"
FG_TEXT = "#c9d1d9"
FG_BLUE = "#58a6ff"
FG_GREEN = "#3fb950"
FG_RED = "#f85149"
FG_YELLOW = "#d29922"
FG_WHITE = "#ffffff"
FG_GRAY = "#8b949e"
FG_DIM = "#484f58"
BTN_BG = "#21262d"
BTN_ACTIVE = "#30363d"
BORDER_COLOR = "#30363d"

IS_WINDOWS = platform.system() == "Windows"
IS_MAC = platform.system() == "Darwin"

# ==============================================================================
# 日志系统
# ==============================================================================
try:
    os.makedirs(LOGS_DIR, exist_ok=True)
except Exception:
    pass

_file_logger = logging.getLogger("FinPilotLauncher")
_file_logger.setLevel(logging.DEBUG)
try:
    _fh = logging.FileHandler(LAUNCHER_LOG, encoding="utf-8")
    _fh.setFormatter(logging.Formatter(
        "%(asctime)s [%(levelname)s] %(message)s", datefmt="%Y-%m-%d %H:%M:%S"
    ))
    _file_logger.addHandler(_fh)
except Exception:
    _fh = None

_log_queue = queue.Queue()


def _log(level, msg):
    """全局日志函数，写入文件 + 推入队列"""
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"{ts} [{level}] {msg}"
    try:
        _file_logger.log(logging.DEBUG if level == "DEBUG" else logging.INFO, msg)
    except Exception:
        pass
    try:
        _log_queue.put(line)
    except Exception:
        pass


# ==============================================================================
# 工具函数
# ==============================================================================
def _run_cmd(cmd, cwd=None):
    """运行命令并返回 (returncode, stdout, stderr)"""
    try:
        is_shell = isinstance(cmd, str)
        kwargs = {
            "stdout": subprocess.PIPE,
            "stderr": subprocess.PIPE,
            "cwd": cwd,
            "shell": is_shell,
        }
        if IS_WINDOWS:
            kwargs["creationflags"] = subprocess.CREATE_NO_WINDOW
        proc = subprocess.Popen(cmd, **kwargs)
        stdout, stderr = proc.communicate(timeout=30)
        return (
            proc.returncode,
            stdout.decode("utf-8", errors="replace"),
            stderr.decode("utf-8", errors="replace"),
        )
    except subprocess.TimeoutExpired:
        try:
            proc.kill()
        except Exception:
            pass
        return -1, "", "命令超时"
    except Exception as e:
        return -1, "", str(e)


def check_port_in_use(port):
    """检查端口是否被占用"""
    try:
        if IS_WINDOWS:
            _, out, _ = _run_cmd(f'netstat -ano | findstr :{port}')
        else:
            _, out, _ = _run_cmd(f'lsof -i :{port}')
        return out.strip() != ""
    except Exception:
        return False


def health_check(url, timeout=3):
    """HTTP 健康检查"""
    try:
        req = Request(url)
        resp = urlopen(req, timeout=timeout)
        return resp.status == 200
    except Exception:
        return False


def read_env_file(path):
    """读取 .env 文件为字典"""
    env = {}
    if not os.path.isfile(path):
        return env
    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if "=" in line:
                    key, _, value = line.partition("=")
                    env[key.strip()] = value.strip()
    except Exception:
        pass
    return env


def write_env_file(path, key, value):
    """向 .env 文件写入/更新键值"""
    lines = []
    found = False
    if os.path.isfile(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                for line in f:
                    stripped = line.strip()
                    if stripped.startswith(f"{key}="):
                        lines.append(f"{key}={value}\n")
                        found = True
                    else:
                        lines.append(line)
        except Exception:
            lines = []
    if not found:
        lines.append(f"{key}={value}\n")
    try:
        parent = os.path.dirname(path)
        if parent:
            os.makedirs(parent, exist_ok=True)
    except Exception:
        pass
    try:
        with open(path, "w", encoding="utf-8") as f:
            f.writelines(lines)
    except Exception as e:
        _log("ERROR", f"写入 .env 失败: {e}")


def has_real_api_key():
    """检测 .env 中是否配了真实的 API Key（非占位符）"""
    placeholders = ("", "your-deepseek-api-key-here", "your_deepseek_api_key_here")
    for env_path in (ENV_FILE, API_ENV_FILE):
        env = read_env_file(env_path)
        api_key = env.get("DEEPSEEK_API_KEY", "")
        if api_key and api_key not in placeholders:
            return True
    return False


# ==============================================================================
# 主 GUI 类
# ==============================================================================
class FinPilotLauncher:
    def __init__(self, root):
        self.root = root
        self.root.title("FinPilot AI v1.0.0")
        self.root.geometry("640x680")
        self.root.resizable(False, False)
        self.root.configure(bg=BG_DARK)

        # 进程管理
        self.backend_proc = None
        self.frontend_proc = None
        self.backend_pid = None
        self.frontend_pid = None
        self._running = False

        # 日志队列（模块级 _log_queue 的引用）
        self.log_queue = _log_queue

        # 构建界面
        self._build_ui()

        # 窗口居中
        self.root.update_idletasks()
        sw = self.root.winfo_screenwidth()
        sh = self.root.winfo_screenheight()
        x = (sw - 640) // 2
        y = (sh - 680) // 2
        self.root.geometry(f"640x680+{x}+{y}")

        # 启动日志轮询
        self._poll_log()

        # 后台检测环境
        _log("INFO", "启动器已启动")
        threading.Thread(target=self._check_env_async, daemon=True).start()

    # ------------------------------------------------------------------
    # 界面构建
    # ------------------------------------------------------------------
    def _build_ui(self):
        # ===== 顶部 Logo =====
        logo_frame = tk.Frame(self.root, bg=BG_DARK)
        logo_frame.pack(fill=tk.X, padx=20, pady=(15, 5))

        tk.Label(
            logo_frame, text="FinPilot AI",
            font=("Microsoft YaHei", 20, "bold"), fg=FG_BLUE, bg=BG_DARK,
        ).pack(side=tk.LEFT)

        tk.Label(
            logo_frame, text="  v1.0.0",
            font=("Microsoft YaHei", 12), fg=FG_TEXT, bg=BG_DARK,
        ).pack(side=tk.LEFT)

        tk.Label(
            logo_frame, text="智能金融分析助手",
            font=("Microsoft YaHei", 10), fg=FG_YELLOW, bg=BG_DARK,
        ).pack(side=tk.RIGHT)

        # ===== 环境状态面板 =====
        env_frame = tk.LabelFrame(
            self.root, text=" 环境状态 ",
            font=("Microsoft YaHei", 10, "bold"),
            fg=FG_TEXT, bg=BG_DARK, bd=1, relief=tk.GROOVE,
            highlightbackground=BORDER_COLOR, highlightthickness=1,
        )
        env_frame.pack(fill=tk.X, padx=20, pady=(10, 5))

        self.env_items = [
            ("Node.js", "node", "--version"),
            ("Python", "python" if IS_WINDOWS else "python3", "--version"),
            ("npm", "npm", "--version"),
            ("pip", "pip" if IS_WINDOWS else "pip3", "--version"),
            ("Git", "git", "--version"),
            ("Docker", "docker", "--version"),
            ("API Key", None, None),
        ]

        self.env_status_labels = {}
        for name, _cmd, _arg in self.env_items:
            row = tk.Frame(env_frame, bg=BG_DARK)
            row.pack(fill=tk.X, padx=15, pady=2)

            tk.Label(
                row, text=name, font=("Microsoft YaHei", 9),
                fg=FG_TEXT, bg=BG_DARK, width=10, anchor="w",
            ).pack(side=tk.LEFT)

            status_lbl = tk.Label(
                row, text="\u23f3  检测中...",
                font=("Microsoft YaHei", 9), fg=FG_YELLOW, bg=BG_DARK, anchor="w",
            )
            status_lbl.pack(side=tk.LEFT, padx=(10, 0), fill=tk.X, expand=True)
            self.env_status_labels[name] = status_lbl

        # API Key 配置按钮（默认隐藏）
        self.apikey_btn_frame = tk.Frame(env_frame, bg=BG_DARK)
        self.apikey_btn_frame.pack(fill=tk.X, padx=15, pady=(2, 5))

        self.apikey_btn = tk.Button(
            self.apikey_btn_frame, text="配置 API Key",
            font=("Microsoft YaHei", 9), fg=FG_YELLOW, bg=BTN_BG,
            activebackground=BTN_ACTIVE, activeforeground=FG_YELLOW,
            bd=0, relief=tk.FLAT, cursor="hand2",
            command=self._show_apikey_dialog,
        )
        self.apikey_btn.pack(side=tk.LEFT)
        self.apikey_btn.pack_forget()

        # ===== 操作按钮区域 =====
        btn_frame = tk.LabelFrame(
            self.root, text=" 操作 ",
            font=("Microsoft YaHei", 10, "bold"),
            fg=FG_TEXT, bg=BG_DARK, bd=1, relief=tk.GROOVE,
            highlightbackground=BORDER_COLOR, highlightthickness=1,
        )
        btn_frame.pack(fill=tk.X, padx=20, pady=(5, 5))

        buttons = [
            ("\u25b6  启动项目", self._on_start, FG_GREEN),
            ("\u25a0  停止项目", self._on_stop, FG_RED),
            ("\u21bb  重新启动", self._on_restart, FG_YELLOW),
            ("\u2b06  更新依赖", self._on_update_deps, FG_BLUE),
            ("\u21ba  重新安装", self._on_reinstall, FG_YELLOW),
            ("\U0001f310  打开浏览器", self._on_open_browser, FG_BLUE),
            ("\U0001f4c1  打开项目目录", self._on_open_dir, FG_BLUE),
            ("\u2139  检查更新", self._on_check_update, FG_TEXT),
        ]

        btn_inner = tk.Frame(btn_frame, bg=BG_DARK)
        btn_inner.pack(fill=tk.X, padx=10, pady=8)

        for i, (text, cmd, fg) in enumerate(buttons):
            r = i // 2
            c = i % 2
            b = tk.Button(
                btn_inner, text=text, font=("Microsoft YaHei", 9),
                fg=fg, bg=BTN_BG, activebackground=BTN_ACTIVE, activeforeground=fg,
                bd=1, relief=tk.FLAT, cursor="hand2", width=18,
                command=cmd,
            )
            b.grid(row=r, column=c, padx=5, pady=3, sticky="ew")

        btn_inner.columnconfigure(0, weight=1)
        btn_inner.columnconfigure(1, weight=1)

        # ===== 日志区域 =====
        log_frame = tk.LabelFrame(
            self.root, text=" 日志 ",
            font=("Microsoft YaHei", 10, "bold"),
            fg=FG_TEXT, bg=BG_DARK, bd=1, relief=tk.GROOVE,
            highlightbackground=BORDER_COLOR, highlightthickness=1,
        )
        log_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=(5, 5))

        self.log_text = tk.Text(
            log_frame, font=("Consolas", 9),
            bg=BG_LOG, fg=FG_WHITE, insertbackground=FG_WHITE,
            bd=0, relief=tk.FLAT, wrap=tk.WORD, state=tk.DISABLED,
        )
        self.log_text.pack(fill=tk.BOTH, expand=True, padx=2, pady=2)

        scrollbar = tk.Scrollbar(self.log_text, command=self.log_text.yview)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.log_text.configure(yscrollcommand=scrollbar.set)

        # ===== 底部状态栏 =====
        status_frame = tk.Frame(self.root, bg=BG_DARK)
        status_frame.pack(fill=tk.X, padx=20, pady=(0, 10))

        self.status_label = tk.Label(
            status_frame, text="就绪",
            font=("Microsoft YaHei", 9), fg=FG_GREEN, bg=BG_DARK, anchor="w",
        )
        self.status_label.pack(side=tk.LEFT)

        tk.Label(
            status_frame, text="FinPilot AI v1.0.0",
            font=("Microsoft YaHei", 8), fg=FG_DIM, bg=BG_DARK, anchor="e",
        ).pack(side=tk.RIGHT)

    # ------------------------------------------------------------------
    # 日志轮询（统一处理普通日志 + 特殊消息）
    # ------------------------------------------------------------------
    def _poll_log(self):
        """轮询日志队列，区分普通文本和特殊元组消息"""
        try:
            while True:
                item = self.log_queue.get_nowait()

                if isinstance(item, tuple):
                    msg_type = item[0]
                    if msg_type == "env_status":
                        self._handle_env_update(item[1], item[2])
                    elif msg_type == "show_apikey_btn":
                        self.apikey_btn.pack(side=tk.LEFT)
                    elif msg_type == "env_check_failed":
                        missing = item[1]
                        try:
                            messagebox.showerror(
                                "环境检测失败",
                                f"缺少必要环境，请先安装：\n{', '.join(missing)}",
                            )
                        except Exception:
                            pass
                    continue

                # 普通文本日志
                self.log_text.configure(state=tk.NORMAL)
                self.log_text.insert(tk.END, str(item) + "\n")
                self.log_text.see(tk.END)
                self.log_text.configure(state=tk.DISABLED)
        except queue.Empty:
            pass
        self.root.after(100, self._poll_log)

    def _log(self, level, msg):
        _log(level, msg)

    def _set_status(self, text, color=FG_TEXT):
        self.status_label.configure(text=text, fg=color)

    # ------------------------------------------------------------------
    # 环境检测
    # ------------------------------------------------------------------
    def _check_env_async(self):
        """后台线程：逐个检测环境"""
        for name, cmd, arg in self.env_items:
            try:
                if name == "Docker":
                    rc, out, _ = _run_cmd([cmd, arg] if cmd else [])
                    if rc == 0 and out.strip():
                        self.log_queue.put(("env_status", name, ("ok", out.strip().splitlines()[0][:50])))
                    else:
                        self.log_queue.put(("env_status", name, ("skip", "未安装（可选）")))
                elif name == "API Key":
                    if has_real_api_key():
                        self.log_queue.put(("env_status", name, ("ok", "已配置")))
                    else:
                        self.log_queue.put(("env_status", name, ("missing", "未配置")))
                else:
                    if cmd is None:
                        self.log_queue.put(("env_status", name, ("missing", "未找到")))
                        continue
                    rc, out, _ = _run_cmd([cmd, arg])
                    if rc == 0 and out.strip():
                        self.log_queue.put(("env_status", name, ("ok", out.strip().splitlines()[0][:50])))
                    else:
                        self.log_queue.put(("env_status", name, ("missing", f"未找到 {cmd}")))
            except Exception:
                self.log_queue.put(("env_status", name, ("missing", "检测异常")))

        # 若 API Key 未配置，显示配置按钮
        if not has_real_api_key():
            self.log_queue.put(("show_apikey_btn",))

    def _handle_env_update(self, name, status_tuple):
        """主线程回调：更新环境状态 Label"""
        lbl = self.env_status_labels.get(name)
        if lbl is None:
            return
        status, detail = status_tuple
        if status == "ok":
            lbl.configure(text=f"\u2705  {detail}", fg=FG_GREEN)
        elif status == "skip":
            lbl.configure(text=f"\u26aa  {detail}", fg=FG_GRAY)
        else:
            lbl.configure(text=f"\u274c  {detail}", fg=FG_RED)

    # ------------------------------------------------------------------
    # API Key 配置对话框
    # ------------------------------------------------------------------
    def _show_apikey_dialog(self):
        win = tk.Toplevel(self.root)
        win.title("配置 API Key")
        win.geometry("420x220")
        win.resizable(False, False)
        win.configure(bg=BG_DARK)
        win.transient(self.root)
        win.grab_set()

        # 居中于主窗口
        win.update_idletasks()
        x = self.root.winfo_x() + (640 - 420) // 2
        y = self.root.winfo_y() + (680 - 220) // 2
        win.geometry(f"420x220+{x}+{y}")

        tk.Label(
            win, text="请输入 DeepSeek API Key",
            font=("Microsoft YaHei", 11, "bold"), fg=FG_TEXT, bg=BG_DARK,
        ).pack(padx=20, pady=(20, 5))

        tk.Label(
            win, text="API Key 将写入项目根目录 .env 文件",
            font=("Microsoft YaHei", 8), fg=FG_GRAY, bg=BG_DARK,
        ).pack(padx=20, pady=(0, 10))

        entry = tk.Entry(
            win, font=("Consolas", 10),
            bg="#21262d", fg=FG_WHITE, insertbackground=FG_WHITE,
            bd=1, relief=tk.FLAT, show="*",
        )
        entry.pack(fill=tk.X, padx=20, ipady=5)
        entry.focus_set()

        msg_label = tk.Label(
            win, text="", font=("Microsoft YaHei", 8), fg=FG_RED, bg=BG_DARK,
        )
        msg_label.pack(padx=20, pady=2)

        def _save():
            key = entry.get().strip()
            if not key:
                msg_label.configure(text="API Key 不能为空")
                return
            write_env_file(ENV_FILE, "DEEPSEEK_API_KEY", key)
            self._log("INFO", "API Key 已保存到 .env")
            self.env_status_labels["API Key"].configure(
                text="\u2705  已配置", fg=FG_GREEN
            )
            self.apikey_btn.pack_forget()
            win.destroy()

        btn_row = tk.Frame(win, bg=BG_DARK)
        btn_row.pack(padx=20, pady=(10, 15))

        tk.Button(
            btn_row, text="取消", font=("Microsoft YaHei", 9),
            fg=FG_TEXT, bg=BTN_BG, bd=0, relief=tk.FLAT,
            command=win.destroy, width=10,
        ).pack(side=tk.RIGHT, padx=5)

        tk.Button(
            btn_row, text="保存", font=("Microsoft YaHei", 9),
            fg=FG_GREEN, bg=BTN_BG, bd=0, relief=tk.FLAT,
            command=_save, width=10,
        ).pack(side=tk.RIGHT, padx=5)

        entry.bind("<Return>", lambda _e: _save())

    # ------------------------------------------------------------------
    # 进程管理
    # ------------------------------------------------------------------
    def _kill_process(self, proc, pid):
        """终止子进程（Windows 用 taskkill，其他用 terminate）"""
        if proc is None:
            return
        try:
            if IS_WINDOWS and pid:
                subprocess.call(
                    f"taskkill /F /T /PID {pid}",
                    shell=True,
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                    creationflags=subprocess.CREATE_NO_WINDOW,
                )
            else:
                try:
                    proc.terminate()
                    proc.wait(timeout=5)
                except Exception:
                    proc.kill()
        except Exception as e:
            self._log("WARN", f"终止进程异常: {e}")

    def _stop_all(self):
        """停止所有子进程并重置状态"""
        self._log("INFO", "正在停止所有服务...")
        self._kill_process(self.frontend_proc, self.frontend_pid)
        self._kill_process(self.backend_proc, self.backend_pid)
        self.backend_proc = None
        self.frontend_proc = None
        self.backend_pid = None
        self.frontend_pid = None
        self._running = False
        self._log("INFO", "所有服务已停止")
        self._set_status("已停止", FG_RED)

    # ------------------------------------------------------------------
    # 启动逻辑（后台线程执行）
    # ------------------------------------------------------------------
    def _start_project_async(self):
        """完整启动流程：检查环境 -> 端口 -> 依赖 -> 后端 -> 前端 -> 浏览器"""
        if self._running:
            self._log("WARN", "项目已在运行中")
            return

        self._log("INFO", "=" * 50)
        self._log("INFO", "开始启动 FinPilot AI 项目...")
        self._log("INFO", f"项目根目录: {PROJECT_ROOT}")
        self._set_status("正在启动...", FG_YELLOW)

        # [1/7] 检查环境
        self._log("INFO", "[1/7] 检查环境...")
        missing = []
        for name, cmd, arg in self.env_items:
            if name in ("Docker", "API Key") or cmd is None:
                continue
            rc, _, _ = _run_cmd([cmd, arg])
            if rc != 0:
                missing.append(name)
        if missing:
            self._log("ERROR", f"缺少必要环境: {', '.join(missing)}")
            self.log_queue.put(("env_check_failed", missing))
            self._set_status("环境检测失败", FG_RED)
            return

        # [2/7] 检查并释放端口
        self._log("INFO", "[2/7] 检查端口占用...")
        for port_name, port in [("后端", API_PORT), ("前端", WEB_PORT)]:
            if check_port_in_use(port):
                self._log("WARN", f"{port_name}端口 {port} 已被占用，尝试释放...")
                self._release_port(port)

        # [3/7] 安装依赖
        if os.path.isfile(INSTALL_LOCK):
            self._log("INFO", "[3/7] 检测到 .install.lock，跳过依赖安装")
        else:
            self._log("INFO", "[3/7] 安装后端依赖...")
            self._install_backend_deps()
            self._log("INFO", "[3/7] 安装前端依赖...")
            self._install_frontend_deps()
            try:
                with open(INSTALL_LOCK, "w", encoding="utf-8") as f:
                    f.write(datetime.now().isoformat())
                self._log("INFO", "依赖安装完成，已创建 .install.lock")
            except Exception as e:
                self._log("WARN", f"创建 .install.lock 失败: {e}")

        # [4/7] 启动后端
        self._log("INFO", "[4/7] 启动后端服务...")
        if not self._start_backend():
            self._set_status("后端启动失败", FG_RED)
            return

        # [5/7] 后端健康检查
        self._log("INFO", "[5/7] 后端健康检查...")
        if not self._wait_for_health(f"http://localhost:{API_PORT}/api/v1/health", "后端"):
            self._log("ERROR", "后端健康检查失败")
            self._stop_all()
            self._set_status("后端启动失败", FG_RED)
            return

        # [6/7] 启动前端
        self._log("INFO", "[6/7] 启动前端服务...")
        if not self._start_frontend():
            self._set_status("前端启动失败", FG_RED)
            return

        # [7/7] 前端健康检查
        self._log("INFO", "[7/7] 前端健康检查...")
        if not self._wait_for_health(f"http://localhost:{WEB_PORT}", "前端", max_retries=20):
            self._log("WARN", "前端健康检查超时，但可能仍在启动中")

        self._running = True
        self._log("INFO", "=" * 50)
        self._log("INFO", "FinPilot AI 项目启动成功！")
        self._log("INFO", f"前端: http://localhost:{WEB_PORT}")
        self._log("INFO", f"后端: http://localhost:{API_PORT}/docs")
        self._set_status("运行中", FG_GREEN)

        # 自动打开浏览器
        self._open_browser_async()

    def _release_port(self, port):
        """尝试释放被占用的端口"""
        try:
            if IS_WINDOWS:
                _, out, _ = _run_cmd(f'netstat -ano | findstr :{port}')
                for line in out.strip().splitlines():
                    parts = line.split()
                    if parts:
                        pid_str = parts[-1]
                        if pid_str.isdigit() and int(pid_str) > 0:
                            subprocess.call(
                                f"taskkill /F /PID {pid_str}",
                                shell=True,
                                stdout=subprocess.DEVNULL,
                                stderr=subprocess.DEVNULL,
                                creationflags=subprocess.CREATE_NO_WINDOW,
                            )
                            self._log("INFO", f"已终止占用端口 {port} 的进程 PID={pid_str}")
                            break
            else:
                _, out, _ = _run_cmd(f'lsof -t -i :{port}')
                for pid_str in out.strip().splitlines():
                    pid_str = pid_str.strip()
                    if pid_str.isdigit() and int(pid_str) > 0:
                        subprocess.call(
                            ["kill", "-9", pid_str],
                            stdout=subprocess.DEVNULL,
                            stderr=subprocess.DEVNULL,
                        )
                        self._log("INFO", f"已终止占用端口 {port} 的进程 PID={pid_str}")
                        break
            time.sleep(1)
        except Exception as e:
            self._log("WARN", f"释放端口 {port} 失败: {e}")

    # ------------------------------------------------------------------
    # 依赖安装
    # ------------------------------------------------------------------
    def _install_backend_deps(self):
        """安装后端 Python 依赖（自动检测/创建 venv）"""
        venv_dir = os.path.join(API_DIR, "venv")

        # 确定 venv 中的 python 路径
        if IS_WINDOWS:
            venv_python = os.path.join(venv_dir, "Scripts", "python.exe")
            venv_pip = os.path.join(venv_dir, "Scripts", "pip.exe")
        else:
            venv_python = os.path.join(venv_dir, "bin", "python")
            venv_pip = os.path.join(venv_dir, "bin", "pip")

        # 如果 venv 不存在，先创建
        if not os.path.isdir(venv_dir):
            system_python = "python" if IS_WINDOWS else "python3"
            self._log("INFO", f"创建 Python 虚拟环境 ({system_python})...")
            rc, out, err = _run_cmd([system_python, "-m", "venv", venv_dir])
            if rc != 0:
                self._log("WARN", f"创建虚拟环境失败: {err}，将使用系统 Python")
            elif not os.path.isfile(venv_pip):
                self._log("WARN", "虚拟环境创建后未找到 pip，将使用系统 pip")

        # 确定最终使用的 pip
        if os.path.isfile(venv_pip):
            pip_exe = venv_pip
        else:
            pip_exe = "pip" if IS_WINDOWS else "pip3"

        req_file = os.path.join(API_DIR, "requirements.txt")
        if os.path.isfile(req_file):
            self._log("INFO", f"执行: {pip_exe} install -r requirements.txt")
            self._stream_command([pip_exe, "install", "-r", req_file], API_DIR, BACKEND_LOG)
        else:
            self._log("WARN", "未找到 requirements.txt，跳过后端依赖安装")

    def _install_frontend_deps(self):
        """安装前端 npm 依赖"""
        pkg_json = os.path.join(WEB_DIR, "package.json")
        if not os.path.isfile(pkg_json):
            self._log("WARN", "未找到 package.json，跳过前端依赖安装")
            return
        self._log("INFO", "执行: npm install")
        self._stream_command(["npm", "install"], WEB_DIR, FRONTEND_LOG)

    def _stream_command(self, cmd, cwd, log_file):
        """流式运行命令：实时输出到 GUI 日志 + 文件"""
        log_fh = None
        try:
            parent = os.path.dirname(log_file)
            if parent:
                os.makedirs(parent, exist_ok=True)
            log_fh = open(log_file, "a", encoding="utf-8")
        except Exception:
            log_fh = None

        proc = None
        try:
            proc = subprocess.Popen(
                cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                cwd=cwd, shell=False, bufsize=1,
            )

            def _reader():
                try:
                    for raw_line in proc.stdout:
                        text = raw_line.decode("utf-8", errors="replace").rstrip()
                        if text:
                            self._log("DEBUG", text)
                            if log_fh:
                                try:
                                    log_fh.write(text + "\n")
                                    log_fh.flush()
                                except Exception:
                                    pass
                except Exception:
                    pass

            t = threading.Thread(target=_reader, daemon=True)
            t.start()
            proc.wait()
            t.join(timeout=5)
            return proc.returncode == 0
        except Exception as e:
            self._log("ERROR", f"执行命令失败: {e}")
            return False
        finally:
            if log_fh:
                try:
                    log_fh.close()
                except Exception:
                    pass

    # ------------------------------------------------------------------
    # 服务启动
    # ------------------------------------------------------------------
    def _start_backend(self):
        """启动后端 uvicorn 服务"""
        venv_dir = os.path.join(API_DIR, "venv")
        if IS_WINDOWS:
            python_exe = os.path.join(venv_dir, "Scripts", "python.exe")
        else:
            python_exe = os.path.join(venv_dir, "bin", "python")
        if not os.path.isfile(python_exe):
            python_exe = "python" if IS_WINDOWS else "python3"

        cmd = [python_exe, "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", str(API_PORT)]
        self._log("INFO", f"启动命令: {' '.join(cmd)}")

        log_fh = None
        try:
            os.makedirs(LOGS_DIR, exist_ok=True)
            log_fh = open(BACKEND_LOG, "a", encoding="utf-8")
        except Exception:
            log_fh = None

        try:
            self.backend_proc = subprocess.Popen(
                cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                cwd=API_DIR, shell=False, bufsize=1,
            )
            self.backend_pid = self.backend_proc.pid
            self._log("INFO", f"后端进程已启动, PID={self.backend_pid}")

            def _reader():
                try:
                    for raw_line in self.backend_proc.stdout:
                        text = raw_line.decode("utf-8", errors="replace").rstrip()
                        if text:
                            self._log("DEBUG", text)
                            if log_fh:
                                try:
                                    log_fh.write(text + "\n")
                                    log_fh.flush()
                                except Exception:
                                    pass
                except Exception:
                    pass

            threading.Thread(target=_reader, daemon=True).start()
            return True
        except Exception as e:
            self._log("ERROR", f"启动后端失败: {e}")
            return False
        finally:
            if log_fh:
                try:
                    log_fh.close()
                except Exception:
                    pass

    def _start_frontend(self):
        """启动前端 npm run dev"""
        cmd = ["npm", "run", "dev"]
        self._log("INFO", f"启动命令: {' '.join(cmd)}")

        log_fh = None
        try:
            os.makedirs(LOGS_DIR, exist_ok=True)
            log_fh = open(FRONTEND_LOG, "a", encoding="utf-8")
        except Exception:
            log_fh = None

        try:
            self.frontend_proc = subprocess.Popen(
                cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                cwd=WEB_DIR, shell=False, bufsize=1,
            )
            self.frontend_pid = self.frontend_proc.pid
            self._log("INFO", f"前端进程已启动, PID={self.frontend_pid}")

            def _reader():
                try:
                    for raw_line in self.frontend_proc.stdout:
                        text = raw_line.decode("utf-8", errors="replace").rstrip()
                        if text:
                            self._log("DEBUG", text)
                            if log_fh:
                                try:
                                    log_fh.write(text + "\n")
                                    log_fh.flush()
                                except Exception:
                                    pass
                except Exception:
                    pass

            threading.Thread(target=_reader, daemon=True).start()
            return True
        except Exception as e:
            self._log("ERROR", f"启动前端失败: {e}")
            return False
        finally:
            if log_fh:
                try:
                    log_fh.close()
                except Exception:
                    pass

    def _wait_for_health(self, url, name, max_retries=15):
        """循环等待健康检查通过"""
        for i in range(max_retries):
            time.sleep(2)
            self._log("DEBUG", f"{name}健康检查第 {i + 1}/{max_retries} 次: {url}")
            if health_check(url, timeout=3):
                self._log("INFO", f"{name}健康检查通过")
                return True
        return False

    def _open_browser_async(self):
        """打开默认浏览器"""
        url = f"http://localhost:{WEB_PORT}"
        self._log("INFO", f"打开浏览器: {url}")
        try:
            if IS_WINDOWS:
                os.startfile(url)
            elif IS_MAC:
                subprocess.Popen(["open", url])
            else:
                subprocess.Popen(["xdg-open", url])
        except Exception as e:
            self._log("WARN", f"打开浏览器失败: {e}")

    # ------------------------------------------------------------------
    # 按钮回调
    # ------------------------------------------------------------------
    def _on_start(self):
        if self._running:
            self._log("WARN", "项目已在运行中")
            return
        threading.Thread(target=self._start_project_async, daemon=True).start()

    def _on_stop(self):
        if not self._running:
            self._log("WARN", "项目未在运行")
            return
        threading.Thread(target=self._stop_all, daemon=True).start()

    def _on_restart(self):
        def _restart():
            self._stop_all()
            time.sleep(2)
            self._start_project_async()
        threading.Thread(target=_restart, daemon=True).start()

    def _on_update_deps(self):
        def _update():
            self._log("INFO", "开始更新依赖...")
            self._stop_all()
            time.sleep(1)

            # 删除 .install.lock
            if os.path.isfile(INSTALL_LOCK):
                try:
                    os.remove(INSTALL_LOCK)
                    self._log("INFO", "已删除 .install.lock")
                except Exception as e:
                    self._log("WARN", f"删除 .install.lock 失败: {e}")

            # 删除 node_modules
            node_modules = os.path.join(WEB_DIR, "node_modules")
            if os.path.isdir(node_modules):
                self._log("INFO", "正在删除 node_modules...")
                try:
                    shutil.rmtree(node_modules)
                    self._log("INFO", "已删除 node_modules")
                except Exception as e:
                    self._log("WARN", f"删除 node_modules 失败: {e}")

            # 删除 venv
            venv_dir = os.path.join(API_DIR, "venv")
            if os.path.isdir(venv_dir):
                self._log("INFO", "正在删除 venv...")
                try:
                    shutil.rmtree(venv_dir)
                    self._log("INFO", "已删除 venv")
                except Exception as e:
                    self._log("WARN", f"删除 venv 失败: {e}")

            # 重新安装
            self._log("INFO", "开始重新安装依赖...")
            self._install_backend_deps()
            self._install_frontend_deps()

            try:
                with open(INSTALL_LOCK, "w", encoding="utf-8") as f:
                    f.write(datetime.now().isoformat())
                self._log("INFO", "依赖更新完成，已创建 .install.lock")
            except Exception as e:
                self._log("WARN", f"创建 .install.lock 失败: {e}")

            self._log("INFO", "依赖更新完成！")
            self._set_status("依赖已更新", FG_GREEN)

        threading.Thread(target=_update, daemon=True).start()

    def _on_reinstall(self):
        self._on_update_deps()

    def _on_open_browser(self):
        self._open_browser_async()

    def _on_open_dir(self):
        try:
            if IS_WINDOWS:
                os.startfile(PROJECT_ROOT)
            elif IS_MAC:
                subprocess.Popen(["open", PROJECT_ROOT])
            else:
                subprocess.Popen(["xdg-open", PROJECT_ROOT])
        except Exception as e:
            self._log("ERROR", f"打开目录失败: {e}")

    def _on_check_update(self):
        self._log("INFO", "检查更新功能暂未实现")
        self._set_status("暂无更新", FG_YELLOW)

    # ------------------------------------------------------------------
    # 窗口关闭
    # ------------------------------------------------------------------
    def on_closing(self):
        """窗口关闭时停止所有子进程"""
        try:
            self._stop_all()
        except Exception:
            pass
        try:
            self.root.destroy()
        except Exception:
            pass
        sys.exit(0)


# ==============================================================================
# 入口
# ==============================================================================
def main():
    # Windows 高 DPI 适配
    try:
        if IS_WINDOWS:
            from ctypes import windll
            windll.shcore.SetProcessDpiAwareness(1)
    except Exception:
        pass

    root = tk.Tk()
    app = FinPilotLauncher(root)
    root.protocol("WM_DELETE_WINDOW", app.on_closing)
    root.mainloop()


if __name__ == "__main__":
    main()
