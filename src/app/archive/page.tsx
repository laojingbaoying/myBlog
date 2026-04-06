import Link from "next/link";
import { Calendar, Tag, Clock } from "lucide-react";
import { getAllTags, getPostsGroupedByMonth, getPostsByTag } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import { ArchiveTabs } from "@/components/ArchiveTabs";

export const metadata = {
  title: "归档",
  description: "按时间和标签浏览所有文章",
};

interface PageProps {
  searchParams: Promise<{ view?: string; tag?: string }>;
}

export default async function ArchivePage({ searchParams }: PageProps) {
  const { view = "time", tag } = await searchParams;

  const grouped = getPostsGroupedByMonth();
  const tags = getAllTags();
  const tagPosts = tag ? getPostsByTag(tag) : [];

  return (
    <div className="mx-auto max-w-4xl px-6 pt-28 pb-20">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">归档</h1>
        <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">浏览所有文章</p>
      </div>

      {/* 切换选项卡 */}
      <ArchiveTabs currentView={view} />

      {/* 按时间归档 */}
      {view === "time" && (
        <div className="mt-10 space-y-12">
          {grouped.map(({ year, months }) => (
            <section key={year}>
              <h2 className="mb-6 text-2xl font-bold text-zinc-800 dark:text-zinc-100">{year} 年</h2>
              {months.map(({ month, posts }) => (
                <div key={month} className="mb-8">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-zinc-600 dark:text-zinc-300">
                    <Calendar className="h-4 w-4 text-violet-400" />
                    {month} 月
                    <span className="text-sm text-zinc-600">({posts.length} 篇)</span>
                  </h3>
                  <div className="border-l-2 border-zinc-200 dark:border-zinc-800 pl-6 space-y-4">
                    {posts.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/posts/${post.slug}`}
                        className="group flex items-start gap-4 rounded-lg p-3 -ml-3 transition-colors hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50"
                      >
                        {/* 时间线圆点 */}
                        <div className="relative mt-2">
                          <div className="absolute -left-[calc(1.5rem+7px)] h-3 w-3 rounded-full border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 transition-colors group-hover:border-violet-500 group-hover:bg-violet-500/20" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-zinc-700 dark:text-zinc-200 transition-colors group-hover:text-zinc-950 dark:group-hover:text-white truncate">
                            {post.frontmatter.title}
                          </h4>
                          <div className="mt-1.5 flex items-center gap-3 text-xs text-zinc-500">
                            <span>{formatDate(post.frontmatter.date)}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.readingTime}
                            </span>
                            <div className="flex gap-1.5">
                              {post.frontmatter.tags.map((t) => (
                                <span key={t} className="rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-zinc-500 dark:text-zinc-400">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          ))}
        </div>
      )}

      {/* 按标签分类 */}
      {view === "tags" && (
        <div className="mt-10">
          {/* 标签云 */}
          <div className="flex flex-wrap gap-2 mb-10">
            {tags.map((t) => (
              <Link
                key={t.name}
                href={`/archive?view=tags&tag=${encodeURIComponent(t.name)}`}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  tag === t.name
                    ? "bg-violet-500/20 text-violet-600 dark:text-violet-300 ring-1 ring-violet-500/40"
                    : "bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                <Tag className="mr-1.5 inline h-3.5 w-3.5" />
                {t.name}
                <span className="ml-1.5 text-xs opacity-60">{t.count}</span>
              </Link>
            ))}
          </div>

          {/* 标签下的文章列表 */}
          {tag ? (
            <div>
              <h3 className="mb-6 text-xl font-semibold text-zinc-700 dark:text-zinc-200">
                标签「{tag}」下的文章
                <span className="ml-2 text-sm text-zinc-500">({tagPosts.length} 篇)</span>
              </h3>
              <div className="space-y-3">
                {tagPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/posts/${post.slug}`}
                    className="group flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800/60 p-4 transition-all hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-zinc-700 dark:text-zinc-200 transition-colors group-hover:text-zinc-950 dark:group-hover:text-white truncate">
                        {post.frontmatter.title}
                      </h4>
                      <p className="mt-1 text-sm text-zinc-500 truncate">
                        {post.frontmatter.excerpt}
                      </p>
                    </div>
                    <span className="ml-4 shrink-0 text-xs text-zinc-600">
                      {formatDate(post.frontmatter.date)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-zinc-500">点击上方标签查看对应文章</p>
          )}
        </div>
      )}
    </div>
  );
}
