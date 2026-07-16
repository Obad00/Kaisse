import { ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { CartItem } from "./CartItem";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/utils/currency";

interface CartProps {
  onValidate: () => void;
  isSubmitting?: boolean;
}

export function Cart({ onValidate, isSubmitting = false }: CartProps) {
  const lines = useCartStore((s) => s.lines);
  const incrementLine = useCartStore((s) => s.incrementLine);
  const decrementLine = useCartStore((s) => s.decrementLine);
  const removeLine = useCartStore((s) => s.removeLine);
  const clear = useCartStore((s) => s.clear);
  const total = useCartStore((s) => s.total());

  return (
    <Card floating className="flex h-full flex-col p-5">
      <div className="flex items-center justify-between pb-2">
        <h2 className="font-display text-lg font-semibold text-ink">Panier</h2>
        {lines.length > 0 && (
          <button
            onClick={clear}
            className="tap-feedback flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-ink-soft hover:bg-canvas-soft hover:text-danger-600"
          >
            <Trash2 size={14} />
            Vider
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-canvas-soft">
        {lines.length === 0 ? (
          <div className="py-6">
            <EmptyState
              icon={<ShoppingBag size={22} strokeWidth={1.5} />}
              title="Panier vide"
              description="Touchez un produit pour l'ajouter."
            />
          </div>
        ) : (
          lines.map((line) => (
            <CartItem
              key={line.productId}
              line={line}
              onIncrement={incrementLine}
              onDecrement={decrementLine}
              onRemove={removeLine}
            />
          ))
        )}
      </div>

      <div className="mt-2 rounded-3xl navy-gradient p-5 text-white">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-medium text-white/70">Total</span>
          <span className="font-mono text-3xl font-bold tracking-tight">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      <Button
        size="lg"
        className="mt-4 w-full"
        disabled={lines.length === 0 || isSubmitting}
        onClick={onValidate}
      >
        {isSubmitting ? "Validation..." : "Valider la commande"}
      </Button>
    </Card>
  );
}
