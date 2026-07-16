import { create } from "zustand";
import type { CartLine, Product } from "@/services/types";

interface CartState {
  lines: CartLine[];
  addProduct: (product: Product) => void;
  incrementLine: (productId: string) => void;
  decrementLine: (productId: string) => void;
  removeLine: (productId: string) => void;
  clear: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  lines: [],

  addProduct: (product) =>
    set((state) => {
      const existing = state.lines.find((l) => l.productId === product.id);
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.productId === product.id ? { ...l, quantity: l.quantity + 1 } : l
          ),
        };
      }
      return {
        lines: [
          ...state.lines,
          {
            productId: product.id,
            productName: product.name,
            unitPrice: product.price,
            quantity: 1,
          },
        ],
      };
    }),

  incrementLine: (productId) =>
    set((state) => ({
      lines: state.lines.map((l) =>
        l.productId === productId ? { ...l, quantity: l.quantity + 1 } : l
      ),
    })),

  decrementLine: (productId) =>
    set((state) => {
      const line = state.lines.find((l) => l.productId === productId);
      if (!line) return state;
      if (line.quantity <= 1) {
        return { lines: state.lines.filter((l) => l.productId !== productId) };
      }
      return {
        lines: state.lines.map((l) =>
          l.productId === productId ? { ...l, quantity: l.quantity - 1 } : l
        ),
      };
    }),

  removeLine: (productId) =>
    set((state) => ({ lines: state.lines.filter((l) => l.productId !== productId) })),

  clear: () => set({ lines: [] }),

  total: () => get().lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0),

  itemCount: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
}));
