"use client";
import { useEffect } from "react";
import { useAdminStore } from "@/store/useAdminStore";

export function RationsProvider({ children }: { children: React.ReactNode }) {
  const fetchRations = useAdminStore((s) => s.fetchRations);

  useEffect(() => {
    fetchRations();

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;

    import("@/lib/supabase-client").then(({ supabaseClient }) => {
      const channel = supabaseClient
        .channel("rations-realtime")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "rations" },
          () => {
            fetchRations();
          },
        )
        .subscribe();

      return () => {
        supabaseClient.removeChannel(channel);
      };
    });
  }, [fetchRations]);

  return <>{children}</>;
}
