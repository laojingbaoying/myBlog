"use client";

import Link from "next/link";
import { Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArchiveTabsProps {
  currentView: string;
}

export function ArchiveTabs({ currentView }: ArchiveTabsProps) {
  const tabs = [
    { value: "time", label: "按时间归档", icon: Calendar },
    { value: "tags", label: "按标签分类", icon: Tag },
  ];

  return (
    <div className="flex gap-1 rounded-xl bg-zinc-100 dark:bg-zinc-900/50 p-1 border border-zinc-200 dark:border-zinc-800/60">
      {tabs.map((tab) => (
        <Link
          key={tab.value}
          href={`/archive?view=${tab.value}`}
          className={cn(
            "flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all flex-1 justify-center",
            currentView === tab.value
              ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          )}
        >
          <tab.icon className="h-4 w-4" />
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
