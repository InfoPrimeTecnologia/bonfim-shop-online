import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/store/store";
import { ProductCard } from "@/components/ProductCard";
import hero from "@/assets/hero-products.jpg";
import { ArrowRight, Truck, Store, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Marketplace Oficial — Igreja do Senhor do Bonfim" },
      { name: "description", content: "Produtos personalizados da Igreja do Senhor do Bonfim: camisetas, canecas, relógios, acessórios e mais." },
    ],
  }),
  component: Index,
});

function Index() {
  const { products } = useStore();
  const featured = products.filter((p) => p.featured);

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-widest text-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Edição Oficial
            </div>
            <h1 className="mt-5 font-serif text-5xl leading-tight md:text-6xl">
              Devoção em cada <span className="text-gold">detalhe</span>.
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Produtos personalizados da Igreja do Senhor do Bonfim. Vista sua fé com elegância e tradição.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/loja" className="inline-flex items-center gap-2 rounded-full gradient-deep px-6 py-3 text-sm font-medium text-deep-foreground shadow-elegant transition hover:opacity-95">
                Explorar a loja <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/sobre" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium hover:border-gold">
                Nossa missão
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl gradient-gold opacity-20 blur-2xl" />
            <img src={hero} alt="Produtos personalizados" width={1600} height={1024} className="rounded-2xl object-cover shadow-elegant" />
          </div>
        </div>
      </section>

      {/* benefits */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3">
          {[
            { icon: Truck, title: "Entrega para todo o Brasil", desc: "Receba em casa com rastreamento" },
            { icon: Store, title: "Retirada na Igreja", desc: "Sem custo de frete" },
            { icon: ShieldCheck, title: "Pagamento seguro", desc: "Stripe e Asaas" },
          ].map((b, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-gold text-deep">
                <b.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium">{b.title}</div>
                <div className="text-sm text-muted-foreground">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* featured */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold">Destaques</div>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl">Mais procurados</h2>
          </div>
          <Link to="/loja" className="text-sm text-foreground/80 hover:text-foreground">Ver tudo →</Link>
        </div>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* CTA banner */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="overflow-hidden rounded-2xl gradient-deep p-10 text-deep-foreground md:p-14">
          <div className="max-w-2xl">
            <h3 className="font-serif text-3xl md:text-4xl">Cada compra apoia a obra da paróquia</h3>
            <p className="mt-3 text-deep-foreground/80">Parte da renda é destinada às ações sociais da Igreja do Senhor do Bonfim.</p>
            <Link to="/loja" className="mt-6 inline-flex items-center gap-2 rounded-full gradient-gold px-6 py-3 text-sm font-medium text-deep">
              Comprar agora <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
