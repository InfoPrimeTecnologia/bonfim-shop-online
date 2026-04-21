import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/store/store";
import { formatBRL } from "@/data/products";
import { Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/produto/$id")({
  component: ProdutoPage,
  notFoundComponent: () => (
    <main className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="font-serif text-3xl">Produto não encontrado</h1>
      <Link to="/loja" className="mt-4 inline-block text-gold">Voltar para a loja</Link>
    </main>
  ),
});

function ProdutoPage() {
  const { id } = Route.useParams();
  const { products, addToCart } = useStore();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState<string | undefined>(product?.sizes?.[1]);

  if (!product) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl">Produto não encontrado</h1>
        <Link to="/loja" className="mt-4 inline-block text-gold">Voltar para a loja</Link>
      </main>
    );
  }

  const handleAdd = () => {
    addToCart(product, qty, size);
    toast.success("Adicionado ao carrinho", { description: product.name });
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <Link to="/loja" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar à loja
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-muted">
          <img src={product.image} alt={product.name} width={900} height={900} className="h-full w-full object-cover" />
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-gold">{product.category}</div>
          <h1 className="mt-2 font-serif text-4xl leading-tight">{product.name}</h1>
          <div className="mt-4 text-3xl font-semibold">{formatBRL(product.price)}</div>
          <div className="text-sm text-muted-foreground">ou 3x de {formatBRL(product.price / 3)} sem juros</div>

          <p className="mt-6 text-foreground/80">{product.description}</p>

          {product.sizes && (
            <div className="mt-6">
              <div className="mb-2 text-sm font-medium">Tamanho</div>
              <div className="flex gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`h-10 w-10 rounded-md border text-sm font-medium ${
                      size === s ? "gradient-deep border-transparent text-deep-foreground" : "border-border bg-card hover:border-gold"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-border bg-card">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2"><Minus className="h-4 w-4" /></button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="p-2"><Plus className="h-4 w-4" /></button>
            </div>
            <span className="text-sm text-muted-foreground">{product.stock} em estoque</span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={handleAdd} className="inline-flex items-center gap-2 rounded-full gradient-deep px-6 py-3 text-sm font-medium text-deep-foreground shadow-elegant">
              <ShoppingBag className="h-4 w-4" /> Adicionar ao carrinho
            </button>
            <button
              onClick={() => { handleAdd(); navigate({ to: "/checkout" }); }}
              className="inline-flex items-center gap-2 rounded-full gradient-gold px-6 py-3 text-sm font-medium text-deep"
            >
              Comprar agora
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
