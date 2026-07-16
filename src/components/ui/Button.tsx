import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children?: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-navy-900 text-white shadow-soft hover:bg-navy-800 disabled:bg-ink-faint navy-gradient",
  secondary:
    "bg-white text-ink border border-canvas-soft shadow-soft hover:border-electric-300 disabled:text-ink-faint",
  ghost: "bg-transparent text-ink-soft hover:bg-canvas-soft disabled:text-ink-faint",
  danger: "bg-danger-100 text-danger-600 hover:bg-danger-100/70 disabled:opacity-50",
};

const sizeClasses: Record<Size, string> = {
  md: "h-11 px-5 text-sm rounded-2xl",
  lg: "h-14 px-7 text-base rounded-3xl",
  icon: "h-11 w-11 rounded-2xl",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "tap-feedback inline-flex items-center justify-center gap-2 font-semibold",
        "disabled:cursor-not-allowed disabled:shadow-none",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
