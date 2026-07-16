import { useEffect, useMemo, useState } from "react";
import type { Category, Order, Product, Restaurant } from "@/services/types";
import { categoryService, orderService, productService, restaurantService } from "@/services";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import { useTenantStore } from "@/store/tenantStore";
import { usePrinter } from "@/hooks/usePrinter";
import { useBranding } from "@/hooks/useBranding";
import { CategoryTabs } from "@/components/pos/CategoryTabs";
import { ProductGrid } from "@/components/pos/ProductGrid";
import { Cart } from "@/components/pos/Cart";
import { MobileCartBar } from "@/components/pos/MobileCartBar";
import { PrinterStatusBadge } from "@/components/receipt/PrinterStatusBadge";
import { ReceiptCard } from "@/components/receipt/ReceiptCard";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

export function POSPage() {
  const activeRestaurantId = useTenantStore((s) => s.activeRestaurantId)!;

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | "all">("all");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [printError, setPrintError] = useState<string | null>(null);

  const lines = useCartStore((s) => s.lines);
  const clearCart = useCartStore((s) => s.clear);
  const itemCount = useCartStore((s) => s.itemCount());
  const activeReceiptOrder = useUiStore((s) => s.activeReceiptOrder);
  const showReceipt = useUiStore((s) => s.showReceipt);
  const closeReceipt = useUiStore((s) => s.closeReceipt);

  const printer = usePrinter();
  useBranding(restaurant);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [cats, prods, restaurantData] = await Promise.all([
        categoryService.list(activeRestaurantId),
        productService.list(activeRestaurantId),
        restaurantService.get(activeRestaurantId),
      ]);
      if (cancelled) return;
      setCategories(cats);
      setProducts(prods);
      setRestaurant(restaurantData);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [activeRestaurantId]);

  const quantitiesByProductId = useMemo(() => {
    const map: Record<string, number> = {};
    for (const line of lines) map[line.productId] = line.quantity;
    return map;
  }, [lines]);

  const visibleProducts = useMemo(() => {
    const active = products.filter((p) => p.isActive);
    if (activeCategoryId === "all") return active;
    return active.filter((p) => p.categoryId === activeCategoryId);
  }, [products, activeCategoryId]);

  async function handleValidate() {
    if (lines.length === 0) return;
    setSubmitting(true);
    setPrintError(null);
    try {
      const order: Order = await orderService.create(activeRestaurantId, lines);
      clearCart();
      showReceipt(order);

      if (printer.status === "connected" && restaurant) {
        try {
          await printer.print(order, restaurant);
        } catch (err) {
          setPrintError(
            err instanceof Error ? err.message : "Impression impossible, ticket affiche a l'ecran."
          );
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div
        className={cn(
          "flex-1 px-4 py-5 sm:px-6 sm:py-8",
          itemCount > 0 ? "pb-32 lg:pb-8" : "pb-8"
        )}
      >
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">Caisse</h1>
            <p className="text-sm text-ink-soft">{restaurant?.name}</p>
          </div>
          <PrinterConnectControl printer={printer} />
        </div>

        <div className="mb-5">
          <CategoryTabs
            categories={categories}
            activeCategoryId={activeCategoryId}
            onChange={setActiveCategoryId}
          />
        </div>

        {loading ? (
          <GridSkeleton />
        ) : (
          <ProductGrid
            products={visibleProducts}
            quantitiesByProductId={quantitiesByProductId}
            onSelect={(product) => useCartStore.getState().addProduct(product)}
          />
        )}
      </div>

      <div className="hidden w-[380px] shrink-0 p-6 lg:block">
        <div className="sticky top-6 h-[calc(100vh-3rem)]">
          <Cart onValidate={handleValidate} isSubmitting={submitting} />
        </div>
      </div>

      <MobileCartBar onValidate={handleValidate} isSubmitting={submitting} />

      <Modal
        open={!!activeReceiptOrder}
        onClose={closeReceipt}
        title="Ticket de caisse"
        maxWidthClassName="max-w-sm"
      >
        {activeReceiptOrder && restaurant && (
          <div className="flex flex-col gap-4">
            {printError && (
              <p className="rounded-2xl bg-warn-100 px-4 py-3 text-sm font-medium text-warn-600">
                {printError}
              </p>
            )}
            <ReceiptCard order={activeReceiptOrder} restaurant={restaurant} />
            <Button variant="secondary" onClick={closeReceipt}>
              Fermer
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

function PrinterConnectControl({ printer }: { printer: ReturnType<typeof usePrinter> }) {
  if (printer.status === "connected") {
    return (
      <button onClick={printer.disconnect} className="tap-feedback">
        <PrinterStatusBadge status={printer.status} deviceName={printer.deviceName} />
      </button>
    );
  }
  return (
    <button onClick={printer.connect} className="tap-feedback">
      <PrinterStatusBadge status={printer.status} deviceName={printer.deviceName} />
    </button>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-3xl bg-surface shadow-soft">
          <div className="aspect-[4/3] bg-canvas-soft" />
          <div className="space-y-2 px-4 py-3.5">
            <div className="h-3.5 w-3/4 rounded bg-canvas-soft" />
            <div className="h-3 w-1/3 rounded bg-canvas-soft" />
          </div>
        </div>
      ))}
    </div>
  );
}
