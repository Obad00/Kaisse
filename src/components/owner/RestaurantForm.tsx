import { useState, type FormEvent } from "react";
import type { Restaurant } from "@/services/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Store, MapPin, Phone, MessageSquareText, KeyRound, Image as ImageIcon } from "lucide-react";

interface RestaurantFormProps {
  initial?: Restaurant;
  onSubmit: (values: Omit<Restaurant, "id" | "createdAt">) => Promise<void>;
  onCancel: () => void;
}

export function RestaurantForm({ initial, onSubmit, onCancel }: RestaurantFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [pinCode, setPinCode] = useState(initial?.pinCode ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [receiptFooterNote, setReceiptFooterNote] = useState(initial?.receiptFooterNote ?? "");
  const [accentColor, setAccentColor] = useState(initial?.branding.accentColor ?? "#3D5AFB");
  const [logoUrl, setLogoUrl] = useState(initial?.branding.logoUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Le nom du fastfood est requis.");
    if (!/^\d{4,6}$/.test(pinCode)) return setError("Le PIN doit contenir 4 a 6 chiffres.");

    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        pinCode,
        address: address.trim() || undefined,
        phone: phone.trim() || undefined,
        currency: "FCFA",
        receiptFooterNote: receiptFooterNote.trim() || undefined,
        branding: { accentColor, logoUrl: logoUrl.trim() || null },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Nom du fastfood" icon={<Store size={16} />} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Chez Kaisse" />

      <Input
        label="Code PIN (4 a 6 chiffres)"
        icon={<KeyRound size={16} />}
        value={pinCode}
        onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ""))}
        inputMode="numeric"
        placeholder="1234"
      />

      <Input label="Adresse (optionnel)" icon={<MapPin size={16} />} value={address} onChange={(e) => setAddress(e.target.value)} />
      <Input label="Telephone (optionnel)" icon={<Phone size={16} />} value={phone} onChange={(e) => setPhone(e.target.value)} />
      <Input
        label="Message de pied de ticket"
        icon={<MessageSquareText size={16} />}
        value={receiptFooterNote}
        onChange={(e) => setReceiptFooterNote(e.target.value)}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink-soft">Couleur de marque</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            className="h-11 w-14 cursor-pointer rounded-xl border border-canvas-soft bg-transparent"
          />
          <span className="font-mono text-sm text-ink-soft">{accentColor}</span>
        </div>
      </div>

      <Input
        label="Logo (URL, optionnel)"
        icon={<ImageIcon size={16} />}
        value={logoUrl}
        onChange={(e) => setLogoUrl(e.target.value)}
        placeholder="https://..."
      />

      {error && <p className="text-sm font-medium text-danger-600">{error}</p>}

      <div className="mt-2 flex gap-3">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" className="flex-1" disabled={submitting}>
          {submitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
