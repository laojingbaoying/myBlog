import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 记录一次页面访问
export async function POST(req: NextRequest) {
  const body = await req.json();
  const path = typeof body.path === "string" ? body.path.trim() : "";
  if (!path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  await prisma.pageView.create({ data: { path } });
  return NextResponse.json({ success: true }, { status: 201 });
}

// 查询统计数据
export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type") ?? "summary";
  const path = req.nextUrl.searchParams.get("path");

  // 总访问量
  if (type === "summary") {
    const total = await prisma.pageView.count();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await prisma.pageView.count({
      where: { createdAt: { gte: today } },
    });

    // 页面排行
    const topPages = await prisma.pageView.groupBy({
      by: ["path"],
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 10,
    });

    return NextResponse.json({
      total,
      today: todayCount,
      topPages: topPages.map((p) => ({ path: p.path, count: p._count.path })),
    });
  }

  // 单页面访问量
  if (type === "page" && path) {
    const count = await prisma.pageView.count({ where: { path } });
    return NextResponse.json({ path, count });
  }

  // 最近 30 天每日访问量（图表用）
  if (type === "daily") {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const views = await prisma.pageView.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    // 按日期分组
    const dailyMap = new Map<string, number>();
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - 29 + i);
      const key = d.toISOString().slice(0, 10);
      dailyMap.set(key, 0);
    }

    for (const v of views) {
      const key = v.createdAt.toISOString().slice(0, 10);
      dailyMap.set(key, (dailyMap.get(key) ?? 0) + 1);
    }

    const daily = Array.from(dailyMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    return NextResponse.json({ daily });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
