import { PackageSearch } from "lucide-react";
import type { Product } from "@/services/types";
import { ProductCard } from "./ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";

interface ProductGridProps {
  products: Product[];
  quantitiesByProductId: Record<string, number>;
  onSelect: (product: Product) => void;
}

export function ProductGrid({ products, quantitiesByProductId, onSelect }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={<PackageSearch size={24} strokeWidth={1.5} />}
        title="Aucun produit"
        description="Cette categorie ne contient pas encore de produit actif."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          quantityInCart={quantitiesByProductId[product.id] ?? 0}
          onTap={onSelect}
        />
      ))}
    </div>
  );
}
