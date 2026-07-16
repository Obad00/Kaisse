import { useCallback, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { restaurantService } from "@/services";

export function useOwnerAuth() {
  const isOwnerAuthenticated = useAuthStore((s) => s.isOwnerAuthenticated);
  const loginOwner = useAuthStore((s) => s.loginOwner);
  const logoutOwner = useAuthStore((s) => s.logoutOwner);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const attemptLogin = useCallback(
    async (password: string) => {
      setChecking(true);
      setError(null);
      try {
        const ok = await restaurantService.verifyOwnerPassword(password);
        if (ok) {
          loginOwner();
          return true;
        }
        setError("Mot de passe incorrect");
        return false;
      } finally {
        setChecking(false);
      }
    },
    [loginOwner]
  );

  return { isOwnerAuthenticated, attemptLogin, logout: logoutOwner, error, checking };
}
