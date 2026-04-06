import { getAllPosts } from "@/lib/mdx";
import { PostCard } from "@/components/PostCard";
import { PostListClient } from "@/components/PostListClient";

export const metadata = {
  title: "所有文章",
  description: "浏览全部博客文章",
};

export default function PostsPage() {
  // 服务端获取首批文章
  const allPosts = getAllPosts();
  const initialPosts = allPosts.slice(0, 6);
  const hasMore = allPosts.length > 6;
  const nextCursor = hasMore ? initialPosts[initialPosts.length - 1]?.slug : undefined;

  const serialized = initialPosts.map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    excerpt: p.frontmatter.excerpt,
    date: p.frontmatter.date,
    readingTime: p.readingTime,
    tags: p.frontmatter.tags,
    coverImage: p.frontmatter.coverImage,
  }));

  return (
    <div className="mx-auto max-w-6xl px-6 pt-28 pb-20">
      {/* 页面标题 */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">所有文章</h1>
        <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
          共 {allPosts.length} 篇文章，持续更新中
        </p>
      </div>

      {/* 文章列表 + 无限滚动 */}
      <PostListClient
        initialPosts={serialized}
        initialHasMore={hasMore}
        initialCursor={nextCursor}
      />
    </div>
  );
}
