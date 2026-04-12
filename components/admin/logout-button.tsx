"use client";
import { LogOut } from "lucide-react";
import { signOut } from "@/app/login/actions";
import { useTransition } from "react";

interface LogoutButtonProps {
  collapsed?: boolean;
  variant?: "sidebar" | "mobile";
}

export function LogoutButton({
  collapsed,
  variant = "sidebar",
}: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  if (variant === "mobile") {
    return (
      <button
        onClick={() => startTransition(() => signOut())}
        disabled={isPending}
        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
      >
        <LogOut size={17} className="shrink-0" />
        {isPending ? "Выход..." : "Выйти"}
      </button>
    );
  }

  return (
    <button
      onClick={() => startTransition(() => signOut())}
      disabled={isPending}
      title={collapsed ? "Выйти" : undefined}
      className="w-full flex items-center py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
    >
      <span className="w-[48px] flex items-center justify-center shrink-0">
        <LogOut size={17} />
      </span>
      <span
        className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
          collapsed ? "max-w-0 opacity-0" : "max-w-[140px] opacity-100 pr-3"
        }`}
      >
        {isPending ? "Выход..." : "Выйти"}
      </span>
    </button>
  );
}
