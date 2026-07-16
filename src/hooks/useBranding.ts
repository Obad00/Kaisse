import { useEffect } from "react";
import type { Restaurant } from "@/services/types";

// Applies a restaurant's brand accent color to the whole app by overriding
// the electric-blue CSS variables on the document root. Falls back to
// Kaisse's default palette when no restaurant is active (selection screen,
// owner space).
function hexToRgb(hex: string): [number, number, number] | null {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!match) return null;
  return [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)];
}

function mix(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}

function shade(hex: string, t: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const target = t < 0 ? [0, 0, 0] : [255, 255, 255];
  const amount = Math.abs(t);
  const [r, g, b] = rgb;
  const nr = mix(r, target[0], amount);
  const ng = mix(g, target[1], amount);
  const nb = mix(b, target[2], amount);
  return `#${[nr, ng, nb].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

export function useBranding(restaurant: Restaurant | null | undefined) {
  useEffect(() => {
    const root = document.documentElement;
    if (!restaurant?.branding?.accentColor) {
      root.style.removeProperty("--color-electric-500");
      root.style.removeProperty("--color-electric-400");
      root.style.removeProperty("--color-electric-300");
      root.style.removeProperty("--color-navy-950");
      root.style.removeProperty("--color-navy-900");
      root.style.removeProperty("--color-navy-800");
      return;
    }
    const accent = restaurant.branding.accentColor;
    root.style.setProperty("--color-electric-500", accent);
    root.style.setProperty("--color-electric-400", shade(accent, 0.18));
    root.style.setProperty("--color-electric-300", shade(accent, 0.42));
    root.style.setProperty("--color-navy-950", shade(accent, -0.72));
    root.style.setProperty("--color-navy-900", shade(accent, -0.6));
    root.style.setProperty("--color-navy-800", shade(accent, -0.42));
  }, [restaurant?.branding?.accentColor]);
}
