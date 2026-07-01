# -*- coding: utf-8 -*-
"""FinPilot AI Launcher - Main Entry Point

Usage:
    python launcher/main.py
    python launcher/main.py --skip-install
    python launcher/main.py --port 3001 --api-port 8001
    python launcher/main.py --verbose
"""

import os
import sys
import signal
import argparse

# Ensure launcher/core is importable
LAUNCHER_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(LAUNCHER_DIR)
sys.path.insert(0, LAUNCHER_DIR)

from core.logger import Logger, Colors
from core.env_checker import EnvChecker
from core.port_manager import PortManager
from core.installer import Installer
from core.process_manager import ProcessManager
from core.health_checker import HealthChecker, BrowserOpener


VERSION = "1.0.0"
TOTAL_STEPS = 8


def parse_args():
    parser = argparse.ArgumentParser(description="FinPilot AI Launcher")
    parser.add_argument("--skip-install", action="store_true", help="跳过依赖安装")
    parser.add_argument("--port", type=int, default=3000, help="前端端口 (默认 3000)")
    parser.add_argument("--api-port", type=int, default=8000, help="后端端口 (默认 8000)")
    parser.add_argument("--verbose", action="store_true", help="详细日志输出")
    parser.add_argument("--no-browser", action="store_true", help="不自动打开浏览器")
    return parser.parse_args()


