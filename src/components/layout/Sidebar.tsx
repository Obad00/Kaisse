import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ShoppingCart, History, Settings, Package, Tag, Store } from "lucide-react";
import type { Restaurant } from "@/services/types";
import { restaurantService } from "@/services";
import { useTenantStore } from "@/store/tenantStore";
import { cn } from "@/utils/cn";

const items = [
  { to: "/", label: "Caisse", icon: ShoppingCart, end: true },
  { to: "/admin/products", label: "Produits", icon: Package, end: false },
  { to: "/admin/categories", label: "Categories", icon: Tag, end: false },
  { to: "/history", label: "Historique", icon: History, end: false },
  { to: "/admin/settings", label: "Reglages", icon: Settings, end: false },
];

export function Sidebar() {
  const activeRestaurantId = useTenantStore((s) => s.activeRestaurantId);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    if (activeRestaurantId) restaurantService.get(activeRestaurantId).then(setRestaurant);
  }, [activeRestaurantId]);

  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-1 border-r border-canvas-soft bg-surface/60 p-4 lg:flex">
      <div className="mb-6 flex items-center gap-2 px-2">
        <div
          className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-2xl text-sm font-bold text-white"
          style={{ backgroundColor: restaurant?.branding.accentColor ?? "#17225C" }}
        >
          {restaurant?.branding.logoUrl ? (
            <img src={restaurant.branding.logoUrl} alt={restaurant.name} className="h-full w-full object-cover" />
          ) : restaurant ? (
            <Store size={16} />
          ) : (
            <span className="font-display">K</span>
          )}
        </div>
        <span className="truncate font-display text-lg font-bold text-ink">
          {restaurant?.name ?? "Kaisse"}
        </span>
      </div>

      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              "tap-feedback flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium",
              isActive
                ? "bg-navy-900 text-white shadow-soft navy-gradient"
                : "text-ink-soft hover:bg-canvas-soft hover:text-ink"
            )
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </aside>
  );
}
