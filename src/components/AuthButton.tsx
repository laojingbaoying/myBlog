"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { LogIn, LogOut, Github } from "lucide-react";
import { cn } from "@/lib/utils";

export function AuthButton({ className }: { className?: string }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className={cn("h-9 w-20 animate-pulse rounded-lg bg-zinc-800", className)} />
    );
  }

  if (session?.user) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        {session.user.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt={session.user.name ?? ""}
            className="h-7 w-7 rounded-full"
          />
        )}
        <span className="text-sm text-zinc-300">{session.user.name}</span>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-300 hover:bg-zinc-800"
        >
          <LogOut className="h-3.5 w-3.5" />
          退出
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className={cn(
        "flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:bg-zinc-700 hover:text-white",
        className
      )}
    >
      <LogIn className="h-4 w-4" />
      登录
    </button>
  );
}
