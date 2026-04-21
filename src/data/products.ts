import tshirt from "@/assets/product-tshirt.jpg";
import mug from "@/assets/product-mug.jpg";
import watch from "@/assets/product-watch.jpg";
import rosary from "@/assets/product-rosary.jpg";
import hoodie from "@/assets/product-hoodie.jpg";
import bag from "@/assets/product-bag.jpg";

export type Category = "Camisetas" | "Blusas" | "Acessórios" | "Relógios" | "Canecas" | "Bolsas";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  stock: number;
  sizes?: string[];
  featured?: boolean;
};

export const initialProducts: Product[] = [
  {
    id: "p1",
    name: "Camiseta Senhor do Bonfim — Branca",
    description: "Camiseta 100% algodão com bordado dourado da cruz do Senhor do Bonfim. Conforto e devoção em cada detalhe.",
    price: 79.9,
    category: "Camisetas",
    image: tshirt,
    stock: 48,
    sizes: ["P", "M", "G", "GG"],
    featured: true,
  },
  {
    id: "p2",
    name: "Caneca Devoção — Borda Dourada",
    description: "Caneca de cerâmica branca com borda dourada e cruz personalizada. Edição da Igreja do Senhor do Bonfim.",
    price: 49.9,
    category: "Canecas",
    image: mug,
    stock: 120,
    featured: true,
  },
  {
    id: "p3",
    name: "Relógio Clássico Bonfim",
    description: "Relógio de pulso com pulseira de couro e detalhes dourados. Elegância atemporal.",
    price: 289.9,
    category: "Relógios",
    image: watch,
    stock: 20,
    featured: true,
  },
  {
    id: "p4",
    name: "Terço de Madeira Artesanal",
    description: "Terço artesanal em madeira nobre, abençoado na Igreja do Senhor do Bonfim.",
    price: 39.9,
    category: "Acessórios",
    image: rosary,
    stock: 75,
  },
  {
    id: "p5",
    name: "Moletom Azul Marinho — Cruz Dourada",
    description: "Moletom premium com capuz, bordado dourado no peito. Quente, macio e devocional.",
    price: 189.9,
    category: "Blusas",
    image: hoodie,
    stock: 32,
    sizes: ["P", "M", "G", "GG"],
    featured: true,
  },
  {
    id: "p6",
    name: "Ecobag Cruz Dourada",
    description: "Sacola de algodão cru com estampa dourada da cruz do Bonfim. Sustentável e devocional.",
    price: 34.9,
    category: "Acessórios",
    image: bag,
    stock: 200,
  },
];

export const categories: Category[] = [
  "Camisetas",
  "Blusas",
  "Acessórios",
  "Relógios",
  "Canecas",
  "Bolsas",
];

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
