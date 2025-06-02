import { create } from "zustand";

interface BasketState {
  isBasketOpen: boolean;
  setIsBasketOpen: (open: boolean) => void;
}

export const useBasketStore = create<BasketState>((set) => ({
  isBasketOpen: false,
  setIsBasketOpen: (open) => set({ isBasketOpen: open }),
}));
