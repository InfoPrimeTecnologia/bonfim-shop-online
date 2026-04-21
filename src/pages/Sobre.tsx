export default function Sobre() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <div className="text-xs uppercase tracking-[0.2em] text-gold">Nossa história</div>
      <h1 className="mt-2 font-serif text-5xl">Fé que veste, devoção que acompanha</h1>
      <p className="mt-6 text-lg text-muted-foreground">
        O Marketplace da Igreja do Senhor do Bonfim nasceu do desejo de levar a tradição e a devoção da nossa paróquia para o cotidiano dos fiéis. Cada peça é cuidadosamente personalizada e parte da renda apoia diretamente as obras sociais da igreja.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="font-serif text-2xl">Missão</div>
          <p className="mt-2 text-sm text-muted-foreground">Conectar fiéis ao patrimônio espiritual do Senhor do Bonfim através de produtos com qualidade, beleza e propósito.</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="font-serif text-2xl">Impacto social</div>
          <p className="mt-2 text-sm text-muted-foreground">Cada compra contribui com as ações sociais da paróquia: cestas básicas, apoio à comunidade e manutenção do santuário.</p>
        </div>
      </div>
    </main>
  );
}
