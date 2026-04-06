"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, FileText, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResult {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags?: string[];
  coverImage?: string;
}

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Ctrl+K / Cmd+K 快捷键
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // 打开时聚焦
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults([]);
      setActiveIndex(0);
    }
  }, [open]);

  // 防抖搜索
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query.trim())}`
        );
        const data = await res.json();
        setResults(data.results ?? []);
        setActiveIndex(0);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const navigate = useCallback(
    (slug: string) => {
      setOpen(false);
      router.push(`/posts/${slug}`);
    },
    [router]
  );

  // 键盘导航
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      navigate(results[activeIndex].slug);
    }
  }

  // 高亮匹配文本
  function highlight(text: string) {
    if (!query.trim()) return text;
    const regex = new RegExp(
      `(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-violet-500/30 text-violet-300 rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  }

  return (
    <>
      {/* 搜索触发按钮 */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 px-3 py-1.5 text-sm text-zinc-500 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-600 dark:hover:text-zinc-400"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">搜索文章...</span>
        <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-1.5 text-[10px] text-zinc-500">
          ⌘K
        </kbd>
      </button>

      {/* 弹窗 */}
      <AnimatePresence>
        {open && (
          <>
            {/* 遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* 搜索面板 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -20 }}
              transition={{ duration: 0.15 }}
              className="fixed left-1/2 top-[15vh] z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl"
            >
              {/* 输入栏 */}
              <div className="flex items-center border-b border-zinc-200 dark:border-zinc-800 px-4">
                <Search className="h-4 w-4 shrink-0 text-zinc-500" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="搜索文章标题、摘要、标签..."
                  className="flex-1 bg-transparent px-3 py-4 text-sm text-zinc-800 dark:text-zinc-200 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="text-zinc-600 hover:text-zinc-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* 结果列表 */}
              <div className="max-h-[50vh] overflow-y-auto p-2">
                {loading && (
                  <div className="flex items-center justify-center py-8 text-zinc-500">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                )}

                {!loading && query && results.length === 0 && (
                  <div className="py-10 text-center text-sm text-zinc-600">
                    没有找到相关文章
                  </div>
                )}

                {!loading &&
                  results.map((r, i) => (
                    <button
                      key={r.slug}
                      onClick={() => navigate(r.slug)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                        i === activeIndex
                          ? "bg-violet-500/10 text-zinc-800 dark:text-zinc-200"
                          : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                      }`}
                    >
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">
                          {highlight(r.title)}
                        </div>
                        {r.excerpt && (
                          <div className="mt-1 text-xs text-zinc-500 line-clamp-2">
                            {highlight(r.excerpt)}
                          </div>
                        )}
                        {r.tags && r.tags.length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {r.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-500"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {i === activeIndex && (
                        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                      )}
                    </button>
                  ))}

                {!loading && !query && (
                  <div className="py-10 text-center text-sm text-zinc-600">
                    输入关键词开始搜索
                  </div>
                )}
              </div>

              {/* 底部提示 */}
              <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 px-4 py-2 text-[11px] text-zinc-400 dark:text-zinc-600">
                <div className="flex items-center gap-3">
                  <span>
                    <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1">↑↓</kbd> 导航
                  </span>
                  <span>
                    <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1">↵</kbd> 打开
                  </span>
                </div>
                <span>
                  <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1">Esc</kbd> 关闭
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
