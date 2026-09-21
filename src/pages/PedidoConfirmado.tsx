import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function PedidoConfirmado() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full gradient-gold text-deep">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h1 className="mt-6 font-serif text-4xl">Pedido confirmado!</h1>
      <p className="mt-3 text-muted-foreground">Obrigado pela sua compra. Que Deus abençoe!</p>

      <p className="mt-4 text-sm text-muted-foreground">Os detalhes e o acompanhamento foram enviados pela Shopify para o e-mail informado na compra.</p>

      <Link to="/loja" className="mt-8 inline-block rounded-full gradient-deep px-6 py-3 text-sm font-medium text-deep-foreground">Continuar comprando</Link>
    </main>
  );
}
