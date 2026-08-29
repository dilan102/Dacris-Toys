export type Category = {
  name: string;
  slug: string;
  description: string;
  parentSlug?: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  detail: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  stock: number;
  ageRange: string;
  tags: string[];
  featured?: boolean;
};

export const categories: Category[] = [
  {
    name: "Todos",
    slug: "todos",
    description: "Todo el catálogo disponible para elegir por edad, juego y presupuesto.",
  },
  {
    name: "Ferretería",
    slug: "ferreteria",
    description: "Herramientas, accesorios y soluciones prácticas para arreglos del día a día.",
  },
  {
    name: "Hogar",
    slug: "hogar",
    description: "Artículos útiles para ordenar, decorar y resolver necesidades de casa.",
  },
  {
    name: "Belleza",
    slug: "belleza",
    description: "Productos de cuidado personal, belleza y detalles para consentirse.",
  },
  {
    name: "Cacharrería",
    slug: "cacharreria",
    description: "Accesorios prácticos, detalles útiles y sorpresas para complementar.",
  },
  {
    name: "Juguetería",
    slug: "jugueteria",
    description: "Juguetes educativos, creativos y seguros para jugar todos los días.",
  },
  {
    name: "Didácticos",
    slug: "didacticos",
    description: "Juguetes para aprender colores, formas, memoria y coordinación.",
    parentSlug: "jugueteria",
  },
  {
    name: "Bebés",
    slug: "bebes",
    description: "Juguetes suaves, seguros y pensados para primeras exploraciones.",
    parentSlug: "jugueteria",
  },
  {
    name: "Niños",
    slug: "ninos",
    description: "Favoritos para aventuras, construcción, roles y movimiento.",
    parentSlug: "jugueteria",
  },
  {
    name: "Niñas",
    slug: "ninas",
    description: "Juegos creativos, simbólicos y llenos de imaginación.",
    parentSlug: "jugueteria",
  },
  {
    name: "Tecnología",
    slug: "tecnologia",
    description: "Juguetes tecnológicos, luces, sonidos y experiencias interactivas.",
    parentSlug: "jugueteria",
  },
];

export const mainCategories = categories.filter((category) => !category.parentSlug);

export const sectionCategories = mainCategories.filter(
  (category) => category.slug !== "todos",
);

export const toySubcategories = categories.filter(
  (category) => category.parentSlug === "jugueteria",
);

export const categoryDisplayOrder = [
  "ferreteria",
  "cacharreria",
  "belleza",
  "hogar",
  "jugueteria",
];

export const categoryCardDesign: Record<
  string,
  {
    image: string;
    width: number;
    height: number;
  }
> = {
  ferreteria: {
    image: "/category-ferreteria.png",
    width: 490,
    height: 430,
  },
  cacharreria: {
    image: "/category-cacharreria.png",
    width: 490,
    height: 430,
  },
  belleza: {
    image: "/category-belleza.png",
    width: 490,
    height: 430,
  },
  hogar: {
    image: "/category-hogar.png",
    width: 575,
    height: 410,
  },
  jugueteria: {
    image: "/category-jugueteria.png",
    width: 665,
    height: 420,
  },
};

export function sortCategoriesByDisplayOrder(items: Category[]) {
  return [...items].sort((categoryA, categoryB) => {
    const orderA = categoryDisplayOrder.indexOf(categoryA.slug);
    const orderB = categoryDisplayOrder.indexOf(categoryB.slug);

    return (
      (orderA === -1 ? categoryDisplayOrder.length : orderA) -
      (orderB === -1 ? categoryDisplayOrder.length : orderB)
    );
  });
}

