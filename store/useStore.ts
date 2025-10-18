import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; // ADDED

// ADDED
export type CartItem = {
  id: string;
  calories: string;
  selectedDays: string[]; // CHANGED: вместо day
  range: string | null; // ADDED: выбранный диапазон дат
  pricePerDay: number;
  dishesCount: number;
};

interface BasketState {
  isBasketOpen: boolean;
  items: CartItem[]; // ADDED
  setIsBasketOpen: (open: boolean) => void;
  addItem: (item: CartItem) => void; // ADDED
  updateItem: (
    // ADDED
    id: string,
    updater: (item: CartItem) => CartItem | null
  ) => void;
  removeItem: (id: string) => void; // ADDED
  clear: () => void; // ADDED
}

// CHANGED: persist + расширенные методы
export const useBasketStore = create<BasketState>()(
  persist(
    (set) => ({
      isBasketOpen: false,
      items: [],
      setIsBasketOpen: (open) => set({ isBasketOpen: open }),

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (cartItem) => cartItem.id === item.id
          );

          if (existing) {
            const mergedDays = Array.from(
              new Set([...existing.selectedDays, ...item.selectedDays])
            ).sort();

            return {
              items: state.items.map((cartItem) =>
                cartItem.id === item.id
                  ? {
                      ...cartItem,
                      ...item,
                      selectedDays: mergedDays,
                      range: item.range ?? cartItem.range,
                    }
                  : cartItem
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                ...item,
                selectedDays: [...item.selectedDays].sort(),
              },
            ],
          };
        }),

      updateItem: (id, updater) =>
        set((state) => ({
          items: state.items
            .map((it) => {
              if (it.id !== id) return it;
              const next = updater(it);
              if (!next) return null; // удалить элемент
              return {
                ...next,
                selectedDays: [...next.selectedDays].sort(),
              };
            })
            .filter((x): x is CartItem => x !== null),
        })),

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
