import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  maxWidthClassName?: string;
}

export function Modal({ open, onClose, title, children, maxWidthClassName = "max-w-md" }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/40 backdrop-blur-sm sm:items-center">
      <div
        className={cn(
          "max-h-[90vh] w-full overflow-y-auto rounded-t-4xl bg-surface p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-floating sm:rounded-3xl sm:pb-6",
          maxWidthClassName
        )}
      >
        {title && (
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="tap-feedback flex h-9 w-9 items-center justify-center rounded-full bg-canvas-soft text-ink-soft hover:bg-canvas"
            >
              <X size={18} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
