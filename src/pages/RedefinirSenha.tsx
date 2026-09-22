import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/PasswordField";
import { supabase } from "@/integrations/supabase/client";
import { friendlyAuthError, passwordSchema } from "@/lib/password";

export default function RedefinirSenha() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const navigate = useNavigate();
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = passwordSchema.safeParse(password);
    if (!parsed.success) return toast.error(parsed.error.issues[0]?.message ?? "Revise a senha.");
    if (password !== confirmation) return toast.error("As senhas não são iguais.");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return toast.error("Não foi possível redefinir a senha.", { description: friendlyAuthError(error) });
    toast.success("Senha atualizada.");
    navigate("/minha-conta", { replace: true });
  };
  return <main className="mx-auto max-w-md px-4 py-20"><form onSubmit={submit} className="rounded-xl border border-border bg-card p-7"><h1 className="font-serif text-3xl">Nova senha</h1><div className="mt-6 space-y-4"><PasswordField id="new-password" label="Digite a nova senha" value={password} onChange={setPassword} autoComplete="new-password" showRequirements /><PasswordField id="new-password-confirmation" label="Confirmar nova senha" value={confirmation} onChange={setConfirmation} autoComplete="new-password" /></div><Button type="submit" className="mt-5 w-full">Salvar nova senha</Button></form></main>;
}