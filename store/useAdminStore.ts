"use client";

import { create } from "zustand";
import { TRation, TRationDish, TOrder } from "@/types/admin";

const SEEN_KEY = "okey-food:seen-order-ids";

function loadSeenIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(SEEN_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function saveSeenIds(ids: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SEEN_KEY, JSON.stringify([...ids]));
  } catch {}
}

interface AdminState {
  rations: TRation[];
  orders: TOrder[];

  rationsLoading: boolean;
  ordersLoading: boolean;

  unseenOrderIds: string[];
  addUnseenOrder: (id: string) => void;
  markOrderSeen: (id: string) => void;
  markAllOrdersSeen: () => void;

  fetchRations: () => Promise<void>;
  fetchOrders: () => Promise<void>;

  addRation: (ration: Omit<TRation, "id" | "createdAt">) => Promise<void>;
  updateRation: (id: string, updates: Partial<TRation>) => Promise<void>;
  deleteRation: (id: string) => Promise<void>;
  toggleRationActive: (id: string) => Promise<void>;

  addDish: (rationId: string, dish: Omit<TRationDish, "id">) => Promise<void>;
  updateDish: (
    rationId: string,
    dishId: string,
    updates: Partial<TRationDish>,
  ) => Promise<void>;
  deleteDish: (rationId: string, dishId: string) => Promise<void>;

  addOrder: (order: Omit<TOrder, "id" | "createdAt">) => Promise<void>;
  updateOrderStatus: (id: string, status: TOrder["status"]) => Promise<void>;
  updateOrderNotes: (id: string, notes: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>()((set, get) => ({
  rations: [],
  orders: [],

  rationsLoading: true,
  ordersLoading: true,

  unseenOrderIds: [],

  addUnseenOrder: (id) => {
    const seen = loadSeenIds();
    if (seen.has(id)) return;
    set((s) => ({
      unseenOrderIds: s.unseenOrderIds.includes(id)
        ? s.unseenOrderIds
        : [...s.unseenOrderIds, id],
    }));
  },

  markOrderSeen: (id) => {
    const seen = loadSeenIds();
    seen.add(id);
    saveSeenIds(seen);
    set((s) => ({ unseenOrderIds: s.unseenOrderIds.filter((x) => x !== id) }));
  },

  markAllOrdersSeen: () => {
    const seen = loadSeenIds();
    get().orders.forEach((o) => seen.add(o.id));
    get().unseenOrderIds.forEach((id) => seen.add(id));
    saveSeenIds(seen);
    set({ unseenOrderIds: [] });
  },

  fetchRations: async () => {
    set({ rationsLoading: true });

    try {
      const res = await fetch("/api/rations");

      if (!res.ok) {
        throw new Error("Failed to fetch rations");
      }

      const data: TRation[] = await res.json();
      set({ rations: data });
    } catch (error) {
      console.error("fetchRations error:", error);
      set({ rations: [] });
    } finally {
      set({ rationsLoading: false });
    }
  },

  fetchOrders: async () => {
    set({ ordersLoading: true });

    try {
      const res = await fetch("/api/orders");

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data: TOrder[] = await res.json();

      // При первой загрузке помечаем все существующие заказы просмотренными
      const seen = loadSeenIds();
      const isFirstLoad = seen.size === 0 && get().orders.length === 0;
      if (isFirstLoad) {
        data.forEach((o) => seen.add(o.id));
        saveSeenIds(seen);
      }

      // Восстанавливаем непрочитанные из localStorage
      const unseen = data.filter((o) => !seen.has(o.id)).map((o) => o.id);

      set({ orders: data, unseenOrderIds: unseen });
    } catch (error) {
      console.error("fetchOrders error:", error);
      set({ orders: [] });
    } finally {
      set({ ordersLoading: false });
    }
  },

  addRation: async (rationData) => {
    const res = await fetch("/api/rations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rationData),
    });

    if (!res.ok) {
      throw new Error("Failed to add ration");
    }

    const created: TRation = await res.json();

    set((state) => ({
      rations: [created, ...state.rations],
    }));
  },

  updateRation: async (id, updates) => {
    const res = await fetch(`/api/rations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      throw new Error("Failed to update ration");
    }

    set((state) => ({
      rations: state.rations.map((ration) =>
        ration.id === id ? { ...ration, ...updates } : ration,
      ),
    }));
  },

  deleteRation: async (id) => {
    const res = await fetch(`/api/rations/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete ration");
    }

    set((state) => ({
      rations: state.rations.filter((ration) => ration.id !== id),
    }));
  },

  toggleRationActive: async (id) => {
    const ration = get().rations.find((item) => item.id === id);

    if (!ration) {
      return;
    }

    await get().updateRation(id, { isActive: !ration.isActive });
  },

  addDish: async (rationId, dishData) => {
    const ration = get().rations.find((item) => item.id === rationId);

    if (!ration) {
      return;
    }

    const newDish: TRationDish = {
      ...dishData,
      id: `dish-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };

    const updatedDishes = [...ration.dishes, newDish];

    await get().updateRation(rationId, { dishes: updatedDishes });
  },

  updateDish: async (rationId, dishId, updates) => {
    const ration = get().rations.find((item) => item.id === rationId);

    if (!ration) {
      return;
    }

    const updatedDishes = ration.dishes.map((dish) =>
      dish.id === dishId ? { ...dish, ...updates } : dish,
    );

    await get().updateRation(rationId, { dishes: updatedDishes });
  },

  deleteDish: async (rationId, dishId) => {
    const ration = get().rations.find((item) => item.id === rationId);

    if (!ration) {
      return;
    }

    const updatedDishes = ration.dishes.filter((dish) => dish.id !== dishId);

    await get().updateRation(rationId, { dishes: updatedDishes });
  },

  addOrder: async (orderData) => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (!res.ok) {
      throw new Error("Failed to add order");
    }

    const created: TOrder = await res.json();

    set((state) => ({
      orders: [created, ...state.orders],
    }));
  },

  updateOrderStatus: async (id, status) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      throw new Error("Failed to update order status");
    }

    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id ? { ...order, status } : order,
      ),
    }));
  },

  updateOrderNotes: async (id, notes) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });

    if (!res.ok) {
      throw new Error("Failed to update order notes");
    }

    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id ? { ...order, notes } : order,
      ),
    }));
  },
}));
