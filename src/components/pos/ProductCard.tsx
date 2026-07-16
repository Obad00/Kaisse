import { UtensilsCrossed } from "lucide-react";
import type { Product } from "@/services/types";
import { formatCurrency } from "@/utils/currency";
import { cn } from "@/utils/cn";

interface ProductCardProps {
  product: Product;
  quantityInCart?: number;
  onTap: (product: Product) => void;
}

export function ProductCard({ product, quantityInCart = 0, onTap }: ProductCardProps) {
  return (
    <button
      onClick={() => onTap(product)}
      className={cn(
        "tap-feedback group relative flex flex-col overflow-hidden rounded-3xl bg-surface text-left shadow-soft",
        "hover:shadow-floating focus:outline-none focus-visible:ring-2 focus-visible:ring-electric-400"
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-canvas-soft">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-faint">
            <UtensilsCrossed size={32} strokeWidth={1.5} />
          </div>
        )}

        {quantityInCart > 0 && (
          <span className="absolute right-2.5 top-2.5 flex h-7 min-w-7 items-center justify-center rounded-full bg-electric-500 px-2 text-xs font-bold text-white shadow-soft">
            {quantityInCart}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 px-4 py-3.5">
        <span className="font-display text-[15px] font-semibold leading-tight text-ink line-clamp-2">
          {product.name}
        </span>
        <span className="font-mono text-sm font-semibold text-electric-500">
          {formatCurrency(product.price)}
        </span>
      </div>
    </button>
  );
}
