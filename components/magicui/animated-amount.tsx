// components/magicui/animated-amount.tsx
"use client";
import { FC, useEffect, useRef } from "react";

type AnimatedAmountProps = {
  value: string;
  durationMs?: number; // 300 по умолчанию
  offsetPx?: number; // на сколько "въезжать" снизу
};

export const AnimatedAmount: FC<AnimatedAmountProps> = ({
  value,
  durationMs = 1000,
  offsetPx = 10,
}) => {
  const spanRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    // начальное состояние
    el.style.transition = "none";
    el.style.opacity = "0";
    el.style.transform = `translateY(${offsetPx}px)`;

    // в следующий кадр запускаем анимацию
    const raf = requestAnimationFrame(() => {
      el.style.transition = `transform ${durationMs}ms ease, opacity ${durationMs}ms ease`;
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });

    return () => cancelAnimationFrame(raf);
  }, [value, durationMs, offsetPx]);

  return (
    <span
      ref={spanRef}
      className="inline-block will-change-[transform,opacity] tabular-nums"
      aria-live="polite"
    >
      {value}
    </span>
  );
};
