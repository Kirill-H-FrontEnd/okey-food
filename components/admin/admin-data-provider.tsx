"use client";
import { useEffect } from "react";
import { useAdminStore } from "@/store/useAdminStore";

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const fetchRations = useAdminStore((s) => s.fetchRations);
  const fetchOrders = useAdminStore((s) => s.fetchOrders);
  const addUnseenOrder = useAdminStore((s) => s.addUnseenOrder);

  useEffect(() => {
    fetchRations();
    fetchOrders();

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;

    import("@/lib/supabase-client").then(({ supabaseClient }) => {
      const rationChannel = supabaseClient
        .channel("admin-rations-realtime")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "rations" },
          () => {
            fetchRations();
          },
        )
        .subscribe();

      const orderChannel = supabaseClient
        .channel("admin-orders-realtime")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "orders" },
          (payload) => {
            const newId = (payload.new as { id?: string })?.id;
            if (newId) addUnseenOrder(newId);
            fetchOrders();
          },
        )
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "orders" },
          () => {
            fetchOrders();
          },
        )
        .on(
          "postgres_changes",
          { event: "DELETE", schema: "public", table: "orders" },
          () => {
            fetchOrders();
          },
        )
        .subscribe();

      return () => {
        supabaseClient.removeChannel(rationChannel);
        supabaseClient.removeChannel(orderChannel);
      };
    });
  }, [fetchRations, fetchOrders, addUnseenOrder]);

  return <>{children}</>;
}
