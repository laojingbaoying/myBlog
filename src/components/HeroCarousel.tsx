"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Slide {
  title: string;
  subtitle: string;
  image: string;
  gradient: string;
}

const slides: Slide[] = [
  {
    title: "我是裘戈，也是绪方九段",
    subtitle: "欢迎你能来看我的主页~",
    image: "/images/lls6.png",
    gradient: "from-indigo-950/90 via-indigo-950/50 to-transparent",
  },
  {
    title: "莉莉丝一直陪伴着你哦~",
    subtitle: "如果累了，就抱抱她吧~",
    image: "/images/lls5.png",
    gradient: "from-rose-950/90 via-rose-950/50 to-transparent",
  },
  {
    title: "这里记录成长的每一步",
    subtitle: "学习笔记 · 项目复盘 · 思考沉淀",
    image: "/images/lls7.png",
    gradient: "from-amber-950/90 via-amber-950/50 to-transparent",
  },
  {
    title: "前面就是没去过的地方喽",
    subtitle: "在这里提高你的实力，朝着你的目标迈进吧",
    image: "/images/lls4.png",
    gradient: "from-cyan-950/90 via-cyan-950/50 to-transparent",
  },
];

const INTERVAL = 6000;

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0); // -1: prev, 1: next

  const go = useCallback(
    (dir: 1 | -1) => {
      setDirection(dir);
      setCurrent((prev) => (prev + dir + slides.length) % slides.length);
    },
    []
  );

  // 自动播放
  useEffect(() => {
    const timer = setInterval(() => go(1), INTERVAL);
    return () => clearInterval(timer);
  }, [go, current]);

  const slide = slides[current];

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
      {/* 背景图片层 */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        </motion.div>
      </AnimatePresence>

      {/* 多层渐变遮罩 — 仅暗色模式 */}
      <div className="absolute inset-0 bg-zinc-950/40 hidden dark:block" />
      <div className={cn("absolute inset-0 bg-gradient-to-r hidden dark:block", slide.gradient)} />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent hidden dark:block" />
      {/* 亮色模式：底部微弱渐变，保证按钮区域可读 */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent dark:hidden" />

      {/* 文字内容 */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-6xl px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <motion.h1
                className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl [text-shadow:_0_2px_12px_rgb(0_0_0_/_0.35)] dark:[text-shadow:none]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                {slide.title}
              </motion.h1>

              <motion.p
                className="mt-4 text-lg text-zinc-600 dark:text-zinc-300 sm:text-xl [text-shadow:_0_1px_8px_rgb(0_0_0_/_0.25)] dark:[text-shadow:none]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
              >
                {slide.subtitle}
              </motion.p>

              <motion.div
                className="mt-8 flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <a
                  href="/posts"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition-all hover:bg-zinc-200 hover:scale-105 active:scale-95"
                >
                  开始阅读
                </a>
                <a
                  href="/about"
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:scale-105 active:scale-95"
                >
                  了解更多
                </a>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 左右箭头 */}
      <button
        onClick={() => go(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/30 p-2.5 text-white/70 backdrop-blur-sm transition-all hover:bg-black/50 hover:text-white hover:scale-110 sm:left-6"
        aria-label="上一张"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => go(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/30 p-2.5 text-white/70 backdrop-blur-sm transition-all hover:bg-black/50 hover:text-white hover:scale-110 sm:right-6"
        aria-label="下一张"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* 底部圆点指示器 */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            aria-label={`切换到第 ${i + 1} 张`}
            className="group relative h-2.5 rounded-full transition-all duration-300"
            style={{ width: i === current ? 32 : 10 }}
          >
            <span
              className={cn(
                "absolute inset-0 rounded-full transition-all duration-300",
                i === current ? "bg-white" : "bg-white/40 group-hover:bg-white/70"
              )}
            />
            {/* 自动播放进度条 */}
            {i === current && (
              <motion.span
                className="absolute inset-0 rounded-full bg-violet-400 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: INTERVAL / 1000, ease: "linear" }}
                key={`progress-${current}`}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
