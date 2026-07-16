import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-canvas-soft bg-surface-soft px-8 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-canvas-soft text-ink-faint">
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="max-w-xs text-sm text-ink-soft">{description}</p>}
      {action}
    </div>
  );
}
