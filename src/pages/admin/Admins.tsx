import { useCallback, useEffect, useState } from "react";
import { Loader2, ShieldCheck, UserPlus } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

type Admin = { id: string; email: string; createdAt: string };
const emailSchema = z.string().trim().email("Informe um e-mail válido.").max(255);

async function invoke<T>(body: object) {
  const { data, error } = await supabase.functions.invoke("manage-admins", { body });
  if (error) throw new Error(typeof data?.error === "string" ? data.error : error.message);
  if (data?.error) throw new Error(data.error);
  return data as T;
}

export default function Admins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await invoke<{ admins: Admin[] }>({ action: "list" });
      setAdmins(data.admins);
    } catch (error) {
      toast.error("Não foi possível carregar os administradores.", { description: error instanceof Error ? error.message : undefined });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const addAdmin = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return toast.error(parsed.error.issues[0]?.message ?? "Informe um e-mail válido.");
    setSaving(true);
    try {
      await invoke({ action: "add", email: parsed.data });
      toast.success("Administrador adicionado.");
      setEmail("");
      await load();
    } catch (error) {
      toast.error("Não foi possível adicionar.", { description: error instanceof Error ? error.message : undefined });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl">Administradores</h1>
      <p className="mt-2 text-sm text-muted-foreground">Conceda acesso somente a pessoas de confiança que já confirmaram a própria conta.</p>

      <form onSubmit={addAdmin} className="mt-8 border-y border-border py-6">
        <Label htmlFor="admin-email">E-mail da pessoa</Label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nome@exemplo.com" required className="sm:max-w-md" />
          <Button type="submit" disabled={saving}>{saving ? <Loader2 className="animate-spin" /> : <UserPlus />}Adicionar administrador</Button>
        </div>
      </form>

      <div className="mt-8">
        <h2 className="font-serif text-2xl">Pessoas com acesso</h2>
        {loading ? (
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="animate-spin" />Carregando</div>
        ) : (
          <div className="mt-4 divide-y divide-border border-y border-border">
            {admins.map((admin) => (
              <div key={admin.id} className="flex items-center gap-3 py-4">
                <ShieldCheck className="h-5 w-5 text-gold" />
                <div className="min-w-0"><p className="truncate text-sm font-medium">{admin.email}</p><p className="text-xs text-muted-foreground">Administrador desde {new Date(admin.createdAt).toLocaleDateString("pt-BR")}</p></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}