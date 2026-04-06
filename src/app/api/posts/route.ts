import { NextRequest, NextResponse } from "next/server";
import { getPostsPaginated } from "@/lib/mdx";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor") ?? undefined;
  const limit = Math.min(Number(searchParams.get("limit") ?? 6), 20);

  const result = getPostsPaginated(cursor, limit);

  // 序列化为前端需要的格式
  const posts = result.posts.map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    excerpt: p.frontmatter.excerpt,
    date: p.frontmatter.date,
    readingTime: p.readingTime,
    tags: p.frontmatter.tags,
    coverImage: p.frontmatter.coverImage,
  }));

  return NextResponse.json({
    posts,
    hasMore: result.hasMore,
    nextCursor: result.nextCursor,
  });
}
