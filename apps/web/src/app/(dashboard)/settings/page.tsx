"use client";

import { PageContainer } from "@/components/layout";
import {
  Moon,
  Sun,
  Monitor,
  Cpu,
  Database,
  Trash2,
  Download,
  AlertTriangle,
  ChevronRight,
  Check,
} from "lucide-react";
import { useThemeStore } from "@/store/theme-store";
import { useSettingStore } from "@/store/setting-store";
import { useState } from "react";

type ModelProvider = "openai" | "anthropic" | "local";

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore();
  const { settings, updateSettings } = useSettingStore();
  const [modelProvider, setModelProvider] = useState<ModelProvider>("openai");
  const [clearConfirm, setClearConfirm] = useState(false);

  const themes: {
    value: "dark" | "light" | "system";
    label: string;
    icon: typeof Moon;
  }[] = [
    { value: "dark", label: "深色", icon: Moon },
    { value: "light", label: "浅色", icon: Sun },
    { value: "system", label: "跟随系统", icon: Monitor },
  ];

  const models: Record<ModelProvider, { value: string; label: string }[]> = {
    openai: [
      { value: "gpt-4o", label: "GPT-4o" },
      { value: "gpt-4o-mini", label: "GPT-4o Mini" },
      { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
    ],
    anthropic: [
      { value: "claude-3-5-sonnet", label: "Claude 3.5 Sonnet" },
      { value: "claude-3-opus", label: "Claude 3 Opus" },
      { value: "claude-3-haiku", label: "Claude 3 Haiku" },
    ],
    local: [
      { value: "llama3-70b", label: "Llama 3 70B" },
      { value: "qwen2-72b", label: "Qwen 2 72B" },
      { value: "deepseek-coder", label: "DeepSeek Coder" },
    ],
  };

  const handleProviderChange = (provider: ModelProvider) => {
    setModelProvider(provider);
    updateSettings({ defaultModel: models[provider][0].value });
  };

  const handleThemeChange = (t: "dark" | "light" | "system") => {
    if (t === "dark" || t === "light") {
      setTheme(t);
    }
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">设置</h1>
        <p className="mt-1 text-sm text-muted">管理您的偏好设置和系统配置</p>
      </div>

      <div className="mx-auto max-w-3xl">
        {/* Theme Settings */}
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
              <Moon className="h-4 w-4 text-accent" />
            </div>
            <h2 className="text-lg font-semibold text-ink">主题设置</h2>
          </div>
          <div className="rounded-xl border border-rule bg-surface p-5">
            <p className="mb-4 text-sm text-muted">选择您喜欢的界面主题</p>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => handleThemeChange(t.value)}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                    theme === t.value
                      ? "border-accent bg-accent/5"
                      : "border-rule bg-bg2 hover:border-accent/30"
                  }`}
                >
                  <t.icon
                    className={`h-6 w-6 ${
                      theme === t.value ? "text-accent" : "text-muted"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      theme === t.value ? "text-accent" : "text-ink"
                    }`}
                  >
                    {t.label}
                  </span>
                  {theme === t.value && (
                    <Check className="h-4 w-4 text-accent" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Model Configuration */}
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent2/10">
              <Cpu className="h-4 w-4 text-accent2" />
            </div>
            <h2 className="text-lg font-semibold text-ink">模型配置</h2>
          </div>
          <div className="rounded-xl border border-rule bg-surface p-5">
            {/* Provider Selection */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-ink">
                AI 模型提供商
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    { value: "openai" as const, label: "OpenAI" },
                    { value: "anthropic" as const, label: "Anthropic" },
                    { value: "local" as const, label: "本地模型" },
                  ] as const
                ).map((p) => (
                  <button
                    key={p.value}
                    onClick={() => handleProviderChange(p.value)}
                    className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                      modelProvider === p.value
                        ? "border-accent2 bg-accent2/10 text-accent2"
                        : "border-rule bg-bg2 text-muted hover:border-accent2/30"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Selection */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-ink">
                模型版本
              </label>
              <select
                value={settings.defaultModel}
                onChange={(e) =>
                  updateSettings({ defaultModel: e.target.value })
                }
                className="w-full rounded-xl border border-rule bg-bg2 px-4 py-2.5 text-sm text-ink outline-none focus:border-accent2"
              >
                {models[modelProvider].map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* API Key */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-ink">
                API 密钥
              </label>
              <input
                type="password"
                value={settings.apiKey}
                onChange={(e) => updateSettings({ apiKey: e.target.value })}
                placeholder="输入您的 API 密钥..."
                className="w-full rounded-xl border border-rule bg-bg2 px-4 py-2.5 text-sm text-ink placeholder:text-muted outline-none focus:border-accent2"
              />
              <p className="mt-1 text-xs text-muted">
                您的密钥将被安全存储在本地，不会上传到服务器
              </p>
            </div>

            {/* Temperature */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-ink">
                  温度 (Temperature)
                </label>
                <span className="rounded bg-bg2 px-2 py-0.5 text-xs text-muted">
                  {settings.temperature.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={2}
                step={0.1}
                value={settings.temperature}
                onChange={(e) =>
                  updateSettings({ temperature: parseFloat(e.target.value) })
                }
                className="w-full accent-accent"
              />
              <div className="mt-1 flex justify-between text-xs text-muted">
                <span>更精确</span>
                <span>更创意</span>
              </div>
            </div>
          </div>
        </section>

        {/* Data Management */}
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent3/10">
              <Database className="h-4 w-4 text-accent3" />
            </div>
            <h2 className="text-lg font-semibold text-ink">数据管理</h2>
          </div>
          <div className="rounded-xl border border-rule bg-surface p-5">
            <div className="flex flex-col gap-4">
              {/* Export Data */}
              <div className="flex items-center justify-between rounded-lg border border-rule bg-bg2 p-4">
                <div className="flex items-center gap-3">
                  <Download className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-sm font-medium text-ink">导出数据</p>
                    <p className="text-xs text-muted">
                      下载您的学习记录、股票关注和知识库数据
                    </p>
                  </div>
                </div>
                <button className="flex items-center gap-1 rounded-lg bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/20">
                  导出 <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              {/* Clear Data */}
              <div className="flex items-center justify-between rounded-lg border border-rule bg-bg2 p-4">
                <div className="flex items-center gap-3">
                  <Trash2 className="h-5 w-5 text-danger" />
                  <div>
                    <p className="text-sm font-medium text-ink">清除所有数据</p>
                    <p className="text-xs text-muted">
                      删除所有本地存储的数据，此操作不可撤销
                    </p>
                  </div>
                </div>
                {!clearConfirm ? (
                  <button
                    onClick={() => setClearConfirm(true)}
                    className="rounded-lg border border-danger/30 px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
                  >
                    清除
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setClearConfirm(false)}
                      className="rounded-lg border border-rule px-3 py-2 text-sm text-muted transition-colors hover:bg-surface2"
                    >
                      取消
                    </button>
                    <button
                      onClick={() => {
                        setClearConfirm(false);
                        // Mock clear action
                      }}
                      className="flex items-center gap-1 rounded-lg bg-danger px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-danger/90"
                    >
                      <AlertTriangle className="h-3.5 w-3.5" />
                      确认清除
                    </button>
                  </div>
                )}
              </div>

              {/* Storage Info */}
              <div className="rounded-lg border border-rule bg-bg2 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">本地存储使用</span>
                  <span className="text-sm font-medium text-ink">
                    156 MB / 5 GB
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-rule">
                  <div
                    className="h-full rounded-full bg-accent3 transition-all"
                    style={{ width: "3.1%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="rounded-xl bg-accent px-6 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90">
            保存设置
          </button>
        </div>
      </div>
    </PageContainer>
  );
}
