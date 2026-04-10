"use client";
import { useEffect } from "react";
import { useAdminStore } from "@/store/useAdminStore";

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const fetchRations = useAdminStore((s) => s.fetchRations);
  const fetchOrders = useAdminStore((s) => s.fetchOrders);

  useEffect(() => {
    fetchRations();
    fetchOrders();
  }, [fetchRations, fetchOrders]);

  return <>{children}</>;
}
