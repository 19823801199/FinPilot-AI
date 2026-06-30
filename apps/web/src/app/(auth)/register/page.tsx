"use client";

import Link from "next/link";
import { Bot, Mail, Lock, User, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent2">
            <Bot className="h-7 w-7 text-bg" />
          </div>
          <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-2xl font-bold text-transparent">
            FinPilot AI
          </span>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-rule bg-surface p-8">
          <h1 className="mb-1 text-xl font-semibold text-ink">创建账号</h1>
          <p className="mb-6 text-sm text-muted">注册以开始您的 AI 金融之旅</p>

          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Username */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                用户名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="请输入用户名"
                  className="w-full rounded-lg border border-rule bg-bg2 py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                邮箱
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full rounded-lg border border-rule bg-bg2 py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="password"
                  placeholder="请输入密码"
                  className="w-full rounded-lg border border-rule bg-bg2 py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                确认密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="password"
                  placeholder="请再次输入密码"
                  className="w-full rounded-lg border border-rule bg-bg2 py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            {/* Register button */}
            <button
              type="submit"
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-accent to-accent2 py-2.5 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
            >
              注册
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-sm text-muted">
            已有账号？{" "}
            <Link
              href="/login"
              className="font-medium text-accent hover:underline"
            >
              登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
