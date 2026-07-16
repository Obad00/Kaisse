export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function todayIsoDate(): string {
  return toIsoDate(new Date());
}

export function formatDayLabel(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00`);
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
}
