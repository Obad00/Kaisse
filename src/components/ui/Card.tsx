import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  floating?: boolean;
}

export function Card({ className, children, floating = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-surface",
        floating ? "shadow-floating" : "shadow-soft",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
