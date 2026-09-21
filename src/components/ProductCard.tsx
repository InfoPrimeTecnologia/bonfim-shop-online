import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { formatMoney, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/store/shopifyCart";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);
  const item = product.node;
  const variant = item.variants.edges.find(({ node }) => node.availableForSale)?.node;
  const image = item.images.edges[0]?.node;

  const add = async () => {
    if (!variant) return;
    try {
      await addItem(product, variant);
      toast.success("Adicionado ao carrinho", { description: item.title });
    } catch { toast.error("Não foi possível adicionar o produto."); }
  };
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition hover:-translate-y-0.5 hover:border-gold hover:shadow-elegant">
      <Link to={`/produto/${item.handle}`} className="aspect-square overflow-hidden bg-muted">
        {image ? <img src={image.url} alt={image.altText ?? item.title} loading="lazy" width={900} height={900} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Sem imagem</div>}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {item.productType && <div className="text-[11px] uppercase tracking-wider text-gold">{item.productType}</div>}
        <Link to={`/produto/${item.handle}`} className="font-serif text-lg leading-tight">{item.title}</Link>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <div className="text-lg font-semibold">{formatMoney(item.priceRange.minVariantPrice.amount, item.priceRange.minVariantPrice.currencyCode)}</div>
          <button type="button" onClick={add} disabled={!variant || isLoading} aria-label={`Adicionar ${item.title} ao carrinho`} className="flex h-9 w-9 items-center justify-center rounded-full gradient-deep text-deep-foreground disabled:opacity-40"><ShoppingBag className="h-4 w-4" /></button>
        </div>
      </div>
    </article>
  );
}
