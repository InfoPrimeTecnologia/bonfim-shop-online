import { Link } from "react-router-dom";
import { ExternalLink, ShoppingBag } from "lucide-react";
import { formatMoney } from "@/lib/shopify";
import { useCartStore } from "@/store/shopifyCart";

export default function Checkout() {
  const { items, checkoutUrl, isLoading, isSyncing } = useCartStore();
  const total = items.reduce((sum, item) => sum + Number(item.variant.price.amount) * item.quantity, 0);
  const currency = items[0]?.variant.price.currencyCode ?? "BRL";

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl">Seu carrinho está vazio</h1>
        <Link to="/loja" className="mt-6 inline-block rounded-full gradient-deep px-6 py-3 text-sm text-deep-foreground">Ver produtos</Link>
      </main>
    );
  }

  const checkout = () => { if (checkoutUrl) window.open(checkoutUrl, "_blank", "noopener,noreferrer"); };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-serif text-4xl">Finalizar compra</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr,400px]">
        <div className="rounded-xl border border-border bg-card p-8">
          <ShoppingBag className="h-8 w-8 text-gold" />
          <h2 className="mt-4 font-serif text-2xl">Checkout seguro Shopify</h2>
          <p className="mt-2 text-muted-foreground">Dados pessoais, entrega e pagamento serão preenchidos no ambiente protegido da Shopify. As opções disponíveis dependem da configuração da loja.</p>
        </div>

        <aside className="h-fit rounded-xl border border-border bg-card p-6">
          <div className="font-serif text-xl">Resumo do pedido</div>
          <div className="mt-4 space-y-3">
            {items.map((i) => (
              <div key={i.variant.id} className="flex justify-between gap-2 text-sm">
                <span className="flex-1">{i.product.node.title} × {i.quantity}</span>
                <span>{formatMoney(i.quantity * Number(i.variant.price.amount), i.variant.price.currencyCode)}</span>
              </div>
            ))}
          </div>
          <div className="my-4 border-t border-border" />
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{formatBRL(cartTotal)}</span></div>
          <div className="mt-1 flex justify-between text-sm"><span className="text-muted-foreground">Frete</span><span>Calculado no checkout</span></div>
          <div className="my-3 border-t border-border" />
          <div className="flex justify-between text-lg font-semibold"><span>Subtotal</span><span>{formatMoney(total, currency)}</span></div>
          <button
            type="button"
            onClick={checkout}
            disabled={!checkoutUrl || isLoading || isSyncing}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full gradient-deep py-3 text-sm font-medium text-deep-foreground disabled:opacity-60"
          >
            <ExternalLink className="h-4 w-4" /> Ir para pagamento
          </button>
        </aside>
      </div>
    </main>
  );
}
