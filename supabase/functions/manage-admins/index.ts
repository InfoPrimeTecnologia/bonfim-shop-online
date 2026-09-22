import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3.23.8";

const requestSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("bootstrap") }),
  z.object({ action: z.literal("list") }),
  z.object({ action: z.literal("add"), email: z.string().trim().email().max(255) }),
]);

const BOOTSTRAP_EMAIL = "luan.contasmu@gmail.com";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método não permitido." }, 405);

  const authorization = req.headers.get("Authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;
  if (!token) return json({ error: "Sessão necessária." }, 401);

  const url = Deno.env.get("SUPABASE_URL");
  const publishableKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !publishableKey || !serviceKey) return json({ error: "Serviço indisponível." }, 500);

  const authClient = createClient(url, publishableKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: authData, error: authError } = await authClient.auth.getUser(token);
  const caller = authData.user;
  if (authError || !caller) return json({ error: "Sessão inválida." }, 401);

  const parsed = requestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ error: "Dados inválidos." }, 400);

  const adminClient = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: callerRole } = await adminClient
    .from("user_roles")
    .select("id")
    .eq("user_id", caller.id)
    .eq("role", "admin")
    .maybeSingle();

  if (parsed.data.action === "bootstrap") {
    const isConfirmedOwner = caller.email_confirmed_at && caller.email?.toLowerCase() === BOOTSTRAP_EMAIL;
    if (!isConfirmedOwner) return json({ error: "Acesso negado." }, 403);
    const { count } = await adminClient.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "admin");
    if ((count ?? 0) > 0 && !callerRole) return json({ error: "O administrador inicial já foi definido." }, 403);
    const { error } = await adminClient.from("user_roles").upsert(
      { user_id: caller.id, role: "admin" },
      { onConflict: "user_id,role" },
    );
    if (error) return json({ error: "Não foi possível liberar o acesso administrativo." }, 500);
    return json({ admin: true });
  }

  if (!callerRole) return json({ error: "Acesso restrito a administradores." }, 403);

  if (parsed.data.action === "add") {
    const normalizedEmail = parsed.data.email.toLowerCase();
    let page = 1;
    let target: { id: string; email?: string; email_confirmed_at?: string } | undefined;
    while (page <= 10 && !target) {
      const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage: 100 });
      if (error) return json({ error: "Não foi possível localizar a conta." }, 500);
      target = data.users.find((user) => user.email?.toLowerCase() === normalizedEmail);
      if (data.users.length < 100) break;
      page += 1;
    }
    if (!target) return json({ error: "Essa pessoa precisa criar uma conta antes de ser administradora." }, 404);
    if (!target.email_confirmed_at) return json({ error: "A conta precisa confirmar o e-mail antes de receber acesso." }, 400);
    const { error } = await adminClient.from("user_roles").upsert(
      { user_id: target.id, role: "admin" },
      { onConflict: "user_id,role" },
    );
    if (error) return json({ error: "Não foi possível adicionar o administrador." }, 500);
    return json({ success: true });
  }

  const { data: roles, error: rolesError } = await adminClient
    .from("user_roles")
    .select("user_id,created_at")
    .eq("role", "admin")
    .order("created_at", { ascending: true });
  if (rolesError) return json({ error: "Não foi possível carregar os administradores." }, 500);

  const admins = await Promise.all((roles ?? []).map(async (role) => {
    const { data } = await adminClient.auth.admin.getUserById(role.user_id);
    return { id: role.user_id, email: data.user?.email ?? "Conta sem e-mail", createdAt: role.created_at };
  }));
  return json({ admins });
});