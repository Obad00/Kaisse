import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/utils/currency";
import { Modal } from "@/components/ui/Modal";
import { Cart } from "./Cart";

interface MobileCartBarProps {
  onValidate: () => void;
  isSubmitting?: boolean;
}

export function MobileCartBar({ onValidate, isSubmitting = false }: MobileCartBarProps) {
  const [open, setOpen] = useState(false);
  const total = useCartStore((s) => s.total());
  const itemCount = useCartStore((s) => s.itemCount());

  if (itemCount === 0) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="tap-feedback fixed inset-x-4 bottom-[calc(4rem+0.75rem+env(safe-area-inset-bottom))] z-40 flex items-center justify-between rounded-3xl navy-gradient px-5 py-4 text-white shadow-floating lg:hidden"
      >
        <span className="flex items-center gap-2.5 text-sm font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
            <ShoppingBag size={16} />
          </span>
          {itemCount} article{itemCount > 1 ? "s" : ""}
        </span>
        <span className="font-mono text-lg font-bold">{formatCurrency(total)}</span>
      </button>

      <div className="lg:hidden">
        <Modal open={open} onClose={() => setOpen(false)} maxWidthClassName="max-w-md">
          <div className="h-[70vh]">
            <Cart
              onValidate={() => {
                onValidate();
              }}
              isSubmitting={isSubmitting}
            />
          </div>
        </Modal>
      </div>
    </>
  );
}
