"use client";

import { create } from "zustand";
import { TRation, TRationDish, TOrder } from "@/types/admin";

interface AdminState {
  rations: TRation[];
  orders: TOrder[];

  rationsLoading: boolean;
  ordersLoading: boolean;

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
      set({ orders: data });
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
