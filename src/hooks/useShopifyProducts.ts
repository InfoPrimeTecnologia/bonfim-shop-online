import { useEffect, useState } from "react";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";

export function useShopifyProducts() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => setError("Não foi possível carregar os produtos.")) .finally(() => setLoading(false));
  }, []);
  return { products, loading, error };
}
