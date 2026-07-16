import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { KeyRound, Store, ArrowLeft, Crown } from "lucide-react";
import type { Restaurant } from "@/services/types";
import { restaurantService } from "@/services";
import { useRestaurantAccess } from "@/hooks/useRestaurantAccess";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function RestaurantSelectPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const [pin, setPin] = useState("");
  const { attemptUnlock, error, checking } = useRestaurantAccess();
  const navigate = useNavigate();

  useEffect(() => {
    restaurantService.list().then((list) => {
      setRestaurants(list);
      setLoading(false);
    });
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!selected) return;
    const ok = await attemptUnlock(selected.id, pin);
    if (ok) navigate("/");
  }

  if (selected) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
        <Card floating className="w-full max-w-sm p-8">
          <button
            onClick={() => {
              setSelected(null);
              setPin("");
            }}
            className="tap-feedback mb-5 flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink"
          >
            <ArrowLeft size={15} />
            Changer de fastfood
          </button>

          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-soft"
              style={{ backgroundColor: selected.branding.accentColor }}
            >
              {selected.branding.logoUrl ? (
                <img src={selected.branding.logoUrl} alt={selected.name} className="h-full w-full rounded-2xl object-cover" />
              ) : (
                <Store size={24} />
              )}
            </div>
            <h1 className="font-display text-xl font-bold text-ink">{selected.name}</h1>
            <p className="text-sm text-ink-soft">Entrez le code PIN de ce fastfood.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="password"
              inputMode="numeric"
              icon={<KeyRound size={16} />}
              placeholder="Code PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              error={error ?? undefined}
              autoFocus
            />
            <Button type="submit" size="lg" disabled={checking}>
              {checking ? "Verification..." : "Deverrouiller"}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl">
            <img
              src="/icons/kaisse.png"
              alt="Kaisse"
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink">Bienvenue sur Kaisse</h1>
          <p className="mt-1 text-sm text-ink-soft">Choisissez votre fastfood pour continuer.</p>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-3xl bg-surface shadow-soft" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {restaurants.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                className="tap-feedback flex items-center gap-4 rounded-3xl bg-surface p-5 text-left shadow-soft hover:shadow-floating"
              >
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white"
                  style={{ backgroundColor: r.branding.accentColor }}
                >
                  {r.branding.logoUrl ? (
                    <img src={r.branding.logoUrl} alt={r.name} className="h-full w-full rounded-2xl object-cover" />
                  ) : (
                    <Store size={22} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display font-semibold text-ink">{r.name}</p>
                  <p className="truncate text-xs text-ink-soft">{r.address}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/owner"
            className="tap-feedback inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink"
          >
            <Crown size={14} />
            Espace proprietaire
          </Link>
        </div>
      </div>
    </div>
  );
}
