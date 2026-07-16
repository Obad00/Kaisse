import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useRestaurantAccess } from "@/hooks/useRestaurantAccess";

// Guards POS/history/admin routes: a fastfood must be selected AND unlocked
// (correct PIN entered) on this device/session before any of these render.
export function RequireRestaurant({ children }: { children: ReactNode }) {
  const { isUnlocked } = useRestaurantAccess();
  if (!isUnlocked) return <Navigate to="/select" replace />;
  return <>{children}</>;
}
