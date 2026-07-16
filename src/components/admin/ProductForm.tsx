import { useState, type FormEvent } from "react";
import type { Category, Product } from "@/services/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface ProductFormProps {
  categories: Category[];
  initial?: Product;
  onSubmit: (values: Omit<Product, "id" | "restaurantId">) => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({ categories, initial, onSubmit, onCancel }: ProductFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const priceValue = Number(price);
    if (!name.trim()) {
      setError("Le nom du produit est requis.");
      return;
    }
    if (!categoryId) {
      setError("Choisissez une categorie.");
      return;
    }
    if (!Number.isFinite(priceValue) || priceValue <= 0) {
      setError("Le prix doit etre un nombre positif.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        price: priceValue,
        categoryId,
        imageUrl: imageUrl.trim() || null,
        isActive,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Nom du produit" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Cheese Burger" />

      <Input
        label="Prix (FCFA)"
        type="number"
        inputMode="numeric"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="2500"
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink-soft">Categorie</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="h-12 rounded-2xl border border-canvas-soft bg-surface-soft px-4 text-[15px] text-ink outline-none focus:border-electric-400 focus:ring-2 focus:ring-electric-300/50"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Image (URL, optionnel)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="https://..."
      />

      <label className="flex items-center gap-2.5 text-sm font-medium text-ink">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 rounded accent-electric-500"
        />
        Produit actif (visible en caisse)
      </label>

      {error && <p className="text-sm font-medium text-danger-600">{error}</p>}

      <div className="mt-2 flex gap-3">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" className="flex-1" disabled={submitting}>
          {submitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
