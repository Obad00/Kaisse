import { ReceiptText } from "lucide-react";
import type { Order } from "@/services/types";
import { OrderListItem } from "./OrderListItem";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/utils/currency";

export function OrderList({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<ReceiptText size={24} strokeWidth={1.5} />}
        title="Aucune commande"
        description="Aucune vente n'a ete enregistree pour ce jour."
      />
    );
  }

  const dayTotal = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between rounded-2xl bg-canvas-soft px-4 py-3 text-sm">
        <span className="font-medium text-ink-soft">
          {orders.length} commande{orders.length > 1 ? "s" : ""}
        </span>
        <span className="font-mono font-semibold text-ink">{formatCurrency(dayTotal)}</span>
      </div>
      {orders.map((order) => (
        <OrderListItem key={order.id} order={order} />
      ))}
    </div>
  );
}
