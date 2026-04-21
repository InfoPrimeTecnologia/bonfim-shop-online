import { useStore } from "@/store/store";
import { formatBRL } from "@/data/products";
import { TrendingUp, ShoppingBag, Package, DollarSign } from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";

export default function Dashboard() {
  const { orders, products } = useStore();
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const itemsSold = orders.reduce((s, o) => s + o.items.reduce((a, i) => a + i.qty, 0), 0);
  const avgTicket = orders.length ? revenue / orders.length : 0;

  const series = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    const total = orders
      .filter((o) => o.date.slice(0, 10) === key)
      .reduce((s, o) => s + o.total, 0);
    return { day: d.toLocaleDateString("pt-BR", { weekday: "short" }), total };
  });

  const byCat: Record<string, number> = {};
  orders.forEach((o) => o.items.forEach((i) => {
    byCat[i.product.category] = (byCat[i.product.category] || 0) + i.qty * i.product.price;
  }));
  const pieData = Object.entries(byCat).map(([name, value]) => ({ name, value }));
  const colors = ["oklch(0.78 0.13 85)", "oklch(0.28 0.05 260)", "oklch(0.65 0.12 200)", "oklch(0.7 0.15 50)", "oklch(0.55 0.18 30)", "oklch(0.45 0.08 260)"];

  const entrega = orders.filter((o) => o.delivery === "entrega").length;
  const retirada = orders.filter((o) => o.delivery === "retirada").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral das vendas e estoque</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Stat icon={<DollarSign className="h-4 w-4" />} label="Receita total" value={formatBRL(revenue)} />
        <Stat icon={<ShoppingBag className="h-4 w-4" />} label="Pedidos" value={String(orders.length)} />
        <Stat icon={<TrendingUp className="h-4 w-4" />} label="Ticket médio" value={formatBRL(avgTicket)} />
        <Stat icon={<Package className="h-4 w-4" />} label="Itens vendidos" value={String(itemsSold)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <div className="mb-4 font-serif text-lg">Vendas (últimos 7 dias)</div>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.78 0.13 85)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.78 0.13 85)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(0.9 0.012 80)" vertical={false} />
                <XAxis dataKey="day" stroke="oklch(0.5 0.02 260)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.02 260)" fontSize={12} />
                <Tooltip formatter={(v) => formatBRL(Number(v))} contentStyle={{ borderRadius: 8, border: "1px solid oklch(0.9 0.012 80)" }} />
                <Area type="monotone" dataKey="total" stroke="oklch(0.78 0.13 85)" fill="url(#g)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 font-serif text-lg">Por categoria</div>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {pieData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => formatBRL(Number(v))} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 font-serif text-lg">Modalidade de entrega</div>
          <div className="space-y-3">
            <Bar label="Entrega em casa" value={entrega} max={orders.length} />
            <Bar label="Retirada na Igreja" value={retirada} max={orders.length} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="font-serif text-lg">Estoque baixo</div>
            <span className="text-xs text-muted-foreground">≤ 30 unidades</span>
          </div>
          <ul className="space-y-2 text-sm">
            {products.filter((p) => p.stock <= 30).map((p) => (
              <li key={p.id} className="flex justify-between">
                <span>{p.name}</span>
                <span className="font-mono text-muted-foreground">{p.stock} un.</span>
              </li>
            ))}
            {products.filter((p) => p.stock <= 30).length === 0 && <p className="text-muted-foreground">Tudo em ordem.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <span className="flex h-7 w-7 items-center justify-center rounded-full gradient-gold text-deep">{icon}</span>
        {label}
      </div>
      <div className="mt-3 font-serif text-3xl">{value}</div>
    </div>
  );
}

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm"><span>{label}</span><span className="text-muted-foreground">{value}</span></div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full gradient-gold" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
