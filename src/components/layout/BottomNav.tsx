import { NavLink } from "react-router-dom";
import { ShoppingCart, History, Settings, Package, Tag } from "lucide-react";
import { cn } from "@/utils/cn";

const tabs = [
  { to: "/", label: "Caisse", icon: ShoppingCart },
  { to: "/admin/products", label: "Produits", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/history", label: "Historique", icon: History },
  { to: "/admin/settings", label: "Reglages", icon: Settings },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-canvas-soft bg-surface/95 backdrop-blur-lg lg:hidden">
      <div className="flex h-16 items-stretch justify-between px-2">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "tap-feedback flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium",
                isActive ? "text-electric-500" : "text-ink-faint"
              )
            }
          >
            <Icon size={20} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
