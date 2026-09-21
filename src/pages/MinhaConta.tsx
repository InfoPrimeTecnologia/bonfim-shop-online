import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatMoney } from "@/lib/shopify";

type Order = { id: string; status: string; fulfillment_method: string; total_amount: number; currency_code: string; created_at: string };

export default function MinhaConta() {
  const { user, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    if (!user) return;
    void supabase.from("orders").select("id,status,fulfillment_method,total_amount,currency_code,created_at").order("created_at", { ascending: false }).then(({ data }) => setOrders((data as Order[] | null) ?? []));
  }, [user]);
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="text-xs uppercase tracking-[0.2em] text-gold">Sua conta</div><h1 className="mt-2 font-serif text-4xl">Meus pedidos</h1><p className="mt-1 text-sm text-muted-foreground">{user?.email}</p></div><Button variant="outline" onClick={() => void signOut()}>Sair</Button></div>
      {orders.length === 0 ? <div className="mt-8 rounded-xl border border-border bg-card p-12 text-center"><ShoppingBag className="mx-auto h-9 w-9 text-gold" /><h2 className="mt-4 font-serif text-2xl">Nenhum pedido ainda</h2><Button asChild className="mt-5"><Link to="/loja">Conhecer produtos</Link></Button></div> : <div className="mt-8 space-y-3">{orders.map((order) => <article key={order.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5"><div className="flex items-center gap-3"><Package className="h-5 w-5 text-gold" /><div><div className="font-medium">Pedido {order.id.slice(0, 8).toUpperCase()}</div><div className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString("pt-BR")} · {order.fulfillment_method === "retirada" ? "Retirada no local" : "Entrega em casa"}</div></div></div><div className="text-right"><div className="font-semibold">{formatMoney(order.total_amount, order.currency_code)}</div><div className="text-xs text-muted-foreground">{order.status.replaceAll("_", " ")}</div></div></article>)}</div>}
    </main>
  );
}