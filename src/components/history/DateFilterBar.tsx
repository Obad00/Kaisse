import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { formatDayLabel, todayIsoDate } from "@/utils/date";

interface DateFilterBarProps {
  isoDate: string;
  onChange: (isoDate: string) => void;
}

function shiftDate(isoDate: string, deltaDays: number): string {
  const d = new Date(`${isoDate}T00:00:00`);
  d.setDate(d.getDate() + deltaDays);
  return d.toISOString().slice(0, 10);
}

export function DateFilterBar({ isoDate, onChange }: DateFilterBarProps) {
  const isToday = isoDate === todayIsoDate();

  return (
    <div className="flex items-center justify-between gap-3 rounded-3xl bg-surface p-3 shadow-soft">
      <button
        onClick={() => onChange(shiftDate(isoDate, -1))}
        aria-label="Jour precedent"
        className="tap-feedback flex h-10 w-10 items-center justify-center rounded-2xl text-ink-soft hover:bg-canvas-soft"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="flex items-center gap-2 text-sm font-medium text-ink">
        <CalendarDays size={16} className="text-electric-500" />
        <span className="capitalize">{formatDayLabel(isoDate)}</span>
      </div>

      <div className="flex items-center gap-1.5">
        {!isToday && (
          <button
            onClick={() => onChange(todayIsoDate())}
            className="tap-feedback rounded-2xl bg-canvas-soft px-3 py-2 text-xs font-semibold text-ink-soft hover:text-ink"
          >
            Aujourd'hui
          </button>
        )}
        <button
          onClick={() => onChange(shiftDate(isoDate, 1))}
          aria-label="Jour suivant"
          disabled={isToday}
          className="tap-feedback flex h-10 w-10 items-center justify-center rounded-2xl text-ink-soft hover:bg-canvas-soft disabled:opacity-30"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
