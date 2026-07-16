import { create } from "zustand";
import type { Order } from "@/services/types";

interface UiState {
  activeReceiptOrder: Order | null;
  showReceipt: (order: Order) => void;
  closeReceipt: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  activeReceiptOrder: null,
  showReceipt: (order) => set({ activeReceiptOrder: order }),
  closeReceipt: () => set({ activeReceiptOrder: null }),
}));
