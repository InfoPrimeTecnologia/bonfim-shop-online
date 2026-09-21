import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useCartSync } from "@/hooks/useCartSync";

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
import Entrar from "@/pages/Entrar";
import MinhaConta from "@/pages/MinhaConta";
import RedefinirSenha from "@/pages/RedefinirSenha";

function Shell() {
  useCartSync();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = location.pathname.startsWith("/admin");
  useEffect(() => {
    if (!user) return;
    const next = localStorage.getItem("bonfim-auth-next");
    if (next?.startsWith("/") && !next.startsWith("//")) {
      localStorage.removeItem("bonfim-auth-next");
      navigate(next, { replace: true });
    }
  }, [user, navigate]);
  return (
    <>
      {!isAdmin && <SiteHeader />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/loja" element={<Loja />} />
        <Route path="/produto/:id" element={<Produto />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/pedido-confirmado" element={<PedidoConfirmado />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/entrar" element={<Entrar />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
        <Route path="/minha-conta" element={<ProtectedRoute><MinhaConta /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute admin><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="produtos" element={<AdminProdutos />} />
          <Route path="pedidos" element={<AdminPedidos />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdmin && <SiteFooter />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Shell />
        <Toaster position="top-center" />
      </AuthProvider>
    </BrowserRouter>
  );
}
