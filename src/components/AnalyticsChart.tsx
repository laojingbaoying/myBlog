"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3, Eye, TrendingUp } from "lucide-react";

interface DailyData {
  date: string;
  count: number;
}

interface SummaryData {
  total: number;
  today: number;
  topPages: { path: string; count: number }[];
}

export function AnalyticsChart() {
  const [daily, setDaily] = useState<DailyData[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [dailyRes, summaryRes] = await Promise.all([
          fetch("/api/analytics?type=daily"),
          fetch("/api/analytics?type=summary"),
        ]);
        const dailyData = await dailyRes.json();
        const summaryData = await summaryRes.json();
        setDaily(dailyData.daily ?? []);
        setSummary(summaryData);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800/50" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800/50" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-2">
            <Eye className="h-4 w-4" />
            总访问量
          </div>
          <p className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">
            {summary?.total ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-2">
            <TrendingUp className="h-4 w-4" />
            今日访问
          </div>
          <p className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">
            {summary?.today ?? 0}
          </p>
        </div>
      </div>

      {/* 30 天趋势图 */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5">
        <h4 className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-4">
          <BarChart3 className="h-4 w-4" />
          近 30 天访问趋势
        </h4>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={daily}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#71717a", fontSize: 11 }}
              tickFormatter={(v: string) => v.slice(5)} // MM-DD
              axisLine={{ stroke: "#3f3f46" }}
            />
            <YAxis
              tick={{ fill: "#71717a", fontSize: 11 }}
              axisLine={{ stroke: "#3f3f46" }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                borderRadius: "0.75rem",
                fontSize: "0.75rem",
              }}
              labelStyle={{ color: "#a1a1aa" }}
              itemStyle={{ color: "#a78bfa" }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#8b5cf6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCount)"
              name="访问量"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 热门页面 */}
      {summary?.topPages && summary.topPages.length > 0 && (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5">
          <h4 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-4">热门页面</h4>
          <div className="space-y-2">
            {summary.topPages.map((page, i) => (
              <div
                key={page.path}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs text-zinc-600 w-5 text-right">{i + 1}</span>
                  <span className="text-zinc-300 truncate">{page.path}</span>
                </div>
                <span className="text-zinc-500 shrink-0 ml-3">{page.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
