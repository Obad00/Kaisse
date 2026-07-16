import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Store, LogOut, ArrowRight } from "lucide-react";
import type { Restaurant } from "@/services/types";
import { restaurantService } from "@/services";
import { useOwnerAuth } from "@/hooks/useOwnerAuth";
import { useAuthStore } from "@/store/authStore";
import { useTenantStore } from "@/store/tenantStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { RestaurantForm } from "@/components/owner/RestaurantForm";

export function OwnerDashboardPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Restaurant | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const { logout } = useOwnerAuth();
  const unlockRestaurant = useAuthStore((s) => s.unlockRestaurant);
  const setActiveRestaurant = useTenantStore((s) => s.setActiveRestaurant);
  const navigate = useNavigate();

  async function reload() {
    const list = await restaurantService.list();
    setRestaurants(list);
    setLoading(false);
  }

  useEffect(() => {
    reload();
  }, []);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(restaurant: Restaurant) {
    setEditing(restaurant);
    setFormOpen(true);
  }

  async function handleSubmit(values: Omit<Restaurant, "id" | "createdAt">) {
    if (editing) {
      await restaurantService.update(editing.id, values);
    } else {
      await restaurantService.create(values);
    }
    setFormOpen(false);
    await reload();
  }

  async function handleDelete(restaurant: Restaurant) {
    if (!confirm(`Supprimer "${restaurant.name}" et toutes ses donnees ?`)) return;
    await restaurantService.remove(restaurant.id);
    await reload();
  }

  // Owner already authenticated at the account level, so opening a fastfood's
  // caisse from here skips re-entering that restaurant's PIN.
  function openCaisse(restaurant: Restaurant) {
    setActiveRestaurant(restaurant.id);
    unlockRestaurant(restaurant.id);
    navigate("/");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8 sm:py-10">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Mes fastfoods</h1>
          <p className="mt-1 text-sm text-ink-soft">Gerez vos enseignes Kaisse.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={openCreate}>
            <Plus size={16} />
            <span className="hidden sm:inline">Nouveau fastfood</span>
          </Button>
          <button
            onClick={logout}
            className="tap-feedback flex h-11 items-center gap-2 rounded-2xl bg-surface px-4 text-sm font-semibold text-ink-soft shadow-soft hover:text-danger-600"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-40 animate-pulse rounded-3xl bg-surface shadow-soft" />
      ) : restaurants.length === 0 ? (
        <EmptyState
          icon={<Store size={24} strokeWidth={1.5} />}
          title="Aucun fastfood"
          description="Creez votre premier fastfood pour commencer."
          action={
            <Button onClick={openCreate}>
              <Plus size={16} />
              Nouveau fastfood
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {restaurants.map((r) => (
            <Card key={r.id} className="flex flex-col gap-4 p-5">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-soft"
                  style={{ backgroundColor: r.branding.accentColor }}
                >
                  {r.branding.logoUrl ? (
                    <img src={r.branding.logoUrl} alt={r.name} className="h-full w-full rounded-2xl object-cover" />
                  ) : (
                    <Store size={20} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display font-semibold text-ink">{r.name}</p>
                  <p className="truncate text-xs text-ink-soft">{r.address || "Adresse non renseignee"}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-1.5">
                  <button
                    onClick={() => openEdit(r)}
                    aria-label="Modifier"
                    className="tap-feedback flex h-9 w-9 items-center justify-center rounded-xl text-ink-soft hover:bg-canvas-soft hover:text-electric-500"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(r)}
                    aria-label="Supprimer"
                    className="tap-feedback flex h-9 w-9 items-center justify-center rounded-xl text-ink-soft hover:bg-danger-100 hover:text-danger-600"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <Button size="md" onClick={() => openCaisse(r)}>
                  Ouvrir la caisse
                  <ArrowRight size={15} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Modifier le fastfood" : "Nouveau fastfood"}
      >
        <RestaurantForm initial={editing ?? undefined} onSubmit={handleSubmit} onCancel={() => setFormOpen(false)} />
      </Modal>
    </div>
  );
}
