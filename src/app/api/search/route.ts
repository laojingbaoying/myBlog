import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "@/lib/mdx";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim().toLowerCase();
  if (!q || q.length < 1) {
    return NextResponse.json({ results: [] });
  }

  const posts = await getAllPosts();

  const results = posts.filter((post) => {
    const title = post.title?.toLowerCase() ?? "";
    const excerpt = post.excerpt?.toLowerCase() ?? "";
    const tags = (post.tags as string[] | undefined)?.join(" ").toLowerCase() ?? "";
    return title.includes(q) || excerpt.includes(q) || tags.includes(q);
  });

  return NextResponse.json({
    results: results.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      date: p.date,
      tags: p.tags,
      coverImage: p.coverImage,
    })),
  });
}
