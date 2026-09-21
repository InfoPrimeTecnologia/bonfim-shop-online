import { toast } from "sonner";

export const SHOPIFY_STORE_PERMANENT_DOMAIN = "bonfim-store-hub-7pr16-naejpsbm.myshopify.com";
export const SHOPIFY_API_VERSION = "2025-07";
export const SHOPIFY_STOREFRONT_TOKEN = "4c6a2702105360604c009806f50def5e";
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

export interface ShopifyVariant {
  id: string;
  title: string;
  price: { amount: string; currencyCode: string };
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
}

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    productType: string;
    priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
    images: { edges: Array<{ node: { url: string; altText: string | null } }> };
    variants: { edges: Array<{ node: ShopifyVariant }> };
    options: Array<{ name: string; values: string[] }>;
  };
}

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("A loja Shopify precisa ser ativada para concluir compras.");
    return undefined;
  }
  if (!response.ok) throw new Error(`Shopify respondeu com status ${response.status}`);
  const data = await response.json();
  if (data.errors) throw new Error(data.errors.map((error: { message: string }) => error.message).join(", "));
  return data;
}

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges { node {
        id title description handle productType
        priceRange { minVariantPrice { amount currencyCode } }
        images(first: 5) { edges { node { url altText } } }
        variants(first: 30) { edges { node { id title price { amount currencyCode } availableForSale selectedOptions { name value } } } }
        options { name values }
      } }
    }
  }
`;

export async function fetchProducts(): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(PRODUCTS_QUERY, { first: 100 });
  return data?.data?.products?.edges ?? [];
}

export const formatMoney = (amount: string | number, currencyCode = "BRL") =>
  Number(amount).toLocaleString("pt-BR", { style: "currency", currency: currencyCode });
