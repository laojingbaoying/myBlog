"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** 自动记录页面访问量 */
export function usePageView() {
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
    }).catch(() => {
      // 静默忽略统计请求失败
    });
  }, [pathname]);
}

/** 页面访问记录组件，放在 layout 中即可自动工作 */
export function PageViewTracker() {
  usePageView();
  return null;
}
