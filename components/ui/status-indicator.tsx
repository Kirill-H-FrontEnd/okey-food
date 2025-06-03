"use client";
import { cn } from "@/lib/utils";
import { FC } from "react";

export const StatusIndicator: FC = () => {
  const hour = new Date().getHours();

  const isOpen = hour >= 10 && hour < 20;

  const indicatorBg = isOpen
    ? "from-green-600 to-green-600"
    : "from-red-400 to-red-600";
  const rippleGradient = isOpen
    ? "bg-[radial-gradient(circle,_rgba(34,197,94,0.7)_0%,_rgba(34,197,94,0.2)_60%,_transparent_100%)]"
    : "bg-[radial-gradient(circle,_rgba(239,68,68,0.4)_0%,_rgba(239,68,68,0.2)_60%,_transparent_100%)]";
  const textColor = isOpen
    ? "text-green-600 dark:text-slate-100"
    : "text-red-600 dark:text-red-400";
  const bgContainer = isOpen
    ? "bg-linear-to-b from-whitePrimary to-slate-300 "
    : "bg-linear-to-b from-whitePrimary to-slate-300 ";
  const borderColor = isOpen
    ? "border border-green-50 "
    : "border border-red-50 ";

  const label = isOpen ? "Открыто" : "Закрыто";

  return (
    <div
      translate="no"
      className={cn(
        "rounded-full py-[9px] px-3 flex gap-[6px] items-center mt-5 w-[100px]",
        bgContainer,
        borderColor
      )}
    >
      <span className="relative flex h-3 w-3 items-center justify-center">
        <span
          className={cn(
            "absolute inset-0 rounded-full animate-ping",
            rippleGradient
          )}
        />
        <span
          className={cn(
            "relative h-2 w-2 rounded-full bg-gradient-to-br",
            indicatorBg
          )}
        />
      </span>

      <p className={cn("text-[13px] leading-none font-semibold", textColor)}>
        {label}
      </p>
    </div>
  );
};
