import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "@/store/store";
import { formatBRL } from "@/data/products";
import { Truck, Store, CreditCard, QrCode, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function Checkout() {
  const { cart, cartTotal, clearCart, addOrder } = useStore();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState<"entrega" | "retirada">("entrega");
  const [payment, setPayment] = useState<"stripe" | "asaas">("stripe");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [processing, setProcessing] = useState(false);

  const shipping = delivery === "entrega" ? (cartTotal > 250 ? 0 : 24.9) : 0;
  const total = cartTotal + shipping;

  if (cart.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl">Seu carrinho está vazio</h1>
        <Link to="/loja" className="mt-6 inline-block rounded-full gradient-deep px-6 py-3 text-sm text-deep-foreground">Ver produtos</Link>
      </main>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || (delivery === "entrega" && !address)) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      const order = addOrder({ customer: name, items: cart, total, delivery, payment, status: "pago" });
      clearCart();
      toast.success("Pagamento aprovado!", { description: `Pedido ${order.id} criado.` });
      navigate(`/pedido-confirmado?id=${order.id}`);
    }, 1400);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-serif text-4xl">Finalizar compra</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr,400px]">
        <div className="space-y-8">
          <Section title="1. Seus dados">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Nome completo *" value={name} onChange={setName} />
              <Input label="E-mail *" type="email" value={email} onChange={setEmail} />
            </div>
          </Section>

          <Section title="2. Entrega">
            <div className="grid gap-3 sm:grid-cols-2">
              <Choice
                active={delivery === "entrega"}
                onClick={() => setDelivery("entrega")}
                icon={<Truck className="h-5 w-5" />}
                title="Receber em casa"
                desc={cartTotal > 250 ? "Frete grátis" : "Frete fixo R$ 24,90"}
              />
              <Choice
                active={delivery === "retirada"}
                onClick={() => setDelivery("retirada")}
                icon={<Store className="h-5 w-5" />}
                title="Retirar na Igreja"
                desc="Sem custo de frete"
              />
            </div>
            {delivery === "entrega" ? (
              <div className="mt-4">
                <Input label="Endereço completo *" value={address} onChange={setAddress} placeholder="Rua, número, bairro, cidade, CEP" />
              </div>
            ) : (
              <div className="mt-4 rounded-lg border border-border bg-muted/40 p-4 text-sm">
                <div className="font-medium">Local de retirada</div>
                <p className="text-muted-foreground">Igreja do Senhor do Bonfim — [Endereço a definir no painel admin]</p>
                <p className="mt-1 text-muted-foreground">Horário: Seg–Sex, 9h às 17h • Sáb, 9h às 12h</p>
              </div>
            )}
          </Section>

          <Section title="3. Pagamento">
            <div className="grid gap-3 sm:grid-cols-2">
              <Choice
                active={payment === "stripe"}
                onClick={() => setPayment("stripe")}
                icon={<CreditCard className="h-5 w-5" />}
                title="Cartão (Stripe)"
                desc="Crédito em até 3x sem juros"
              />
              <Choice
                active={payment === "asaas"}
                onClick={() => setPayment("asaas")}
                icon={<QrCode className="h-5 w-5" />}
                title="PIX / Boleto (Asaas)"
                desc="Aprovação imediata via PIX"
              />
            </div>
            {payment === "stripe" ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Input label="Número do cartão" placeholder="0000 0000 0000 0000" value="" onChange={() => {}} />
                <Input label="Nome no cartão" value="" onChange={() => {}} />
                <Input label="Validade" placeholder="MM/AA" value="" onChange={() => {}} />
                <Input label="CVV" placeholder="123" value="" onChange={() => {}} />
                <p className="sm:col-span-2 text-xs text-muted-foreground">🔒 Demo — pagamentos não são processados de verdade.</p>
              </div>
            ) : (
              <div className="mt-4 rounded-lg border border-border bg-muted/40 p-4 text-sm">
                Após confirmar, geraremos seu QR Code PIX via Asaas. <span className="text-muted-foreground">(demo)</span>
              </div>
            )}
          </Section>
        </div>

        <aside className="h-fit rounded-xl border border-border bg-card p-6">
          <div className="font-serif text-xl">Resumo do pedido</div>
          <div className="mt-4 space-y-3">
            {cart.map((i) => (
              <div key={i.product.id + (i.size ?? "")} className="flex justify-between gap-2 text-sm">
                <span className="flex-1">{i.product.name} {i.size && `(${i.size})`} × {i.qty}</span>
                <span>{formatBRL(i.qty * i.product.price)}</span>
              </div>
            ))}
          </div>
          <div className="my-4 border-t border-border" />
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{formatBRL(cartTotal)}</span></div>
          <div className="mt-1 flex justify-between text-sm"><span className="text-muted-foreground">Frete</span><span>{shipping === 0 ? "Grátis" : formatBRL(shipping)}</span></div>
          <div className="my-3 border-t border-border" />
          <div className="flex justify-between text-lg font-semibold"><span>Total</span><span>{formatBRL(total)}</span></div>
          <button
            type="submit"
            disabled={processing}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full gradient-deep py-3 text-sm font-medium text-deep-foreground disabled:opacity-60"
          >
            {processing ? "Processando..." : <><CheckCircle2 className="h-4 w-4" /> Confirmar pagamento</>}
          </button>
        </aside>
      </form>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 font-serif text-xl">{title}</div>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-foreground/80">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold"
      />
    </label>
  );
}

function Choice({ active, onClick, icon, title, desc }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-3 rounded-lg border p-4 text-left transition ${
        active ? "border-gold shadow-gold bg-accent/30" : "border-border bg-background hover:border-gold/50"
      }`}
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${active ? "gradient-gold text-deep" : "bg-muted text-foreground"}`}>{icon}</div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </button>
  );
}
