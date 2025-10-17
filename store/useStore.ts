import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; // ADDED

// ADDED
export type CartItem = {
  id: string;
  calories: string;
  day: string;
  pricePerDay: number;
  dishesCount: number;
};

interface BasketState {
  isBasketOpen: boolean;
  items: CartItem[]; // ADDED
  setIsBasketOpen: (open: boolean) => void;
  addItem: (item: CartItem) => void; // ADDED
  removeItem: (id: string) => void; // ADDED
  clear: () => void; // ADDED
}

// CHANGED: обернули в persist + добавили хранилище и методы
export const useBasketStore = create<BasketState>()(
  persist(
    (set) => ({
      isBasketOpen: false,
      items: [],
      setIsBasketOpen: (open) => set({ isBasketOpen: open }),
      addItem: (item) =>
        set((state) => {
          const exists = state.items.some(
            (cartItem) => cartItem.id === item.id
          );

          if (exists) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.id === item.id ? { ...cartItem, ...item } : cartItem
              ),
            };
          }

          return { items: [...state.items, item] };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "basket-storage",
      ...(typeof window !== "undefined"
        ? { storage: createJSONStorage(() => window.localStorage) }
        : {}),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
