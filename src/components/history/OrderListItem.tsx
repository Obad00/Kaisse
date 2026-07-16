import { useState } from "react";
import { ChevronDown, Receipt } from "lucide-react";
import type { Order } from "@/services/types";
import { formatCurrency } from "@/utils/currency";
import { formatTime } from "@/utils/date";
import { cn } from "@/utils/cn";
import { Card } from "@/components/ui/Card";

export function OrderListItem({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="tap-feedback flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-electric-300/20 text-electric-500">
          <Receipt size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-ink">
            Commande #{order.id.slice(-6).toUpperCase()}
          </p>
          <p className="text-xs text-ink-soft">
            {formatTime(order.createdAt)} • {order.items.length} article
            {order.items.length > 1 ? "s" : ""}
          </p>
        </div>
        <span className="font-mono text-base font-semibold text-ink">
          {formatCurrency(order.total)}
        </span>
        <ChevronDown
          size={18}
          className={cn("shrink-0 text-ink-faint transition-transform", expanded && "rotate-180")}
        />
      </button>

      {expanded && (
        <div className="border-t border-canvas-soft px-5 py-4">
          <ul className="flex flex-col gap-2">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-ink-soft">
                  {item.quantity}x {item.productName}
                </span>
                <span className="font-mono font-medium text-ink">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
