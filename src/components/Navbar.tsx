"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchDialog } from "@/components/SearchDialog";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/posts", label: "文章" },
  { href: "/archive", label: "归档", hasDropdown: true },
  { href: "/about", label: "关于" },
];

const archiveItems = [
  { href: "/archive?view=time", label: "按时间归档", icon: Calendar },
  { href: "/archive?view=tags", label: "按标签分类", icon: Tag },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);

  // 监听滚动，控制导航栏背景
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 路由变化时关闭移动端菜单
  useEffect(() => {
    setMobileOpen(false);
    setArchiveOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800/50 shadow-sm dark:shadow-lg dark:shadow-black/20"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight transition-colors hover:text-violet-500 dark:hover:text-violet-400"
        >
          <span className="text-gradient">MyBlog</span>
        </Link>

        {/* 桌面端导航 */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <li key={link.href} className="relative">
                {link.hasDropdown ? (
                  /* 归档下拉菜单 */
                  <div
                    className="relative"
                    onMouseEnter={() => setArchiveOpen(true)}
                    onMouseLeave={() => setArchiveOpen(false)}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                        isActive
                          ? "text-zinc-900 dark:text-white bg-zinc-200/60 dark:bg-white/10"
                          : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
                      )}
                    >
                      {link.label}
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform duration-200",
                          archiveOpen && "rotate-180"
                        )}
                      />
                    </Link>

                    <AnimatePresence>
                      {archiveOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-1 w-48 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/95 backdrop-blur-xl p-1.5 shadow-lg dark:shadow-xl dark:shadow-black/30"
                        >
                          {archiveItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
                            >
                              <item.icon className="h-4 w-4 text-violet-500 dark:text-violet-400" />
                              {item.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      "rounded-lg px-4 py-2 text-sm font-medium transition-all",
                      isActive
                        ? "text-zinc-900 dark:text-white bg-zinc-200/60 dark:bg-white/10"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
                    )}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {/* 搜索 + 移动端按钮 */}
        <div className="flex items-center gap-2">
          <SearchDialog />
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden rounded-lg p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
          aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
        >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* 移动端展开菜单 */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-zinc-200 dark:border-zinc-800/50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl md:hidden"
          >
            <div className="mx-auto max-w-6xl space-y-1 px-6 py-4">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <div key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "block rounded-lg px-4 py-3 text-sm font-medium transition-all",
                        isActive
                          ? "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-white/10"
                          : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
                      )}
                    >
                      {link.label}
                    </Link>

                    {/* 移动端归档子菜单 */}
                    {link.hasDropdown && (
                      <div className="ml-4 space-y-0.5 mt-0.5">
                        {archiveItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
                          >
                            <item.icon className="h-4 w-4 text-violet-500 dark:text-violet-400/70" />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
