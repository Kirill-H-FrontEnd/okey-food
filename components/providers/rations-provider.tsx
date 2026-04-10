"use client";
import { useEffect } from "react";
import { useAdminStore } from "@/store/useAdminStore";

export function RationsProvider({ children }: { children: React.ReactNode }) {
  const fetchRations = useAdminStore((s) => s.fetchRations);

  useEffect(() => {
    fetchRations();
  }, [fetchRations]);

  return <>{children}</>;
}
