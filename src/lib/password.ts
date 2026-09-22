import { z } from "zod";

export const passwordRequirements = [
  { label: "Pelo menos 8 caracteres", test: (value: string) => value.length >= 8 },
  { label: "Uma letra maiúscula", test: (value: string) => /[A-Z]/.test(value) },
  { label: "Uma letra minúscula", test: (value: string) => /[a-z]/.test(value) },
  { label: "Um número", test: (value: string) => /\d/.test(value) },
] as const;

export const passwordSchema = z.string().refine(
  (value) => passwordRequirements.every((requirement) => requirement.test(value)),
  "Crie uma senha que atenda a todos os requisitos.",
);

export function friendlyAuthError(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("weak") || message.includes("guess")) {
    return "Essa senha ainda é fácil de adivinhar. Evite nomes, datas e sequências comuns.";
  }
  if (message.includes("already registered") || message.includes("already exists")) {
    return "Este e-mail já possui uma conta. Tente entrar ou recuperar sua senha.";
  }
  if (message.includes("invalid login credentials")) {
    return "E-mail ou senha incorretos.";
  }
  return error instanceof Error ? error.message : "Revise os dados informados.";
}