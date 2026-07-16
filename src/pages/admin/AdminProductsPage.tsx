import { useEffect, useMemo, useState } from "react";
import { Plus, Package } from "lucide-react";
import type { Category, Product } from "@/services/types";
import { categoryService, productService } from "@/services";
import { useTenantStore } from "@/store/tenantStore";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProductTable } from "@/components/admin/ProductTable";
import { ProductForm } from "@/components/admin/ProductForm";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export function AdminProductsPage() {
  const activeRestaurantId = useTenantStore((s) => s.activeRestaurantId)!;
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  async function reload() {
    const [prods, cats] = await Promise.all([
      productService.list(activeRestaurantId),
      categoryService.list(activeRestaurantId),
    ]);
    setProducts(prods);
    setCategories(cats);
    setLoading(false);
  }

  useEffect(() => {
    reload();
  }, [activeRestaurantId]);

  const categoriesById = useMemo(() => {
    const map: Record<string, Category> = {};
    for (const c of categories) map[c.id] = c;
    return map;
  }, [categories]);

  function openCreate() {
    setEditingProduct(null);
    setFormOpen(true);
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setFormOpen(true);
  }

  async function handleSubmit(values: Omit<Product, "id" | "restaurantId">) {
    if (editingProduct) {
      await productService.update(editingProduct.id, values);
    } else {
      await productService.create({ ...values, restaurantId: activeRestaurantId });
    }
    setFormOpen(false);
    await reload();
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Supprimer "${product.name}" ?`)) return;
    await productService.remove(product.id);
    await reload();
  }

  return (
    <AdminLayout
      title="Produits"
      description="Gerez les produits disponibles en caisse."
      action={
        categories.length > 0 && (
          <Button onClick={openCreate}>
            <Plus size={16} />
            <span className="hidden sm:inline">Ajouter</span>
          </Button>
        )
      }
    >
      {loading ? (
        <div className="h-40 animate-pulse rounded-3xl bg-surface shadow-soft" />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={<Package size={24} strokeWidth={1.5} />}
          title="Creez d'abord une categorie"
          description="Vous devez ajouter au moins une categorie avant de creer un produit."
        />
      ) : products.length === 0 ? (
        <EmptyState
          icon={<Package size={24} strokeWidth={1.5} />}
          title="Aucun produit"
          description="Ajoutez votre premier produit pour commencer a vendre."
          action={
            <Button onClick={openCreate}>
              <Plus size={16} />
              Ajouter un produit
            </Button>
          }
        />
      ) : (
        <ProductTable
          products={products}
          categoriesById={categoriesById}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingProduct ? "Modifier le produit" : "Nouveau produit"}
      >
        <ProductForm
          categories={categories}
          initial={editingProduct ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>
    </AdminLayout>
  );
}
