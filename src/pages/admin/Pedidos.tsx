import { ShoppingBag } from "lucide-react";

export default function AdminPedidos() {
  return (
    <div>
      <div className="mb-6"><h1 className="font-serif text-3xl">Pedidos</h1><p className="text-sm text-muted-foreground">Pedidos processados pela Shopify</p></div>
      <div className="rounded-xl border border-border bg-card p-12 text-center"><ShoppingBag className="mx-auto h-9 w-9 text-gold" /><h2 className="mt-4 font-serif text-xl">Gestão segura de pedidos</h2><p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">Após reivindicar a loja, pedidos, pagamentos, entregas e relatórios ficam disponíveis no painel administrativo da Shopify.</p></div>
    </div>
  );
}