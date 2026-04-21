import { useState } from "react";
import { useStore } from "@/store/store";
import { ProductCard } from "@/components/ProductCard";
import { categories } from "@/data/products";

export default function Loja() {
  const { products } = useStore();
  const [cat, setCat] = useState<string>("Todos");
  const [q, setQ] = useState("");

  const filtered = products.filter(
    (p) => (cat === "Todos" || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-[0.2em] text-gold">Catálogo</div>
        <h1 className="mt-2 font-serif text-4xl">Nossa loja</h1>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {["Todos", ...categories].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                cat === c ? "gradient-deep border-transparent text-deep-foreground" : "border-border bg-card hover:border-gold"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar produtos..."
          className="w-full rounded-full border border-border bg-card px-4 py-2 text-sm outline-none focus:border-gold md:w-64"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </main>
  );
}