export const products: Product[] = [
  {
    id: "bloques-madera",
    name: "Bloques de madera",
    description: "Para construir torres, clasificar colores y entrenar coordinación.",
    detail:
      "Set de bloques de madera con piezas de colores para estimular creatividad, coordinación y juego libre en casa. Ideal para acompañar primeras construcciones y rutinas de aprendizaje.",
    price: 19000,
    image: "/product-bloques.png",
    category: "jugueteria",
    subcategory: "didacticos",
    stock: 12,
    ageRange: "2+ años",
    tags: ["Educativo", "Madera", "Motricidad"],
    featured: true,
  },
  {
    id: "rompecabezas",
    name: "Rompecabezas",
    description: "Piezas suaves para memoria, paciencia y reconocimiento visual.",
    detail:
      "Rompecabezas educativo con piezas suaves, colores vivos y figuras pensadas para primeras edades. Ayuda a practicar concentración, asociación y resolución de problemas.",
    price: 40000,
    image: "/product-rompecabezas.png",
    category: "jugueteria",
    subcategory: "didacticos",
    stock: 8,
    ageRange: "3+ años",
    tags: ["Concentración", "Colores", "Aprendizaje"],
    featured: true,
  },
  {
    id: "cocinita",
    name: "Cocinita",
    description: "Cocina de juguete con accesorios para juego de roles.",
    detail:
      "Cocinita completa para juegos de rol, con accesorios y tamaño cómodo para espacios pequeños. Perfecta para imaginar recetas, compartir turnos y crear historias.",
    price: 100000,
    image: "/product-cocinita.png",
    category: "jugueteria",
    subcategory: "ninas",
    stock: 5,
    ageRange: "3+ años",
    tags: ["Roles", "Accesorios", "Imaginación"],
    featured: true,
  },
  {
    id: "kit-medico",
    name: "Kit médico",
    description: "Instrumentos de juguete para cuidar a los amigos.",
    detail:
      "Kit médico infantil para juego simbólico, conversación emocional y cuidado imaginativo. Incluye instrumentos pensados para explorar profesiones desde el juego.",
    price: 99999,
    image: "/product-kit-medico.png",
    category: "jugueteria",
    subcategory: "ninos",
    stock: 9,
    ageRange: "3+ años",
    tags: ["Roles", "Cuidado", "Profesiones"],
    featured: true,
  },
  {
    id: "bloques-arcoiris",
    name: "Bloques arcoiris",
    description: "Set colorido para clasificar, apilar y crear figuras.",
    detail:
      "Bloques arcoiris con formas versátiles para practicar equilibrio, colores y coordinación fina. Una opción resistente para juego libre y actividades guiadas.",
    price: 28000,
    image: "/product-bloques.png",
    category: "jugueteria",
    subcategory: "bebes",
    stock: 15,
    ageRange: "2+ años",
    tags: ["Creatividad", "Colores", "Apilar"],
  },
  {
    id: "puzzle-animales",
    name: "Puzzle animales",
    description: "Figuras de animales para asociar formas y sonidos.",
    detail:
      "Puzzle infantil con piezas inspiradas en animales, ideal para conversar, reconocer siluetas y fortalecer memoria visual durante el juego.",
    price: 36000,
    image: "/product-rompecabezas.png",
    category: "jugueteria",
    subcategory: "bebes",
    stock: 7,
    ageRange: "3+ años",
    tags: ["Animales", "Memoria", "Lenguaje"],
  },
  {
    id: "set-cocina-mini",
    name: "Set cocina mini",
    description: "Accesorios pequeños para completar juegos de cocina.",
    detail:
      "Set de accesorios mini para complementar cocinitas, restaurantes imaginarios y juegos en grupo. Liviano, fácil de guardar y listo para regalar.",
    price: 45000,
    image: "/product-cocinita.png",
    category: "jugueteria",
    subcategory: "ninas",
    stock: 11,
    ageRange: "3+ años",
    tags: ["Roles", "Regalo", "Accesorios"],
  },
  {
    id: "maletin-doctor",
    name: "Maletín doctor",
    description: "Maletín práctico para guardar instrumentos de doctor.",
    detail:
      "Maletín de doctor para llevar instrumentos, ordenar piezas y recrear consultas médicas. Favorece juego simbólico y confianza en visitas al médico.",
    price: 72000,
    image: "/product-kit-medico.png",
    category: "jugueteria",
    subcategory: "ninos",
    stock: 4,
    ageRange: "4+ años",
    tags: ["Maletín", "Orden", "Roles"],
  },
  {
    id: "taladro-manual",
    name: "Taladro manual",
    description: "Herramienta práctica para reparaciones pequeñas en casa.",
    detail:
      "Taladro manual compacto para tareas sencillas del hogar. Fácil de guardar y útil para tenerlo siempre a la mano.",
    price: 58000,
    image: "/product-kit-medico.png",
    category: "ferreteria",
    stock: 6,
    ageRange: "Hogar",
    tags: ["Herramienta", "Práctico", "Arreglos"],
    featured: true,
  },
  {
    id: "organizador-hogar",
    name: "Organizador hogar",
    description: "Caja organizadora para juguetes, accesorios o útiles.",
    detail:
      "Organizador multipropósito para mantener espacios limpios y encontrar todo más rápido. Funciona para habitaciones, baños o zonas de juego.",
    price: 32000,
    image: "/product-bloques.png",
    category: "hogar",
    stock: 13,
    ageRange: "Casa",
    tags: ["Orden", "Multiuso", "Liviano"],
    featured: true,
  },
  {
    id: "set-belleza-infantil",
    name: "Set belleza infantil",
    description: "Kit de accesorios suaves para juego y cuidado personal.",
    detail:
      "Set de belleza infantil con accesorios seguros para juego simbólico, peinados y rutinas creativas en familia.",
    price: 52000,
    image: "/product-cocinita.png",
    category: "belleza",
    stock: 10,
    ageRange: "3+ años",
    tags: ["Belleza", "Creativo", "Regalo"],
    featured: true,
  },
  {
    id: "linterna-led",
    name: "Linterna LED",
    description: "Linterna compacta para casa, paseo o emergencia.",
    detail:
      "Linterna LED liviana con buen agarre, ideal para tener en casa, llevar en salidas o sumar a un kit básico de emergencia.",
    price: 25000,
    image: "/product-rompecabezas.png",
    category: "cacharreria",
    stock: 18,
    ageRange: "Multiuso",
    tags: ["LED", "Portátil", "Útil"],
    featured: true,
  },
  {
    id: "robot-interactivo",
    name: "Robot interactivo",
    description: "Juguete con luces y sonidos para explorar tecnología.",
    detail:
      "Robot interactivo para despertar curiosidad tecnológica con luces, sonidos y juego guiado. Una opción llamativa para regalar.",
    price: 115000,
    image: "/product-kit-medico.png",
    category: "jugueteria",
    subcategory: "tecnologia",
    stock: 5,
    ageRange: "5+ años",
    tags: ["Tecnología", "Luces", "Sonidos"],
    featured: true,
  },
];

export const cartPreview = [
  { productId: "bloques-madera", quantity: 1 },
  { productId: "rompecabezas", quantity: 2 },
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
  const category = getCategory(slug);

  if (category?.parentSlug) {
    return products.filter((product) => product.subcategory === slug);
  }

  return products.filter((product) => product.category === slug);
}

export function getFeaturedProducts() {
  return products.filter((product) => product.featured);
}

export function getRelatedProducts(product: Product, limit = 3) {
  const relatedBySubcategory = product.subcategory
    ? products.filter(
        (item) => item.id !== product.id && item.subcategory === product.subcategory,
      )
    : [];
  const relatedByCategory = products.filter(
    (item) =>
      item.id !== product.id &&
      item.category === product.category &&
      item.subcategory !== product.subcategory,
  );

  return [...relatedBySubcategory, ...relatedByCategory].slice(0, limit);
}

export function getCategoryProductCount(slug: string) {
  return getProductsByCategory(slug).length;
}

export function getSubcategories(parentSlug: string) {
  return categories.filter((category) => category.parentSlug === parentSlug);
}
