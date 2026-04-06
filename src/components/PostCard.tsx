"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

interface PostCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime?: string;
  tags?: string[];
  coverImage?: string;
  featured?: boolean;
}

export function PostCard({
  slug,
  title,
  excerpt,
  date,
  readingTime,
  tags = [],
  coverImage,
  featured = false,
}: PostCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // 倾斜角度（最大 12 度）
    const rY = ((x - centerX) / centerX) * 12;
    const rX = ((centerY - y) / centerY) * 12;

    setRotateX(rX);
    setRotateY(rY);
    setGlareX((x / rect.width) * 100);
    setGlareY((y / rect.height) * 100);
  }

  function handleMouseLeave() {
    setRotateX(0);
    setRotateY(0);
    setGlareX(50);
    setGlareY(50);
  }

  return (
    <Link href={`/posts/${slug}`} className="block group">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 transition-all duration-200 ease-out shadow-sm dark:shadow-none",
          "hover:border-zinc-300 dark:hover:border-zinc-700/80 hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-violet-500/5",
          featured && "md:col-span-2 lg:col-span-1"
        )}
      >
        {/* 光泽效果层 */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.08) 0%, transparent 60%)`,
          }}
        />

        {/* 边框光效 */}
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(139,92,246,0.15) 0%, transparent 50%)`,
          }}
        />

        {/* 封面图 */}
        {coverImage && (
          <div className="relative h-48 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: `url(${coverImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-900 via-white/20 dark:via-zinc-900/20 to-transparent" />
          </div>
        )}

        {/* 内容 */}
        <div className={cn("relative z-20 p-5", coverImage ? "pt-4" : "pt-5")}>
          {/* 标签 */}
          {tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-violet-100 dark:bg-violet-500/10 px-2.5 py-0.5 text-xs font-medium text-violet-600 dark:text-violet-400 ring-1 ring-violet-300 dark:ring-violet-500/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 标题 */}
          <h3 className="text-lg font-semibold leading-snug text-zinc-800 dark:text-zinc-100 transition-colors group-hover:text-zinc-950 dark:group-hover:text-white">
            {title}
          </h3>

          {/* 摘要 */}
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            {excerpt}
          </p>

          {/* 底部信息 */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(date)}
              </span>
              {readingTime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {readingTime}
                </span>
              )}
            </div>

            <span className="flex items-center gap-1 text-xs font-medium text-violet-400 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2">
              阅读
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
