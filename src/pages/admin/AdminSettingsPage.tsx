import { useEffect, useState } from "react";
import type { Restaurant } from "@/services/types";
import { restaurantService } from "@/services";
import { useTenantStore } from "@/store/tenantStore";
import { useBranding } from "@/hooks/useBranding";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { SettingsForm } from "@/components/admin/SettingsForm";

export function AdminSettingsPage() {
  const activeRestaurantId = useTenantStore((s) => s.activeRestaurantId);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    if (activeRestaurantId) restaurantService.get(activeRestaurantId).then(setRestaurant);
  }, [activeRestaurantId]);

  useBranding(restaurant);

  async function handleSave(patch: Partial<Restaurant>) {
    if (!activeRestaurantId) return;
    const updated = await restaurantService.update(activeRestaurantId, patch);
    setRestaurant(updated);
  }

  return (
    <AdminLayout title="Reglages" description="Nom du fastfood, branding et informations affichees sur le ticket.">
      {restaurant ? (
        <SettingsForm initial={restaurant} onSave={handleSave} />
      ) : (
        <div className="h-56 animate-pulse rounded-3xl bg-surface shadow-soft" />
      )}
    </AdminLayout>
  );
}
