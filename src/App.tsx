import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { StoreProvider } from "@/store/store";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Toaster } from "@/components/ui/sonner";

import Index from "@/pages/Index";
import Loja from "@/pages/Loja";
import Produto from "@/pages/Produto";
import Carrinho from "@/pages/Carrinho";
import Checkout from "@/pages/Checkout";
import PedidoConfirmado from "@/pages/PedidoConfirmado";
import Sobre from "@/pages/Sobre";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProdutos from "@/pages/admin/Produtos";
import AdminPedidos from "@/pages/admin/Pedidos";
import NotFound from "@/pages/NotFound";

function Shell() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  return (
    <>
      {!isAdmin && <SiteHeader />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/loja" element={<Loja />} />
        <Route path="/produto/:id" element={<Produto />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pedido-confirmado" element={<PedidoConfirmado />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="produtos" element={<AdminProdutos />} />
          <Route path="pedidos" element={<AdminPedidos />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdmin && <SiteFooter />}
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </StoreProvider>
  );
}
