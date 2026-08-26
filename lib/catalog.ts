export type Category = {
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  detail: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  featured?: boolean;
};

export const categories: Category[] = [
  { name: "Todos", slug: "todos" },
  { name: "Juguetes", slug: "juguetes" },
  { name: "Cacharrería", slug: "cacharreria" },
  { name: "Variados", slug: "variados" },
];

export const products: Product[] = [
  {
    id: "bloques-madera",
    name: "Bloques de madera",
    description: "Para construir y aprender. Madera sostenible y color...",
    detail:
      "Set de bloques de madera para estimular creatividad, coordinación y juego libre en casa.",
    price: 19000,
    image: "/product-bloques.png",
    category: "juguetes",
    stock: 12,
    featured: true,
  },
  {
    id: "rompecabezas",
    name: "Rompecabezas",
    description: "Desarrolla la memoria y la coordinación. Piezas suav...",
    detail:
      "Rompecabezas educativo con piezas suaves, colores vivos y figuras pensadas para primeras edades.",
    price: 40000,
    image: "/product-rompecabezas.png",
    category: "juguetes",
    stock: 8,
    featured: true,
  },
  {
    id: "cocinita",
    name: "Cocinita",
    description: "Cocina de juguete con accesorios. Ideal para role...",
    detail:
      "Cocinita completa para juegos de rol, con accesorios y tamaño cómodo para espacios pequeños.",
    price: 100000,
    image: "/product-cocinita.png",
    category: "variados",
    stock: 5,
    featured: true,
  },
  {
    id: "kit-medico",
    name: "Kit médico",
    description: "Instrumentos de juguete para cuidar a los amigos.",
    detail:
      "Kit médico infantil para juego simbólico, conversación emocional y cuidado imaginativo.",
    price: 99999,
    image: "/product-kit-medico.png",
    category: "cacharreria",
    stock: 9,
    featured: true,
  },
];

export const cartPreview = [
  { productId: "bloques-madera", quantity: 1 },
  { productId: "rompecabezas", quantity: 1 },
];

export function formatPrice(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getProduct(id: string) {
  return products.find((product) => product.id === id);
}

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getProductsByCategory(slug: string) {
  if (slug === "todos") return products;
  return products.filter((product) => product.category === slug);
}
