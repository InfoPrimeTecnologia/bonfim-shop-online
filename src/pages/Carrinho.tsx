import { Link } from "react-router-dom";
import { formatMoney } from "@/lib/shopify";
import { useCartStore } from "@/store/shopifyCart";
import { Trash2, Minus, Plus, ExternalLink, Loader2 } from "lucide-react";

export default function Carrinho() {
  const { items, updateQuantity, removeItem, checkoutUrl, isLoading, isSyncing } = useCartStore();
  const total = items.reduce((sum, item) => sum + Number(item.variant.price.amount) * item.quantity, 0);
  const currency = items[0]?.variant.price.currencyCode ?? "BRL";
  const checkout = () => { if (checkoutUrl) window.open(checkoutUrl, "_blank", "noopener,noreferrer"); };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-serif text-4xl">Seu carrinho</h1>

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">Seu carrinho está vazio.</p>
          <Link to="/loja" className="mt-6 inline-block rounded-full gradient-deep px-6 py-3 text-sm font-medium text-deep-foreground">Ir para a loja</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr,360px]">
          <div className="space-y-4">
            {items.map((i) => {
              const image = i.product.node.images.edges[0]?.node;
              return (
              <div key={i.variant.id} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                {image ? <img src={image.url} alt={image.altText ?? i.product.node.title} width={120} height={120} className="h-24 w-24 rounded-lg object-cover" /> : <div className="h-24 w-24 rounded-lg bg-muted" />}
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium">{i.product.node.title}</div>
                      {i.variant.title !== "Default Title" && <div className="text-xs text-muted-foreground">{i.variant.title}</div>}
                    </div>
                    <button onClick={() => removeItem(i.variant.id)} aria-label="Remover produto" className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-border">
                      <button onClick={() => updateQuantity(i.variant.id, i.quantity - 1)} aria-label="Diminuir quantidade" className="p-1.5"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="w-8 text-center text-sm">{i.quantity}</span>
                      <button onClick={() => updateQuantity(i.variant.id, i.quantity + 1)} aria-label="Aumentar quantidade" className="p-1.5"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                    <div className="font-semibold">{formatMoney(i.quantity * Number(i.variant.price.amount), i.variant.price.currencyCode)}</div>
                  </div>
                </div>
              </div>);
            })}
          </div>

          <aside className="h-fit rounded-xl border border-border bg-card p-6">
            <div className="font-serif text-xl">Resumo</div>
            <div className="mt-4 flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{formatMoney(total, currency)}</span></div>
            <div className="mt-2 flex justify-between text-sm"><span className="text-muted-foreground">Frete</span><span className="text-muted-foreground">Calculado no checkout</span></div>
            <div className="my-4 border-t border-border" />
            <div className="flex justify-between text-lg font-semibold"><span>Total</span><span>{formatMoney(total, currency)}</span></div>
            <button type="button" onClick={checkout} disabled={!checkoutUrl || isLoading || isSyncing} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full gradient-deep py-3 text-sm font-medium text-deep-foreground disabled:opacity-50">
              {isLoading || isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />} Finalizar compra
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}
