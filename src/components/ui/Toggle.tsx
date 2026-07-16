import { cn } from "@/utils/cn";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4">
      {label && <span className="text-sm font-medium text-ink">{label}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "tap-feedback relative h-7 w-12 rounded-full transition-colors",
          checked ? "bg-electric-500" : "bg-canvas-soft"
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-5 w-5 rounded-full bg-white shadow-soft transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </label>
  );
}
