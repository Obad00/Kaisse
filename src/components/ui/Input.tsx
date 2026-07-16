import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  label?: string;
  error?: string;
}

export function Input({ icon, label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink-soft">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="pointer-events-none absolute left-4 flex h-5 w-5 items-center justify-center text-ink-faint">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            "h-12 w-full rounded-2xl border border-canvas-soft bg-surface-soft px-4 text-[15px] text-ink placeholder:text-ink-faint",
            "outline-none transition focus:border-electric-400 focus:bg-surface focus:ring-2 focus:ring-electric-300/50",
            icon && "pl-11",
            error && "border-danger-600/60 focus:ring-danger-100",
            className
          )}
          {...props}
        />
      </div>
      {error && <span className="text-xs font-medium text-danger-600">{error}</span>}
    </div>
  );
}
