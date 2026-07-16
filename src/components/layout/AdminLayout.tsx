import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useRestaurantAccess } from "@/hooks/useRestaurantAccess";

interface AdminLayoutProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function AdminLayout({ title, description, action, children }: AdminLayoutProps) {
  const { switchRestaurant } = useRestaurantAccess();
  const navigate = useNavigate();

  function handleSwitch() {
    switchRestaurant();
    navigate("/select");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-8 sm:py-10">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
          {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {action}
          <button
            onClick={handleSwitch}
            className="tap-feedback flex h-11 items-center gap-2 rounded-2xl bg-surface px-4 text-sm font-semibold text-ink-soft shadow-soft hover:text-danger-600"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Changer de fastfood</span>
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
