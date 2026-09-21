import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatMoney } from "@/lib/shopify";

type Order = { id: string; status: string; fulfillment_method: string; total_amount: number; currency_code: string; created_at: string };

export default function AdminPedidos() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => { void supabase.from("orders").select("id,status,fulfillment_method,total_amount,currency_code,created_at").order("created_at", { ascending: false }).then(({ data }) => setOrders((data as Order[] | null) ?? [])); }, []);
  return (
    <div>
      <div className="mb-6"><h1 className="font-serif text-3xl">Pedidos</h1><p className="text-sm text-muted-foreground">Pedidos processados pela Shopify</p></div>
      {orders.length === 0 ? <div className="rounded-xl border border-border bg-card p-12 text-center"><ShoppingBag className="mx-auto h-9 w-9 text-gold" /><h2 className="mt-4 font-serif text-xl">Nenhum pedido iniciado</h2><p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">As compras iniciadas por clientes autenticados aparecerão aqui.</p></div> : <div className="overflow-x-auto rounded-xl border border-border bg-card"><table className="w-full text-sm"><thead className="bg-muted/40 text-left"><tr><th className="p-4">Pedido</th><th className="p-4">Data</th><th className="p-4">Recebimento</th><th className="p-4">Status</th><th className="p-4 text-right">Total</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id} className="border-t border-border"><td className="p-4 font-medium">{order.id.slice(0, 8).toUpperCase()}</td><td className="p-4">{new Date(order.created_at).toLocaleDateString("pt-BR")}</td><td className="p-4">{order.fulfillment_method === "retirada" ? "Retirada" : "Entrega"}</td><td className="p-4 capitalize">{order.status.replaceAll("_", " ")}</td><td className="p-4 text-right font-medium">{formatMoney(order.total_amount, order.currency_code)}</td></tr>)}</tbody></table></div>}
    </div>
  );
}