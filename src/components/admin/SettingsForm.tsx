import { useState, type FormEvent } from "react";
import type { Restaurant } from "@/services/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Store, MapPin, Phone, MessageSquareText, Image as ImageIcon } from "lucide-react";

interface SettingsFormProps {
  initial: Restaurant;
  onSave: (patch: Partial<Restaurant>) => Promise<void>;
}

export function SettingsForm({ initial, onSave }: SettingsFormProps) {
  const [name, setName] = useState(initial.name);
  const [address, setAddress] = useState(initial.address ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [receiptFooterNote, setReceiptFooterNote] = useState(initial.receiptFooterNote ?? "");
  const [accentColor, setAccentColor] = useState(initial.branding.accentColor);
  const [logoUrl, setLogoUrl] = useState(initial.branding.logoUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await onSave({
        name,
        address,
        phone,
        receiptFooterNote,
        branding: { accentColor, logoUrl: logoUrl.trim() || null },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Nom du fastfood" icon={<Store size={17} />} value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Adresse" icon={<MapPin size={17} />} value={address} onChange={(e) => setAddress(e.target.value)} />
        <Input label="Telephone (optionnel)" icon={<Phone size={17} />} value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Input
          label="Message de pied de ticket"
          icon={<MessageSquareText size={17} />}
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

        <div className="mt-2 flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Enregistrement..." : "Enregistrer"}
          </Button>
          {saved && <span className="text-sm font-medium text-success-600">Enregistre !</span>}
        </div>
      </form>
    </Card>
  );
}
