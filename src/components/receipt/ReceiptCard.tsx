import type { Order, Restaurant } from "@/services/types";
import { formatCurrency } from "@/utils/currency";
import { formatDateTime } from "@/utils/date";
import { Card } from "@/components/ui/Card";

interface ReceiptCardProps {
  order: Order;
  restaurant: Restaurant;
}

export function ReceiptCard({ order, restaurant }: ReceiptCardProps) {
  return (
    <Card floating className="mx-auto w-full max-w-sm overflow-hidden">
      <div className="navy-gradient px-6 py-5 text-center text-white">
        {restaurant.branding.logoUrl && (
          <img
            src={restaurant.branding.logoUrl}
            alt={restaurant.name}
            className="mx-auto mb-2 h-10 w-10 rounded-xl object-cover"
          />
        )}
        <h3 className="font-display text-lg font-bold">{restaurant.name}</h3>
        {restaurant.address && <p className="mt-0.5 text-xs text-white/70">{restaurant.address}</p>}
        {restaurant.phone && <p className="text-xs text-white/70">Tel: {restaurant.phone}</p>}
      </div>

      <div className="px-6 py-5 font-mono text-[13px] text-ink">
        <div className="flex items-center justify-between text-ink-soft">
          <span>{formatDateTime(order.createdAt)}</span>
          <span>#{order.id.slice(-6).toUpperCase()}</span>
        </div>

        <div className="my-3 border-t border-dashed border-canvas-soft" />

        <div className="flex flex-col gap-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-3">
              <span className="text-ink">
                {item.quantity}x {item.productName}
              </span>
              <span className="shrink-0 font-semibold text-ink">
                {formatCurrency(item.unitPrice * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="my-3 border-t border-dashed border-canvas-soft" />

        <div className="flex items-center justify-between text-base font-bold text-ink">
          <span>TOTAL</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </div>

      {restaurant.receiptFooterNote && (
        <div className="border-t border-canvas-soft px-6 py-4 text-center text-xs text-ink-soft">
          {restaurant.receiptFooterNote}
        </div>
      )}
    </Card>
  );
}
