import { create } from "zustand";

interface UIState {
  isBasketOpen: boolean;
  setIsBasketOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isBasketOpen: false,
  setIsBasketOpen: (open) => set({ isBasketOpen: open }),
}));
