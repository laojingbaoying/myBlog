import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="text-8xl font-black text-gradient mb-4">404</div>
      <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">
        页面未找到
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-md">
        你访问的页面不存在或已被移除，请检查链接是否正确。
      </p>
      <Link
        href="/"
        className="rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-violet-500 hover:scale-105 active:scale-95"
      >
        返回首页
      </Link>
    </div>
  );
}
