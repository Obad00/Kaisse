import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import type { Category } from "@/services/types";
import { categoryService } from "@/services";
import { useTenantStore } from "@/store/tenantStore";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

export function AdminCategoriesPage() {
  const activeRestaurantId = useTenantStore((s) => s.activeRestaurantId)!;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    const cats = await categoryService.list(activeRestaurantId);
    setCategories(cats);
    setLoading(false);
  }

  useEffect(() => {
    reload();
  }, [activeRestaurantId]);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setFormOpen(true);
  }

  async function handleSubmit(values: Omit<Category, "id" | "restaurantId">) {
    if (editing) {
      await categoryService.update(editing.id, values);
    } else {
      await categoryService.create({ ...values, restaurantId: activeRestaurantId });
    }
    setFormOpen(false);
    await reload();
  }

  async function handleDelete(category: Category) {
    if (!confirm(`Supprimer la categorie "${category.name}" ?`)) return;
    setError(null);
    try {
      await categoryService.remove(category.id);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  }

  return (
    <AdminLayout
      title="Categories"
      description="Organisez vos produits par categorie."
      action={
        <Button onClick={openCreate}>
          <Plus size={16} />
          <span className="hidden sm:inline">Ajouter</span>
        </Button>
      }
    >
      {error && (
        <p className="mb-4 rounded-2xl bg-danger-100 px-4 py-3 text-sm font-medium text-danger-600">
          {error}
        </p>
      )}

      {loading ? (
        <div className="h-40 animate-pulse rounded-3xl bg-surface shadow-soft" />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={<Tag size={24} strokeWidth={1.5} />}
          title="Aucune categorie"
          description="Creez votre premiere categorie (ex: Burgers, Boissons)."
          action={
            <Button onClick={openCreate}>
              <Plus size={16} />
              Ajouter une categorie
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {categories.map((cat) => (
            <Card key={cat.id} className="flex items-center justify-between gap-3 px-5 py-4">
              <span className="font-medium text-ink">{cat.name}</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => openEdit(cat)}
                  aria-label="Modifier"
                  className="tap-feedback flex h-9 w-9 items-center justify-center rounded-xl text-ink-soft hover:bg-canvas-soft hover:text-electric-500"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(cat)}
                  aria-label="Supprimer"
                  className="tap-feedback flex h-9 w-9 items-center justify-center rounded-xl text-ink-soft hover:bg-danger-100 hover:text-danger-600"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Modifier la categorie" : "Nouvelle categorie"}
      >
        <CategoryForm
          initial={editing ?? undefined}
          nextSortOrder={categories.length}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>
    </AdminLayout>
  );
}
