import { Link } from "react-router-dom";
import { formatBRL, type Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/produto/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition hover:-translate-y-0.5 hover:border-gold hover:shadow-elegant"
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={900}
          height={900}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="text-[11px] uppercase tracking-wider text-gold">{product.category}</div>
        <div className="font-serif text-lg leading-tight">{product.name}</div>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="text-lg font-semibold">{formatBRL(product.price)}</div>
          <div className="text-xs text-muted-foreground">ou 3x sem juros</div>
        </div>
      </div>
    </Link>
  );
}
