import { useState } from "react";
import { useStore } from "@/store/store";
import { categories, formatBRL, type Category, type Product } from "@/data/products";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { toast } from "sonner";

const blank: Omit<Product, "id"> = {
  name: "", description: "", price: 0, category: "Camisetas", image: "", stock: 0, sizes: [],
};

export default function AdminProdutos() {
  const { products, addProduct, updateProduct, removeProduct } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(blank);

  const openNew = () => { setEditing(null); setForm(blank); setOpen(true); };
  const openEdit = (p: Product) => { setEditing(p); const { id: _id, ...rest } = p; setForm(rest); setOpen(true); };

  const save = () => {
    if (!form.name || form.price <= 0) { toast.error("Preencha nome e preço"); return; }
    if (editing) { updateProduct(editing.id, form); toast.success("Produto atualizado"); }
    else { addProduct({ ...form, image: form.image || "https://placehold.co/600x600?text=Sem+Foto" }); toast.success("Produto criado"); }
    setOpen(false);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">Produtos</h1>
          <p className="text-sm text-muted-foreground">{products.length} produtos cadastrados</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 rounded-full gradient-deep px-4 py-2 text-sm font-medium text-deep-foreground">
          <Plus className="h-4 w-4" /> Novo produto
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-4">Produto</th>
              <th className="p-4">Categoria</th>
              <th className="p-4">Preço</th>
              <th className="p-4">Estoque</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt="" width={44} height={44} className="h-11 w-11 rounded-md object-cover" />
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="p-4">{p.category}</td>
                <td className="p-4">{formatBRL(p.price)}</td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4 text-right">
                  <button onClick={() => openEdit(p)} className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:border-gold"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => { removeProduct(p.id); toast.success("Removido"); }} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-destructive hover:border-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-lg rounded-xl bg-card p-6 shadow-elegant" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <div className="font-serif text-2xl">{editing ? "Editar produto" : "Novo produto"}</div>
              <button onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3">
              <Field label="Nome" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field label="Descrição" value={form.description} onChange={(v) => setForm({ ...form, description: v })} textarea />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Preço (R$)" type="number" value={String(form.price)} onChange={(v) => setForm({ ...form, price: Number(v) })} />
                <Field label="Estoque" type="number" value={String(form.stock)} onChange={(v) => setForm({ ...form, stock: Number(v) })} />
              </div>
              <label className="block text-sm">
                <span className="mb-1 block text-foreground/80">Categoria</span>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2"
                >
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
              <Field label="URL da imagem" value={form.image} onChange={(v) => setForm({ ...form, image: v })} placeholder="https://..." />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="rounded-full border border-border px-4 py-2 text-sm">Cancelar</button>
              <button onClick={save} className="rounded-full gradient-deep px-4 py-2 text-sm font-medium text-deep-foreground">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", textarea, placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; textarea?: boolean; placeholder?: string }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-foreground/80">{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold" />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold" />
      )}
    </label>
  );
}
