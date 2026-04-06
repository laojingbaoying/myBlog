"use client";

import { useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { PostCard } from "@/components/PostCard";
import { Loader2 } from "lucide-react";

interface SerializedPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  tags: string[];
  coverImage?: string;
}

interface PostListClientProps {
  initialPosts: SerializedPost[];
  initialHasMore: boolean;
  initialCursor?: string;
}

export function PostListClient({
  initialPosts,
  initialHasMore,
  initialCursor,
}: PostListClientProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !cursor) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/posts?cursor=${cursor}&limit=6`);
      const data = await res.json();

      setPosts((prev) => [...prev, ...data.posts]);
      setHasMore(data.hasMore);
      setCursor(data.nextCursor);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, cursor]);

  // 当哨兵元素进入视口时自动加载更多
  const { ref: sentinelRef } = useInView({
    threshold: 0,
    rootMargin: "200px",
    onChange: (inView) => {
      if (inView) loadMore();
    },
  });

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} {...post} />
        ))}
      </div>

      {/* 加载状态 / 哨兵 */}
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-12">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              加载更多...
            </div>
          )}
        </div>
      )}

      {/* 已全部加载 */}
      {!hasMore && posts.length > 0 && (
        <div className="py-12 text-center text-sm text-zinc-600">
          — 已经到底了 —
        </div>
      )}
    </>
  );
}
