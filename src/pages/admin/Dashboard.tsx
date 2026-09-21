import { ExternalLink, Package, ShoppingBag, Store } from "lucide-react";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";

export default function Dashboard() {
  const { products, loading } = useShopifyProducts();
  const available = products.reduce((sum, product) => sum + product.node.variants.edges.filter(({ node }) => node.availableForSale).length, 0);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral da loja Shopify</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Stat icon={<Package className="h-4 w-4" />} label="Produtos" value={loading ? "—" : String(products.length)} />
        <Stat icon={<ShoppingBag className="h-4 w-4" />} label="Opções disponíveis" value={loading ? "—" : String(available)} />
        <Stat icon={<Store className="h-4 w-4" />} label="Plataforma" value="Shopify" />
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-serif text-xl">Gestão da loja</h2>
        <p className="mt-2 text-sm text-muted-foreground">Produtos, estoque, pedidos, entrega e relatórios são administrados na Shopify. Reivindique a loja para acessar o painel completo.</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm text-gold"><ExternalLink className="h-4 w-4" /> Painel disponível após reivindicar a loja</span>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-xl border border-border bg-card p-5"><div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground"><span className="flex h-7 w-7 items-center justify-center rounded-full gradient-gold text-deep">{icon}</span>{label}</div><div className="mt-3 font-serif text-3xl">{value}</div></div>;
}