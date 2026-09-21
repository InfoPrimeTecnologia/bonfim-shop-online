import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { formatMoney } from "@/lib/shopify";
import { useCartStore } from "@/store/shopifyCart";
import { Minus, Plus, ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Produto() {
  const { id } = useParams<{ id: string }>();
  const { products, loading } = useShopifyProducts();
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);
  const navigate = useNavigate();
  const product = products.find((p) => p.node.handle === id);
  const [qty, setQty] = useState(1);
  const [variantId, setVariantId] = useState<string | undefined>();

  if (loading) return <main className="mx-auto max-w-3xl px-4 py-20 text-center text-muted-foreground">Carregando produto...</main>;

  if (!product) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl">Produto não encontrado</h1>
        <Link to="/loja" className="mt-4 inline-block text-gold">Voltar para a loja</Link>
      </main>
    );
  }

  const item = product.node;
  const variants = item.variants.edges.map(({ node }) => node);
  const selectedVariant = variants.find((variant) => variant.id === variantId) ?? variants.find((variant) => variant.availableForSale);
  const image = item.images.edges[0]?.node;

  const handleAdd = async () => {
    if (!selectedVariant) return;
    try {
      await addItem(product, selectedVariant, qty);
      toast.success("Adicionado ao carrinho", { description: item.title });
    } catch { toast.error("Não foi possível adicionar o produto."); }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <Link to="/loja" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar à loja
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-muted">
          {image ? <img src={image.url} alt={image.altText ?? item.title} width={900} height={900} className="h-full w-full object-cover" /> : <div className="flex aspect-square items-center justify-center text-muted-foreground">Sem imagem</div>}
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-gold">{item.productType}</div>
          <h1 className="mt-2 font-serif text-4xl leading-tight">{item.title}</h1>
          <div className="mt-4 text-3xl font-semibold">{formatMoney(selectedVariant?.price.amount ?? item.priceRange.minVariantPrice.amount, selectedVariant?.price.currencyCode ?? item.priceRange.minVariantPrice.currencyCode)}</div>

          <p className="mt-6 text-foreground/80">{item.description}</p>

          {variants.length > 1 && (
            <div className="mt-6">
              <div className="mb-2 text-sm font-medium">Opção</div>
              <div className="flex gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setVariantId(variant.id)}
                    disabled={!variant.availableForSale}
                    className={`min-h-10 rounded-md border px-3 text-sm font-medium disabled:opacity-40 ${
                      selectedVariant?.id === variant.id ? "gradient-deep border-transparent text-deep-foreground" : "border-border bg-card hover:border-gold"
                    }`}
                  >
                    {variant.title}
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
            <span className="text-sm text-muted-foreground">{selectedVariant?.availableForSale ? "Disponível" : "Indisponível"}</span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={handleAdd} disabled={!selectedVariant || isLoading} className="inline-flex items-center gap-2 rounded-full gradient-deep px-6 py-3 text-sm font-medium text-deep-foreground shadow-elegant disabled:opacity-50">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingBag className="h-4 w-4" />} Adicionar ao carrinho
            </button>
            <button
              onClick={async () => { await handleAdd(); navigate("/carrinho"); }}
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
