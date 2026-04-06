import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Calendar, Clock, ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import { mdxComponents } from "@/components/MDXComponents";
import { TableOfContents } from "@/components/TableOfContents";
import { CommentSection } from "@/components/CommentSection";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 静态生成所有文章路径
export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

// 动态 metadata
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      type: "article",
      publishedTime: post.frontmatter.date,
      tags: post.frontmatter.tags,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  // 上下篇导航
  const allPosts = getAllPosts();
  const currentIdx = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIdx < allPosts.length - 1 ? allPosts[currentIdx + 1] : null;
  const nextPost = currentIdx > 0 ? allPosts[currentIdx - 1] : null;

  return (
    <div className="mx-auto max-w-6xl px-6 pt-28 pb-20">
      {/* 返回链接 */}
      <Link
        href="/posts"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
      >
        <ChevronLeft className="h-4 w-4" />
        返回文章列表
      </Link>

      <div className="flex gap-12">
        {/* 主内容区 */}
        <article className="min-w-0 flex-1">
          {/* 文章头部 */}
          <header className="mb-10">
            {/* 标签 */}
            <div className="mb-4 flex flex-wrap gap-2">
              {post.frontmatter.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/archive?view=tags&tag=${encodeURIComponent(tag)}`}
                  className="rounded-full bg-violet-100 dark:bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-600 dark:text-violet-400 ring-1 ring-violet-300 dark:ring-violet-500/20 transition-colors hover:bg-violet-200 dark:hover:bg-violet-500/20"
                >
                  {tag}
                </Link>
              ))}
            </div>

            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {post.frontmatter.title}
            </h1>

            <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(post.frontmatter.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readingTime}
              </span>
            </div>

            {/* 封面图 */}
            {post.frontmatter.coverImage && (
              <div className="mt-8 overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.frontmatter.coverImage}
                  alt={post.frontmatter.title}
                  className="w-full object-cover"
                />
              </div>
            )}
          </header>

          {/* MDX 文章正文 */}
          <div className="prose-blog">
            <MDXRemote
              source={post.content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug, rehypeHighlight],
                },
              }}
            />
          </div>

          {/* 分割线 */}
          <hr className="my-12 border-zinc-200 dark:border-zinc-800" />

          {/* 评论区 */}
          <CommentSection slug={slug} />

          {/* 分割线 */}
          <hr className="my-12 border-zinc-200 dark:border-zinc-800" />

          {/* 上下篇导航 */}
          <nav className="grid gap-4 sm:grid-cols-2">
            {prevPost ? (
              <Link
                href={`/posts/${prevPost.slug}`}
                className="group flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 transition-all hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              >
                <span className="mb-2 flex items-center gap-1 text-xs text-zinc-500">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  上一篇
                </span>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors group-hover:text-zinc-950 dark:group-hover:text-white">
                  {prevPost.frontmatter.title}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {nextPost ? (
              <Link
                href={`/posts/${nextPost.slug}`}
                className="group flex flex-col items-end rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 transition-all hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              >
                <span className="mb-2 flex items-center gap-1 text-xs text-zinc-500">
                  下一篇
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors group-hover:text-zinc-950 dark:group-hover:text-white">
                  {nextPost.frontmatter.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        </article>

        {/* 右侧目录 */}
        <aside className="hidden w-56 shrink-0 xl:block">
          <TableOfContents content={post.content} />
        </aside>
      </div>
    </div>
  );
}
