import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

// 博客文章目录
const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export interface PostFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  coverImage?: string;
  featured?: boolean;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: string;
}

/** 获取单篇文章（通过 slug） */
export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return {
    slug,
    frontmatter: data as PostFrontmatter,
    content,
    readingTime: stats.text.replace("min read", "min"),
  };
}

/** 获取所有文章，按日期倒序 */
export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      return getPostBySlug(slug);
    })
    .filter((p): p is Post => p !== null)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );

  return posts;
}

/** 获取精选文章 */
export function getFeaturedPosts(): Post[] {
  return getAllPosts().filter((p) => p.frontmatter.featured);
}

/** 获取所有标签及其文章数 */
export function getAllTags(): { name: string; count: number }[] {
  const tagMap = new Map<string, number>();

  for (const post of getAllPosts()) {
    for (const tag of post.frontmatter.tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/** 获取按标签筛选的文章 */
export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((p) =>
    p.frontmatter.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

/** 获取按年月分组的文章（归档用） */
export function getPostsGroupedByMonth(): {
  year: number;
  months: { month: number; posts: Post[] }[];
}[] {
  const posts = getAllPosts();
  const grouped = new Map<string, Post[]>();

  for (const post of posts) {
    const d = new Date(post.frontmatter.date);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(post);
  }

  // 按年分组
  const yearMap = new Map<number, { month: number; posts: Post[] }[]>();

  for (const [key, posts] of grouped) {
    const [year, month] = key.split("-").map(Number);
    if (!yearMap.has(year)) yearMap.set(year, []);
    yearMap.get(year)!.push({ month, posts });
  }

  return Array.from(yearMap.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, months]) => ({
      year,
      months: months.sort((a, b) => b.month - a.month),
    }));
}

/** 分页获取文章（cursor-based） */
export function getPostsPaginated(cursor?: string, limit = 6) {
  const all = getAllPosts();
  let startIdx = 0;

  if (cursor) {
    const idx = all.findIndex((p) => p.slug === cursor);
    if (idx !== -1) startIdx = idx + 1;
  }

  const posts = all.slice(startIdx, startIdx + limit);
  const hasMore = startIdx + limit < all.length;
  const nextCursor = hasMore ? posts[posts.length - 1]?.slug : undefined;

  return { posts, hasMore, nextCursor };
}
