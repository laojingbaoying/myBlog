import type { Metadata } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { PageViewTracker } from "@/components/PageViewTracker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-noto-sans-sc",
  display: "swap",
  weight: ["400", "500", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://myblog.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "My Blog — 个人技术博客",
    template: "%s | My Blog",
  },
  description: "分享前端开发、技术思考与学习笔记",
  keywords: ["博客", "前端", "React", "Next.js", "技术", "TypeScript", "Tailwind CSS"],
  authors: [{ name: "Zhao" }],
  creator: "Zhao",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "My Blog",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${notoSansSC.variable}`} suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <Providers>
        <PageViewTracker />
        <Navbar />
        <main>{children}</main>

        {/* 页脚 */}
        <footer className="border-t border-zinc-200 dark:border-zinc-800/50 py-10 mt-20">
          <div className="mx-auto max-w-6xl px-6 flex flex-col items-center gap-4 text-sm text-zinc-400 dark:text-zinc-500">
            <div className="flex items-center gap-6">
              <a href="/" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">首页</a>
              <a href="/posts" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">文章</a>
              <a href="/archive" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">归档</a>
              <a href="/about" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">关于</a>
            </div>
            <p>© {new Date().getFullYear()} My Blog. All rights reserved.</p>
          </div>
        </footer>
        </Providers>
      </body>
    </html>
  );
}
