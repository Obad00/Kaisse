import type { ReactNode } from "react";
import type { Category } from "@/services/types";
import { cn } from "@/utils/cn";

interface CategoryTabsProps {
  categories: Category[];
  activeCategoryId: string | "all";
  onChange: (categoryId: string | "all") => void;
}

export function CategoryTabs({ categories, activeCategoryId, onChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <TabButton active={activeCategoryId === "all"} onClick={() => onChange("all")}>
        Tout
      </TabButton>
      {categories.map((cat) => (
        <TabButton key={cat.id} active={activeCategoryId === cat.id} onClick={() => onChange(cat.id)}>
          {cat.name}
        </TabButton>
      ))}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "tap-feedback shrink-0 rounded-2xl px-5 py-2.5 text-sm font-semibold whitespace-nowrap",
        active
          ? "bg-navy-900 text-white shadow-soft navy-gradient"
          : "bg-surface text-ink-soft shadow-soft hover:text-ink"
      )}
    >
      {children}
    </button>
  );
}
