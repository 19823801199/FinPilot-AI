import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4">
      <h1 className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-8xl font-bold text-transparent">
        404
      </h1>
      <p className="mt-4 text-lg text-muted">页面不存在</p>
      <p className="mt-2 text-sm text-muted">您访问的页面不存在或已被移除</p>
      <Link
        href="/workspace"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-surface px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface2"
      >
        <span>🏠</span>
        返回首页
      </Link>
    </div>
  );
}
