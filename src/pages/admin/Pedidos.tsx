import { useState } from "react";
import { useStore } from "@/store/store";
import { formatBRL } from "@/data/products";

export default function AdminPedidos() {
  const { orders } = useStore();
  const [filter, setFilter] = useState<"todos" | "pago" | "pendente" | "enviado">("todos");

  const list = orders.filter((o) => filter === "todos" || o.status === filter);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-3xl">Pedidos</h1>
        <p className="text-sm text-muted-foreground">Acompanhe e gerencie os pedidos</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(["todos", "pago", "pendente", "enviado"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full border px-4 py-1.5 text-sm capitalize ${
              filter === s ? "gradient-deep border-transparent text-deep-foreground" : "border-border bg-card hover:border-gold"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-4">Pedido</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Data</th>
              <th className="p-4">Entrega</th>
              <th className="p-4">Pagamento</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id} className="border-t border-border">
                <td className="p-4 font-mono text-xs">{o.id}</td>
                <td className="p-4">{o.customer}</td>
                <td className="p-4 text-muted-foreground">{new Date(o.date).toLocaleDateString("pt-BR")}</td>
                <td className="p-4 capitalize">{o.delivery}</td>
                <td className="p-4 uppercase text-xs">{o.payment}</td>
                <td className="p-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    o.status === "pago" ? "bg-accent text-accent-foreground" :
                    o.status === "pendente" ? "bg-muted text-muted-foreground" :
                    "gradient-gold text-deep"
                  }`}>{o.status}</span>
                </td>
                <td className="p-4 text-right font-medium">{formatBRL(o.total)}</td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Nenhum pedido neste filtro.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
