import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { initialProducts, type Product } from "@/data/products";

export type CartItem = { product: Product; qty: number; size?: string };
export type Order = {
  id: string;
  date: string;
  customer: string;
  items: CartItem[];
  total: number;
  delivery: "entrega" | "retirada";
  payment: "stripe" | "asaas";
  status: "pago" | "pendente" | "enviado";
};

type Ctx = {
  products: Product[];
  setProducts: (p: Product[]) => void;
  addProduct: (p: Omit<Product, "id">) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  removeProduct: (id: string) => void;

  cart: CartItem[];
  addToCart: (p: Product, qty?: number, size?: string) => void;
  updateQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;

  orders: Order[];
  addOrder: (o: Omit<Order, "id" | "date">) => Order;
};

const StoreCtx = createContext<Ctx | null>(null);

const seedOrders = (): Order[] => {
  const today = new Date();
  const mk = (d: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - d).toISOString();
  return [
    { id: "o1001", date: mk(0), customer: "Maria Silva", items: [{ product: initialProducts[0], qty: 2, size: "M" }], total: 159.8, delivery: "entrega", payment: "stripe", status: "pago" },
    { id: "o1002", date: mk(1), customer: "João Pereira", items: [{ product: initialProducts[1], qty: 3 }], total: 149.7, delivery: "retirada", payment: "asaas", status: "pago" },
    { id: "o1003", date: mk(2), customer: "Ana Souza", items: [{ product: initialProducts[2], qty: 1 }], total: 289.9, delivery: "entrega", payment: "stripe", status: "enviado" },
    { id: "o1004", date: mk(3), customer: "Carlos Lima", items: [{ product: initialProducts[4], qty: 1, size: "G" }], total: 189.9, delivery: "retirada", payment: "asaas", status: "pendente" },
    { id: "o1005", date: mk(4), customer: "Beatriz Rocha", items: [{ product: initialProducts[3], qty: 2 }], total: 79.8, delivery: "entrega", payment: "stripe", status: "pago" },
    { id: "o1006", date: mk(5), customer: "Pedro Alves", items: [{ product: initialProducts[5], qty: 4 }], total: 139.6, delivery: "retirada", payment: "asaas", status: "pago" },
    { id: "o1007", date: mk(6), customer: "Lucas Mendes", items: [{ product: initialProducts[0], qty: 1, size: "P" }], total: 79.9, delivery: "entrega", payment: "stripe", status: "pago" },
  ];
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(seedOrders);

  // hydrate cart
  useEffect(() => {
    try {
      const raw = localStorage.getItem("bonfim_cart");
      if (raw) setCart(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("bonfim_cart", JSON.stringify(cart)); } catch {}
  }, [cart]);

  const addProduct: Ctx["addProduct"] = (p) =>
    setProducts((prev) => [...prev, { ...p, id: `p${Date.now()}` }]);
  const updateProduct: Ctx["updateProduct"] = (id, p) =>
    setProducts((prev) => prev.map((x) => (x.id === id ? { ...x, ...p } : x)));
  const removeProduct: Ctx["removeProduct"] = (id) =>
    setProducts((prev) => prev.filter((x) => x.id !== id));

  const addToCart: Ctx["addToCart"] = (p, qty = 1, size) =>
    setCart((prev) => {
      const found = prev.find((i) => i.product.id === p.id && i.size === size);
      if (found) return prev.map((i) => (i === found ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { product: p, qty, size }];
    });

  const updateQty: Ctx["updateQty"] = (id, qty) =>
    setCart((prev) => prev.map((i) => (i.product.id === id ? { ...i, qty: Math.max(1, qty) } : i)));

  const removeFromCart: Ctx["removeFromCart"] = (id) =>
    setCart((prev) => prev.filter((i) => i.product.id !== id));

  const clearCart = () => setCart([]);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((s, i) => s + i.qty * i.product.price, 0), [cart]);

  const addOrder: Ctx["addOrder"] = (o) => {
    const order: Order = { ...o, id: `o${Date.now()}`, date: new Date().toISOString() };
    setOrders((prev) => [order, ...prev]);
    return order;
  };

  return (
    <StoreCtx.Provider
      value={{
        products, setProducts, addProduct, updateProduct, removeProduct,
        cart, addToCart, updateQty, removeFromCart, clearCart, cartCount, cartTotal,
        orders, addOrder,
      }}
    >
      {children}
    </StoreCtx.Provider>
  );
}

export const useStore = () => {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
};
