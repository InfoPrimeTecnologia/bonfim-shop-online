import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/store/store";
import { formatBRL } from "@/data/products";
import { CheckCircle2 } from "lucide-react";
import { z } from "zod";

const search = z.object({ id: z.string().optional() });

export const Route = createFileRoute("/pedido-confirmado")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "Pedido confirmado" }] }),
  component: Confirmado,
});

function Confirmado() {
  const { id } = Route.useSearch();
  const { orders } = useStore();
  const order = orders.find((o) => o.id === id);

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full gradient-gold text-deep">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h1 className="mt-6 font-serif text-4xl">Pedido confirmado!</h1>
      <p className="mt-3 text-muted-foreground">Obrigado pela sua compra. Que Deus abençoe!</p>

      {order && (
        <div className="mt-8 rounded-xl border border-border bg-card p-6 text-left">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Pedido</span><span className="font-mono">{order.id}</span></div>
          <div className="mt-2 flex justify-between text-sm"><span className="text-muted-foreground">Cliente</span><span>{order.customer}</span></div>
          <div className="mt-2 flex justify-between text-sm"><span className="text-muted-foreground">Entrega</span><span className="capitalize">{order.delivery}</span></div>
          <div className="mt-2 flex justify-between text-sm"><span className="text-muted-foreground">Pagamento</span><span className="uppercase">{order.payment}</span></div>
          <div className="my-4 border-t border-border" />
          <div className="flex justify-between text-lg font-semibold"><span>Total</span><span>{formatBRL(order.total)}</span></div>
        </div>
      )}

      <Link to="/loja" className="mt-8 inline-block rounded-full gradient-deep px-6 py-3 text-sm font-medium text-deep-foreground">Continuar comprando</Link>
    </main>
  );
}
