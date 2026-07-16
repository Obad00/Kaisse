import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type Tone = "success" | "warn" | "danger" | "neutral" | "electric";

const toneClasses: Record<Tone, string> = {
  success: "bg-success-100 text-success-600",
  warn: "bg-warn-100 text-warn-600",
  danger: "bg-danger-100 text-danger-600",
  neutral: "bg-canvas-soft text-ink-soft",
  electric: "bg-electric-300/25 text-electric-500",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        toneClasses[tone]
      )}
    >
      {children}
    </span>
  );
}
