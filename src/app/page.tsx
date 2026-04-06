import { HeroCarousel } from "@/components/HeroCarousel";
import { PostCard } from "@/components/PostCard";
import { getAllPosts, getFeaturedPosts } from "@/lib/mdx";

export default function HomePage() {
  const featured = getFeaturedPosts().slice(0, 3);
  const latest = getAllPosts().slice(0, 6);

  return (
    <>
      {/* Hero 轮播 */}
      <HeroCarousel />

      {/* 精选文章 */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">精选文章</h2>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">深度好文，值得细读</p>
          </div>
          <a
            href="/posts"
            className="text-sm text-violet-500 dark:text-violet-400 transition-colors hover:text-violet-400 dark:hover:text-violet-300"
          >
            查看全部 →
          </a>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((post) => (
            <PostCard
              key={post.slug}
              slug={post.slug}
              title={post.frontmatter.title}
              excerpt={post.frontmatter.excerpt}
              date={post.frontmatter.date}
              readingTime={post.readingTime}
              tags={post.frontmatter.tags}
              coverImage={post.frontmatter.coverImage}
              featured
            />
          ))}
        </div>
      </section>

      {/* 最新发布 */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">最新发布</h2>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">最近更新的文章</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {latest.map((post) => (
            <PostCard
              key={post.slug}
              slug={post.slug}
              title={post.frontmatter.title}
              excerpt={post.frontmatter.excerpt}
              date={post.frontmatter.date}
              readingTime={post.readingTime}
              tags={post.frontmatter.tags}
              coverImage={post.frontmatter.coverImage}
            />
          ))}
        </div>
      </section>
    </>
  );
}
