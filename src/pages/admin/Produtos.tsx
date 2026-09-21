import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { formatMoney } from "@/lib/shopify";

export default function AdminProdutos() {
  const { products, loading, error } = useShopifyProducts();
  return (
    <div>
      <div className="mb-6"><h1 className="font-serif text-3xl">Produtos</h1><p className="text-sm text-muted-foreground">Catálogo sincronizado com a Shopify</p></div>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {loading ? <p className="p-8 text-center text-muted-foreground">Carregando produtos...</p> : error ? <p className="p-8 text-center text-destructive">{error}</p> : products.length === 0 ? <p className="p-8 text-center text-muted-foreground">Nenhum produto cadastrado.</p> : (
          <table className="w-full text-sm"><thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="p-4">Produto</th><th className="p-4">Categoria</th><th className="p-4">Preço</th><th className="p-4">Situação</th></tr></thead><tbody>
            {products.map(({ node }) => { const image = node.images.edges[0]?.node; const available = node.variants.edges.some(({ node: variant }) => variant.availableForSale); return <tr key={node.id} className="border-t border-border"><td className="p-4"><div className="flex items-center gap-3">{image ? <img src={image.url} alt="" className="h-11 w-11 rounded-md object-cover" /> : <div className="h-11 w-11 rounded-md bg-muted" />}<span className="font-medium">{node.title}</span></div></td><td className="p-4">{node.productType || "—"}</td><td className="p-4">{formatMoney(node.priceRange.minVariantPrice.amount, node.priceRange.minVariantPrice.currencyCode)}</td><td className="p-4">{available ? "Disponível" : "Indisponível"}</td></tr>; })}
          </tbody></table>
        )}
      </div>
    </div>
  );
}