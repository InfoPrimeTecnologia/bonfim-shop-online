import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storefrontApiRequest, type ShopifyProduct, type ShopifyVariant } from "@/lib/shopify";

export interface CartItem {
  lineId: string | null;
  product: ShopifyProduct;
  variant: ShopifyVariant;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  addItem: (product: ShopifyProduct, variant: ShopifyVariant, quantity?: number) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
}

const CART_QUERY = `query cart($id: ID!) { cart(id: $id) { id totalQuantity } }`;
const CART_CREATE = `mutation cartCreate($input: CartInput!) { cartCreate(input: $input) { cart { id checkoutUrl lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } } } userErrors { field message } } }`;
const CART_ADD = `mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } } } userErrors { field message } } }`;
const CART_UPDATE = `mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { id } userErrors { field message } } }`;
const CART_REMOVE = `mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { id } userErrors { field message } } }`;

const checkoutUrlWithChannel = (value: string) => {
  const url = new URL(value);
  url.searchParams.set("channel", "online_store");
  return url.toString();
};

const cartMissing = (errors: Array<{ message: string }>) =>
  errors.some((error) => /cart not found|does not exist/i.test(error.message));

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [], cartId: null, checkoutUrl: null, isLoading: false, isSyncing: false,
      clearCart: () => set({ items: [], cartId: null, checkoutUrl: null }),
      addItem: async (product, variant, quantity = 1) => {
        set({ isLoading: true });
        try {
          const { cartId, items } = get();
          const existing = items.find((item) => item.variant.id === variant.id);
          if (!cartId) {
            const data = await storefrontApiRequest(CART_CREATE, { input: { lines: [{ merchandiseId: variant.id, quantity }] } });
            const result = data?.data?.cartCreate;
            if (result?.userErrors?.length || !result?.cart) throw new Error(result?.userErrors?.[0]?.message ?? "Não foi possível criar o carrinho");
            const lineId = result.cart.lines.edges[0]?.node?.id ?? null;
            set({ cartId: result.cart.id, checkoutUrl: checkoutUrlWithChannel(result.cart.checkoutUrl), items: [{ product, variant, quantity, lineId }] });
          } else if (existing?.lineId) {
            await get().updateQuantity(variant.id, existing.quantity + quantity);
          } else {
            const data = await storefrontApiRequest(CART_ADD, { cartId, lines: [{ merchandiseId: variant.id, quantity }] });
            const result = data?.data?.cartLinesAdd;
            if (cartMissing(result?.userErrors ?? [])) return get().clearCart();
            if (result?.userErrors?.length) throw new Error(result.userErrors[0].message);
            const line = result?.cart?.lines?.edges?.find((entry: { node: { merchandise: { id: string } } }) => entry.node.merchandise.id === variant.id);
            set({ items: [...get().items, { product, variant, quantity, lineId: line?.node?.id ?? null }] });
          }
        } finally { set({ isLoading: false }); }
      },
      updateQuantity: async (variantId, quantity) => {
        if (quantity <= 0) return get().removeItem(variantId);
        const { cartId, items } = get();
        const item = items.find((entry) => entry.variant.id === variantId);
        if (!cartId || !item?.lineId) return;
        set({ isLoading: true });
        try {
          const data = await storefrontApiRequest(CART_UPDATE, { cartId, lines: [{ id: item.lineId, quantity }] });
          const errors = data?.data?.cartLinesUpdate?.userErrors ?? [];
          if (cartMissing(errors)) return get().clearCart();
          if (errors.length) throw new Error(errors[0].message);
          set({ items: get().items.map((entry) => entry.variant.id === variantId ? { ...entry, quantity } : entry) });
        } finally { set({ isLoading: false }); }
      },
      removeItem: async (variantId) => {
        const { cartId, items } = get();
        const item = items.find((entry) => entry.variant.id === variantId);
        if (!cartId || !item?.lineId) return;
        set({ isLoading: true });
        try {
          const data = await storefrontApiRequest(CART_REMOVE, { cartId, lineIds: [item.lineId] });
          const errors = data?.data?.cartLinesRemove?.userErrors ?? [];
          if (cartMissing(errors)) return get().clearCart();
          if (errors.length) throw new Error(errors[0].message);
          const remaining = get().items.filter((entry) => entry.variant.id !== variantId);
          if (remaining.length === 0) get().clearCart(); else set({ items: remaining });
        } finally { set({ isLoading: false }); }
      },
      syncCart: async () => {
        const { cartId, isSyncing } = get();
        if (!cartId || isSyncing) return;
        set({ isSyncing: true });
        try {
          const data = await storefrontApiRequest(CART_QUERY, { id: cartId });
          if (data && (!data.data?.cart || data.data.cart.totalQuantity === 0)) get().clearCart();
        } finally { set({ isSyncing: false }); }
      },
    }),
    { name: "bonfim-shopify-cart", storage: createJSONStorage(() => localStorage), partialize: ({ items, cartId, checkoutUrl }) => ({ items, cartId, checkoutUrl }) },
  ),
);
