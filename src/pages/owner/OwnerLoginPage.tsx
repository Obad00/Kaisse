import { useState, type FormEvent, type ReactNode } from "react";
import { Lock, Crown } from "lucide-react";
import { useOwnerAuth } from "@/hooks/useOwnerAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function OwnerLoginPage({ children }: { children: ReactNode }) {
  const { isOwnerAuthenticated, attemptLogin, error, checking } = useOwnerAuth();
  const [password, setPassword] = useState("");

  if (isOwnerAuthenticated) return <>{children}</>;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await attemptLogin(password);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <Card floating className="w-full max-w-sm p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl navy-gradient text-white">
            <Crown size={24} />
          </div>
          <h1 className="font-display text-xl font-bold text-ink">Espace Proprietaire</h1>
          <p className="text-sm text-ink-soft">Gerez vos fastfoods Kaisse.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="password"
            icon={<Lock size={16} />}
            placeholder="Mot de passe proprietaire"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error ?? undefined}
            autoFocus
          />
          <Button type="submit" size="lg" disabled={checking}>
            {checking ? "Verification..." : "Se connecter"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
