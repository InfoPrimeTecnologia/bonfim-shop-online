import { Navigate, useLocation } from "react-router-dom";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return <div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>;
  if (!user) return <Navigate to={`/entrar?next=${encodeURIComponent(location.pathname)}`} replace />;
  if (admin && !isAdmin) {
    return <main className="mx-auto max-w-xl px-4 py-20 text-center"><ShieldAlert className="mx-auto h-10 w-10 text-gold" /><h1 className="mt-4 font-serif text-3xl">Acesso restrito</h1><p className="mt-2 text-muted-foreground">Esta área está disponível somente para administradores autorizados.</p></main>;
  }
  return children;
}