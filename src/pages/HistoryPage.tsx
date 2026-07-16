import { useEffect, useState } from "react";
import type { Order } from "@/services/types";
import { orderService } from "@/services";
import { useTenantStore } from "@/store/tenantStore";
import { DateFilterBar } from "@/components/history/DateFilterBar";
import { OrderList } from "@/components/history/OrderList";
import { todayIsoDate } from "@/utils/date";

export function HistoryPage() {
  const activeRestaurantId = useTenantStore((s) => s.activeRestaurantId)!;
  const [isoDate, setIsoDate] = useState(todayIsoDate());
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    orderService.listByDay(activeRestaurantId, isoDate).then((data) => {
      if (!cancelled) {
        setOrders(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [activeRestaurantId, isoDate]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-8 sm:py-10">
      <h1 className="mb-5 font-display text-2xl font-bold text-ink">Historique des ventes</h1>

      <div className="mb-5">
        <DateFilterBar isoDate={isoDate} onChange={setIsoDate} />
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-3xl bg-surface shadow-soft" />
          ))}
        </div>
      ) : (
        <OrderList orders={orders} />
      )}
    </div>
  );
}
