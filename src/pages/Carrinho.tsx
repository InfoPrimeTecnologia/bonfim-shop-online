import { Link } from "react-router-dom";
import { useStore } from "@/store/store";
import { formatBRL } from "@/data/products";
import { Trash2, Minus, Plus } from "lucide-react";

export default function Carrinho() {
  const { cart, updateQty, removeFromCart, cartTotal } = useStore();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-serif text-4xl">Seu carrinho</h1>

      {cart.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">Seu carrinho está vazio.</p>
          <Link to="/loja" className="mt-6 inline-block rounded-full gradient-deep px-6 py-3 text-sm font-medium text-deep-foreground">Ir para a loja</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr,360px]">
          <div className="space-y-4">
            {cart.map((i) => (
              <div key={i.product.id + (i.size ?? "")} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                <img src={i.product.image} alt={i.product.name} width={120} height={120} className="h-24 w-24 rounded-lg object-cover" />
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium">{i.product.name}</div>
                      {i.size && <div className="text-xs text-muted-foreground">Tamanho: {i.size}</div>}
                    </div>
                    <button onClick={() => removeFromCart(i.product.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-border">
                      <button onClick={() => updateQty(i.product.id, i.qty - 1)} className="p-1.5"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="w-8 text-center text-sm">{i.qty}</span>
                      <button onClick={() => updateQty(i.product.id, i.qty + 1)} className="p-1.5"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                    <div className="font-semibold">{formatBRL(i.qty * i.product.price)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-xl border border-border bg-card p-6">
            <div className="font-serif text-xl">Resumo</div>
            <div className="mt-4 flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{formatBRL(cartTotal)}</span></div>
            <div className="mt-2 flex justify-between text-sm"><span className="text-muted-foreground">Frete</span><span className="text-muted-foreground">Calculado no checkout</span></div>
            <div className="my-4 border-t border-border" />
            <div className="flex justify-between text-lg font-semibold"><span>Total</span><span>{formatBRL(cartTotal)}</span></div>
            <Link to="/checkout" className="mt-6 block w-full rounded-full gradient-deep py-3 text-center text-sm font-medium text-deep-foreground">Finalizar compra</Link>
          </aside>
        </div>
      )}
    </main>
  );
}