def main():
    args = parse_args()
    log = Logger(verbose=args.verbose)

    # Handle Ctrl+C gracefully
    pm = ProcessManager(log)

    def signal_handler(sig, frame):
        print(f"\n  {Colors.YELLOW}[SIGNAL]{Colors.RESET} 收到中断信号")
        pm.stop_all()
        sys.exit(0)

    signal.signal(signal.SIGINT, signal_handler)

    # =========================================
    # STEP 1: Banner
    # =========================================
    log.banner(VERSION)

    # =========================================
    # STEP 2: Environment Check
    # =========================================
    log.step(1, TOTAL_STEPS, "环境检测...")
    checker = EnvChecker(log)
    if not checker.run_all():
        log.fatal(f"缺少必要依赖: {', '.join(checker.errors)}")
        sys.exit(1)

    # =========================================
    # STEP 3: Configuration Check
    # =========================================
    log.step(2, TOTAL_STEPS, "配置检查...")
    env_file = os.path.join(PROJECT_ROOT, ".env")
    env_example = os.path.join(PROJECT_ROOT, ".env.example")
    default_env = os.path.join(LAUNCHER_DIR, "config", "default.env")

    if not os.path.isfile(env_file):
        source = None
        if os.path.isfile(env_example):
            source = env_example
        elif os.path.isfile(default_env):
            source = default_env

        if source:
            import shutil
            shutil.copy2(source, env_file)
            log.success("已创建 .env 文件")
            log.warn("请填写 DEEPSEEK_API_KEY，否则 AI 功能将使用 Mock 模式")
            log.info(f"编辑文件: {env_file}")
        else:
            log.warn("未找到 .env 模板，跳过配置")
    else:
        log.success(".env 文件已存在")
        # Check if API key is configured
        try:
            with open(env_file, "r", encoding="utf-8") as f:
                content = f.read()
            if "your-deepseek-api-key-here" in content or "your_key_here" in content:
                log.warn("DEEPSEEK_API_KEY 尚未配置，AI 功能将使用 Mock 数据")
            else:
                log.success("DEEPSEEK_API_KEY 已配置")
        except Exception:
            pass

    # =========================================
    # STEP 4: Port Check
    # =========================================
    log.step(3, TOTAL_STEPS, "端口检查...")
    port_mgr = PortManager(log)
    if not port_mgr.free_port(args.api_port):
        log.fatal(f"端口 {args.api_port} 无法释放")
        sys.exit(1)
    if not port_mgr.free_port(args.port):
        log.fatal(f"端口 {args.port} 无法释放")
        sys.exit(1)

    # =========================================
    # STEP 5: Dependency Installation
    # =========================================
    if not args.skip_install:
        log.step(4, TOTAL_STEPS, "后端环境准备...")
        installer = Installer(log)

        if not installer.create_venv():
            log.fatal("虚拟环境创建失败")
            sys.exit(1)

        if not installer.install_backend():
            log.warn("后端依赖安装失败，服务可能无法正常运行")

        log.step(5, TOTAL_STEPS, "前端环境准备...")
        if not installer.install_frontend():
            log.warn("前端依赖安装失败，服务可能无法正常运行")
    else:
        log.step(4, TOTAL_STEPS, "后端环境准备...")
        log.info("跳过 (--skip-install)")
        log.step(5, TOTAL_STEPS, "前端环境准备...")
        log.info("跳过 (--skip-install)")

    # =========================================
    # STEP 6: Start Backend
    # =========================================
    log.step(6, TOTAL_STEPS, "启动后端服务...")
    if not pm.start_backend(args.api_port):
        log.fatal("后端服务启动失败")
        sys.exit(1)

    # =========================================
    # STEP 7: Start Frontend
    # =========================================
    log.step(7, TOTAL_STEPS, "启动前端服务...")
    if not pm.start_frontend(args.port):
        log.error("前端服务启动失败")
        log.info("可手动进入 apps/web 执行 npm run dev")

    # =========================================
    # STEP 8: Health Check & Browser
    # =========================================
    log.step(8, TOTAL_STEPS, "健康检查...")

    backend_url = f"http://localhost:{args.api_port}"
    frontend_url = f"http://localhost:{args.port}"
    docs_url = f"{backend_url}/docs"

    hc = HealthChecker(log)
    hc.wait_for_backend(backend_url, max_wait=30)
    hc.wait_for_frontend(frontend_url, max_wait=30)

    if not args.no_browser:
        opener = BrowserOpener(log)
        opener.open(frontend_url)

    # =========================================
    # RESULT
    # =========================================
    log.result(frontend_url, backend_url, docs_url)

    # =========================================
    # STREAM LOGS
    # =========================================
    log.info("以下为实时日志（Ctrl+C 退出）:")
    print()

    # Stream logs from both processes
    threads = pm.stream_logs()

    # Start streaming backend output
    if pm._backend_proc and pm._backend_proc.stdout:
        import threading
        from core.logger import Colors

        def _stream_backend():
            try:
                for line in iter(pm._backend_proc.stdout.readline, ""):
                    line = line.rstrip()
                    if line:
                        print(f"  {Colors.MAGENTA}[Backend]{Colors.RESET} {line}")
                        sys.stdout.flush()
            except Exception:
                pass

        t = threading.Thread(target=_stream_backend, daemon=True)
        t.start()
        threads.append(t)

    # Start streaming frontend output
    if pm._frontend_proc and pm._frontend_proc.stdout:
        def _stream_frontend():
            try:
                for line in iter(pm._frontend_proc.stdout.readline, ""):
                    line = line.rstrip()
                    if line:
                        print(f"  {Colors.CYAN}[Frontend]{Colors.RESET} {line}")
                        sys.stdout.flush()
            except Exception:
                pass

        t = threading.Thread(target=_stream_frontend, daemon=True)
        t.start()
        threads.append(t)

    # Keep main thread alive
    try:
        while True:
            # Check if both processes are still running
            be_alive = pm._backend_proc and pm._backend_proc.poll() is None
            fe_alive = pm._frontend_proc and pm._frontend_proc.poll() is None

            if not be_alive and not fe_alive:
                log.error("前后端服务均已退出")
                break

            if pm._backend_proc and pm._backend_proc.poll() is not None:
                log.warn("后端服务已退出")

            if pm._frontend_proc and pm._frontend_proc.poll() is not None:
                log.warn("前端服务已退出")

            time.sleep(5)
    except KeyboardInterrupt:
        pass
    finally:
        pm.stop_all()


if __name__ == "__main__":
    main()
