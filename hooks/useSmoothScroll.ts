"use client";

import { useCallback } from "react";

type ScrollOpts = {
  behavior?: ScrollBehavior;
  offset?: number;
};

export function useSmoothScroll() {
  const scrollToId = useCallback((id: string, opts?: ScrollOpts) => {
    const target = document.getElementById(id);
    if (!target) return;

    const offset = opts?.offset ?? 0;
    const behavior = opts?.behavior ?? "smooth";

    const rect = target.getBoundingClientRect();
    const top = rect.top + window.pageYOffset + offset;

    window.scrollTo({ top, behavior });

    try {
      target.setAttribute("tabindex", "-1");
      (target as HTMLElement).focus({ preventScroll: true });
    } catch {}
  }, []);

  const makeAnchorHandler = useCallback(
    (id: string, opts?: ScrollOpts, after?: () => void) =>
      (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        scrollToId(id, opts);
        if (after) after();
      },
    [scrollToId]
  );

  return { scrollToId, makeAnchorHandler };
}
