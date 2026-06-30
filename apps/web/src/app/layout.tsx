import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | FinPilot AI",
    default: "FinPilot AI - AI驱动的金融智能平台",
  },
  description: "AI 驱动的金融智能平台 — 金融学习、股票研究与知识管理",
  keywords: ["FinPilot", "AI", "金融", "股票分析", "知识库", "学习平台"],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "FinPilot AI - AI驱动的金融智能平台",
    description: "集 AI 金融学习、AI 股票研究、AI 知识库管理于一体的专业金融智能工作台",
    url: "https://finpilot.ai",
    siteName: "FinPilot AI",
    images: [
      {
        url: "/og-image.jpg",
        width: 1280,
        height: 720,
        alt: "FinPilot AI - AI-Powered Financial Intelligence",
      },
    ],
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinPilot AI - AI驱动的金融智能平台",
    description: "集 AI 金融学习、AI 股票研究、AI 知识库管理于一体的专业金融智能工作台",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark" suppressHydrationWarning>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
