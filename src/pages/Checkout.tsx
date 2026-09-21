import { Link } from "react-router-dom";
import { useState } from "react";
import { ExternalLink, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatMoney } from "@/lib/shopify";
import { useCartStore } from "@/store/shopifyCart";

export default function Checkout() {
  const { items, checkoutUrl, isLoading, isSyncing } = useCartStore();
  const { user } = useAuth();
  const [fulfillment, setFulfillment] = useState<"entrega" | "retirada">("entrega");
  const [opening, setOpening] = useState(false);
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

  const checkout = async () => {
    if (!checkoutUrl || !user) return;
    setOpening(true);
    const cartId = useCartStore.getState().cartId;
    if (!cartId) {
      setOpening(false);
      return toast.error("Carrinho indisponível. Tente adicionar o produto novamente.");
    }
    const { error } = await supabase.from("orders").upsert({
      user_id: user.id,
      shopify_cart_id: cartId,
      checkout_url: checkoutUrl,
      status: "aguardando_pagamento",
      fulfillment_method: fulfillment,
      total_amount: total,
      currency_code: currency,
      items: items.map((item) => ({ product_id: item.product.node.id, title: item.product.node.title, variant_id: item.variant.id, variant: item.variant.title, quantity: item.quantity, price: item.variant.price })),
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,shopify_cart_id" });
    setOpening(false);
    if (error) return toast.error("Não foi possível registrar o pedido.");
    window.open(checkoutUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-serif text-4xl">Finalizar compra</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr,400px]">
        <div className="rounded-xl border border-border bg-card p-8">
          <ShoppingBag className="h-8 w-8 text-gold" />
          <h2 className="mt-4 font-serif text-2xl">Checkout seguro Shopify</h2>
          <p className="mt-2 text-muted-foreground">Dados pessoais, entrega e pagamento serão preenchidos no ambiente protegido da Shopify. As opções disponíveis dependem da configuração da loja.</p>
          <div className="mt-6">
            <div className="text-sm font-medium">Como deseja receber?</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => setFulfillment("entrega")} className={`rounded-md border p-4 text-left text-sm ${fulfillment === "entrega" ? "border-gold bg-accent" : "border-border bg-background"}`}><strong>Entrega em casa</strong><span className="mt-1 block text-muted-foreground">Endereço e frete no pagamento</span></button>
              <button type="button" onClick={() => setFulfillment("retirada")} className={`rounded-md border p-4 text-left text-sm ${fulfillment === "retirada" ? "border-gold bg-accent" : "border-border bg-background"}`}><strong>Retirada no local</strong><span className="mt-1 block text-muted-foreground">Retire na Igreja do Senhor do Bonfim</span></button>
            </div>
          </div>
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
          <div className="mt-1 flex justify-between text-sm"><span className="text-muted-foreground">Frete</span><span>Calculado no checkout</span></div>
          <div className="my-3 border-t border-border" />
          <div className="flex justify-between text-lg font-semibold"><span>Subtotal</span><span>{formatMoney(total, currency)}</span></div>
          <Button
            type="button"
            onClick={checkout}
            disabled={!checkoutUrl || isLoading || isSyncing || opening}
            className="mt-6 w-full rounded-full"
          >
            {opening ? <Loader2 className="animate-spin" /> : <ExternalLink />} Ir para pagamento
          </Button>
        </aside>
      </div>
    </main>
  );
}
