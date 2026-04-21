import { Link, NavLink } from "react-router-dom";
import { ShoppingBag, LayoutDashboard } from "lucide-react";
import { useStore } from "@/store/store";

export function SiteHeader() {
  const { cartCount } = useStore();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full gradient-gold text-deep font-serif text-lg font-bold shadow-gold">
            ✠
          </span>
          <div className="leading-tight">
            <div className="font-serif text-lg font-semibold">Senhor do Bonfim</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Marketplace Oficial</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm md:flex">
          <NavItem to="/" end>Início</NavItem>
          <NavItem to="/loja">Loja</NavItem>
          <NavItem to="/sobre">Sobre</NavItem>
          <NavItem to="/admin"><LayoutDashboard className="h-4 w-4" /> Admin</NavItem>
        </nav>

        <Link
          to="/carrinho"
          className="relative inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm transition hover:border-gold hover:shadow-gold"
        >
          <ShoppingBag className="h-4 w-4" />
          <span className="hidden sm:inline">Carrinho</span>
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full gradient-gold px-1.5 text-[10px] font-bold text-deep">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}

function NavItem({ to, end, children }: { to: string; end?: boolean; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `inline-flex items-center gap-1.5 ${isActive ? "text-foreground font-medium" : "text-foreground/80 hover:text-foreground"}`
      }
    >
      {children}
    </NavLink>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="font-serif text-xl font-semibold">Igreja do Senhor do Bonfim</div>
          <p className="mt-2 text-sm text-muted-foreground">Produtos personalizados com fé e tradição. Cada compra apoia a obra da paróquia.</p>
        </div>
        <div className="text-sm">
          <div className="mb-2 font-semibold">Atendimento</div>
          <p className="text-muted-foreground">Seg–Sex, 9h às 17h</p>
          <p className="text-muted-foreground">contato@bonfim.com.br</p>
        </div>
        <div className="text-sm">
          <div className="mb-2 font-semibold">Retirada no local</div>
          <p className="text-muted-foreground">Igreja do Senhor do Bonfim</p>
          <p className="text-muted-foreground">[Endereço a definir no painel admin]</p>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Igreja do Senhor do Bonfim — Todos os direitos reservados
      </div>
    </footer>
  );
}
