import { useCallback, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useTenantStore } from "@/store/tenantStore";
import { restaurantService } from "@/services";

// Entering the correct PIN both selects the restaurant on this device and
// unlocks its caisse + admin pages for the session — a single fastfood-level
// credential, not a per-cashier login.
export function useRestaurantAccess() {
  const activeRestaurantId = useTenantStore((s) => s.activeRestaurantId);
  const setActiveRestaurant = useTenantStore((s) => s.setActiveRestaurant);
  const clearActiveRestaurant = useTenantStore((s) => s.clearActiveRestaurant);
  const unlockedRestaurantId = useAuthStore((s) => s.unlockedRestaurantId);
  const unlockRestaurant = useAuthStore((s) => s.unlockRestaurant);
  const lockRestaurant = useAuthStore((s) => s.lockRestaurant);

  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const isUnlocked = !!activeRestaurantId && activeRestaurantId === unlockedRestaurantId;

  const attemptUnlock = useCallback(
    async (restaurantId: string, pin: string) => {
      setChecking(true);
      setError(null);
      try {
        const ok = await restaurantService.verifyPin(restaurantId, pin);
        if (ok) {
          setActiveRestaurant(restaurantId);
          unlockRestaurant(restaurantId);
          return true;
        }
        setError("Code PIN incorrect");
        return false;
      } finally {
        setChecking(false);
      }
    },
    [setActiveRestaurant, unlockRestaurant]
  );

  const switchRestaurant = useCallback(() => {
    lockRestaurant();
    clearActiveRestaurant();
  }, [lockRestaurant, clearActiveRestaurant]);

  return {
    activeRestaurantId,
    isUnlocked,
    attemptUnlock,
    switchRestaurant,
    error,
    checking,
  };
}
