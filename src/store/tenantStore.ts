import { create } from "zustand";

const STORAGE_KEY = "kaisse:active-restaurant";

interface TenantState {
  activeRestaurantId: string | null;
  setActiveRestaurant: (id: string) => void;
  clearActiveRestaurant: () => void;
}

function readStored(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export const useTenantStore = create<TenantState>((set) => ({
  activeRestaurantId: readStored(),

  setActiveRestaurant: (id) => {
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore storage errors
    }
    set({ activeRestaurantId: id });
  },

  clearActiveRestaurant: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    set({ activeRestaurantId: null });
  },
}));
