import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Package, ShoppingCart, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Painel Admin — Senhor do Bonfim" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-border bg-card p-5 md:flex">
        <Link to="/" className="mb-8 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full gradient-gold text-deep font-serif text-lg font-bold">✠</span>
          <div>
            <div className="font-serif text-base font-semibold leading-none">Bonfim</div>
            <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">Admin</div>
          </div>
        </Link>

        <nav className="space-y-1 text-sm">
          <NavItem to="/admin" icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" exact />
          <NavItem to="/admin/produtos" icon={<Package className="h-4 w-4" />} label="Produtos" />
          <NavItem to="/admin/pedidos" icon={<ShoppingCart className="h-4 w-4" />} label="Pedidos" />
        </nav>

        <Link to="/" className="mt-auto inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar à loja
        </Link>
      </aside>

      <main className="md:ml-60">
        <div className="border-b border-border bg-card px-6 py-4 md:hidden">
          <div className="flex gap-3 overflow-x-auto text-sm">
            <Link to="/admin" className="whitespace-nowrap">Dashboard</Link>
            <Link to="/admin/produtos" className="whitespace-nowrap">Produtos</Link>
            <Link to="/admin/pedidos" className="whitespace-nowrap">Pedidos</Link>
            <Link to="/" className="ml-auto whitespace-nowrap text-muted-foreground">← Loja</Link>
          </div>
        </div>
        <div className="p-6 md:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function NavItem({ to, icon, label, exact }: { to: string; icon: React.ReactNode; label: string; exact?: boolean }) {
  return (
    <Link
      to={to as any}
      activeOptions={{ exact }}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-foreground/80 hover:bg-muted hover:text-foreground"
      activeProps={{ className: "bg-muted text-foreground font-medium" }}
    >
      {icon} {label}
    </Link>
  );
}
