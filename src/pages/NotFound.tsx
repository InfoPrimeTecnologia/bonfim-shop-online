import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl font-semibold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">A página que você procura não existe ou foi movida.</p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-md gradient-deep px-4 py-2 text-sm font-medium text-deep-foreground">
          Ir para o início
        </Link>
      </div>
    </div>
  );
}
