import { Pencil, Trash2 } from "lucide-react";
import type { Category, Product } from "@/services/types";
import { formatCurrency } from "@/utils/currency";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

interface ProductTableProps {
  products: Product[];
  categoriesById: Record<string, Category>;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({ products, categoriesById, onEdit, onDelete }: ProductTableProps) {
  return (
    <>
      {/* Mobile: card list (a 5-column table can't fit a phone width) */}
      <div className="flex flex-col gap-3 sm:hidden">
        {products.map((product) => (
          <Card key={product.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{product.name}</p>
                <p className="mt-0.5 truncate text-xs text-ink-soft">
                  {categoriesById[product.categoryId]?.name ?? "-"}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => onEdit(product)}
                  aria-label="Modifier"
                  className="tap-feedback flex h-9 w-9 items-center justify-center rounded-xl text-ink-soft hover:bg-canvas-soft hover:text-electric-500"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => onDelete(product)}
                  aria-label="Supprimer"
                  className="tap-feedback flex h-9 w-9 items-center justify-center rounded-xl text-ink-soft hover:bg-danger-100 hover:text-danger-600"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <Badge tone={product.isActive ? "success" : "neutral"}>
                {product.isActive ? "Actif" : "Inactif"}
              </Badge>
              <span className="font-mono text-sm font-semibold text-ink">
                {formatCurrency(product.price)}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Tablet/desktop: full table */}
      <div className="hidden overflow-x-auto rounded-3xl bg-surface shadow-soft sm:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-canvas-soft text-xs font-semibold uppercase tracking-wide text-ink-faint">
              <th className="px-5 py-3.5">Produit</th>
              <th className="px-5 py-3.5">Categorie</th>
              <th className="px-5 py-3.5">Prix</th>
              <th className="px-5 py-3.5">Statut</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-canvas-soft">
            {products.map((product) => (
              <tr key={product.id} className="transition hover:bg-surface-soft">
                <td className="px-5 py-3.5 font-medium text-ink">{product.name}</td>
                <td className="px-5 py-3.5 text-ink-soft">
                  {categoriesById[product.categoryId]?.name ?? "-"}
                </td>
                <td className="px-5 py-3.5 font-mono font-semibold text-ink">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-5 py-3.5">
                  <Badge tone={product.isActive ? "success" : "neutral"}>
                    {product.isActive ? "Actif" : "Inactif"}
                  </Badge>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => onEdit(product)}
                      aria-label="Modifier"
                      className="tap-feedback flex h-9 w-9 items-center justify-center rounded-xl text-ink-soft hover:bg-canvas-soft hover:text-electric-500"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(product)}
                      aria-label="Supprimer"
                      className="tap-feedback flex h-9 w-9 items-center justify-center rounded-xl text-ink-soft hover:bg-danger-100 hover:text-danger-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
