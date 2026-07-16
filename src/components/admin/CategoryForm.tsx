import { useState, type FormEvent } from "react";
import type { Category } from "@/services/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface CategoryFormProps {
  initial?: Category;
  nextSortOrder: number;
  onSubmit: (values: Omit<Category, "id" | "restaurantId">) => Promise<void>;
  onCancel: () => void;
}

export function CategoryForm({ initial, nextSortOrder, onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Le nom de la categorie est requis.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), sortOrder: initial?.sortOrder ?? nextSortOrder });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Nom de la categorie" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Boissons" />

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
