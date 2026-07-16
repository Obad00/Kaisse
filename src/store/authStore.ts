import { create } from "zustand";

const RESTAURANT_SESSION_KEY = "kaisse:unlocked-restaurant";
const OWNER_SESSION_KEY = "kaisse:owner-session";

interface AuthState {
  unlockedRestaurantId: string | null;
  isOwnerAuthenticated: boolean;
  unlockRestaurant: (id: string) => void;
  lockRestaurant: () => void;
  loginOwner: () => void;
  logoutOwner: () => void;
}

function readUnlockedRestaurant(): string | null {
  try {
    return sessionStorage.getItem(RESTAURANT_SESSION_KEY);
  } catch {
    return null;
  }
}

function readOwnerSession(): boolean {
  try {
    return sessionStorage.getItem(OWNER_SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  unlockedRestaurantId: readUnlockedRestaurant(),
  isOwnerAuthenticated: readOwnerSession(),

  unlockRestaurant: (id) => {
    try {
      sessionStorage.setItem(RESTAURANT_SESSION_KEY, id);
    } catch {
      // ignore
    }
    set({ unlockedRestaurantId: id });
  },

  lockRestaurant: () => {
    try {
      sessionStorage.removeItem(RESTAURANT_SESSION_KEY);
    } catch {
      // ignore
    }
    set({ unlockedRestaurantId: null });
  },

  loginOwner: () => {
    try {
      sessionStorage.setItem(OWNER_SESSION_KEY, "true");
    } catch {
      // ignore
    }
    set({ isOwnerAuthenticated: true });
  },

  logoutOwner: () => {
    try {
      sessionStorage.removeItem(OWNER_SESSION_KEY);
    } catch {
      // ignore
    }
    set({ isOwnerAuthenticated: false });
  },
}));
