import { Minus, Plus, X } from "lucide-react";
import type { CartLine } from "@/services/types";
import { formatCurrency } from "@/utils/currency";

interface CartItemProps {
  line: CartLine;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
  onRemove: (productId: string) => void;
}

export function CartItem({ line, onIncrement, onDecrement, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[15px] font-medium text-ink">{line.productName}</span>
        <span className="font-mono text-xs text-ink-soft">
          {formatCurrency(line.unitPrice)} / unite
        </span>
      </div>

      <div className="flex items-center gap-1.5 rounded-2xl bg-canvas-soft p-1">
        <button
          onClick={() => onDecrement(line.productId)}
          aria-label="Retirer un"
          className="tap-feedback flex h-7 w-7 items-center justify-center rounded-xl bg-surface text-ink shadow-soft"
        >
          <Minus size={14} />
        </button>
        <span className="w-5 text-center font-mono text-sm font-semibold text-ink">
          {line.quantity}
        </span>
        <button
          onClick={() => onIncrement(line.productId)}
          aria-label="Ajouter un"
          className="tap-feedback flex h-7 w-7 items-center justify-center rounded-xl bg-surface text-ink shadow-soft"
        >
          <Plus size={14} />
        </button>
      </div>

      <span className="w-20 shrink-0 text-right font-mono text-sm font-semibold text-ink">
        {formatCurrency(line.unitPrice * line.quantity)}
      </span>

      <button
        onClick={() => onRemove(line.productId)}
        aria-label="Supprimer l'article"
        className="tap-feedback flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-faint hover:bg-danger-100 hover:text-danger-600"
      >
        <X size={16} />
      </button>
    </div>
  );
}
