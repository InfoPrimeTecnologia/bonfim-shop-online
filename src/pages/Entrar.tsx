import { useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

function safeNext(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/minha-conta";
}

export default function Entrar() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "cadastro">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const next = safeNext(params.get("next"));

  if (user) return <Navigate to={next} replace />;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "cadastro") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("Cadastro recebido", { description: "Confirme seu e-mail para entrar." });
          setMode("login");
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate(next, { replace: true });
    } catch (error) {
      toast.error("Não foi possível continuar", { description: error instanceof Error ? error.message : "Revise os dados informados." });
    } finally { setBusy(false); }
  };

  const forgot = async () => {
    if (!email) return toast.error("Informe seu e-mail primeiro.");
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/redefinir-senha` });
    if (error) toast.error("Não foi possível enviar o link."); else toast.success("Link de recuperação enviado.");
  };

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-xl border border-border bg-card p-7 shadow-elegant">
        <div className="flex h-11 w-11 items-center justify-center rounded-full gradient-gold text-deep"><Mail className="h-5 w-5" /></div>
        <h1 className="mt-5 font-serif text-3xl">{mode === "login" ? "Entrar na sua conta" : "Criar sua conta"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Acompanhe pagamentos, entrega ou retirada dos seus pedidos.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "cadastro" && <div><Label htmlFor="name">Nome completo</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" /></div>}
          <div><Label htmlFor="email">E-mail</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" /></div>
          <div><Label htmlFor="password">Senha</Label><Input id="password" type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1" /></div>
          <Button type="submit" disabled={busy} className="w-full">{busy && <Loader2 className="animate-spin" />}{mode === "login" ? "Entrar" : "Criar conta"}</Button>
        </form>
        {mode === "login" && <button type="button" onClick={forgot} className="mt-3 w-full text-center text-sm text-muted-foreground hover:text-foreground">Esqueci minha senha</button>}
        <button type="button" onClick={() => setMode(mode === "login" ? "cadastro" : "login")} className="mt-5 w-full text-center text-sm text-gold">
          {mode === "login" ? "Ainda não tenho conta" : "Já tenho uma conta"}
        </button>
      </div>
    </main>
  );
}