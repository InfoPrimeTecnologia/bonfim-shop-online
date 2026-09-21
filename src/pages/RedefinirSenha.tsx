import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export default function RedefinirSenha() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return toast.error("Não foi possível redefinir a senha.");
    toast.success("Senha atualizada.");
    navigate("/minha-conta", { replace: true });
  };
  return <main className="mx-auto max-w-md px-4 py-20"><form onSubmit={submit} className="rounded-xl border border-border bg-card p-7"><h1 className="font-serif text-3xl">Nova senha</h1><div className="mt-6"><Label htmlFor="new-password">Digite a nova senha</Label><Input id="new-password" type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1" /></div><Button type="submit" className="mt-5 w-full">Salvar nova senha</Button></form></main>;
}