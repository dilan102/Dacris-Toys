import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { products as fallbackProducts, type Product } from "@/lib/catalog";

type ProductRow = {
  id: string;
  name: string;
  description: string;
  detail: string;
  price: number;
  image: string;
  video_url?: string | null;
  videoUrl?: string | null;
  category: string;
  subcategory?: string | null;
  stock: number;
  age_range?: string | null;
  ageRange?: string | null;
  tags?: string[] | string | null;
  featured?: boolean | null;
};

export type ProductInput = Omit<Product, "subcategory" | "featured"> & {
  subcategory?: string;
  featured?: boolean;
};

function parseTags(tags: ProductRow["tags"]) {
  if (Array.isArray(tags)) return tags;
  if (typeof tags !== "string") return [];

  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    detail: row.detail,
    price: Number(row.price),
    image: row.image,
    videoUrl: row.video_url ?? row.videoUrl ?? undefined,
    category: row.category,
    subcategory: row.subcategory ?? undefined,
    stock: Number(row.stock),
    ageRange: row.age_range ?? row.ageRange ?? "",
    tags: parseTags(row.tags),
    featured: Boolean(row.featured),
  };
}

function toProductRow(product: ProductInput): ProductRow {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    detail: product.detail,
    price: product.price,
    image: product.image,
    video_url: product.videoUrl || null,
    category: product.category,
    subcategory: product.subcategory || null,
    stock: product.stock,
    age_range: product.ageRange,
    tags: product.tags,
    featured: product.featured ?? false,
  };
}

export const getProducts = cache(async function getProducts() {
  const supabase = createSupabaseServerClient();

  if (!supabase) return fallbackProducts;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("No se pudieron leer productos de Supabase:", error.message);
    return fallbackProducts;
  }

  return (data ?? []).map((item) => mapProduct(item as ProductRow));
});

export async function getProductById(id: string) {
  const supabase = createSupabaseServerClient();

  if (!supabase) return fallbackProducts.find((product) => product.id === id);

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("No se pudo leer el producto de Supabase:", error.message);
    return fallbackProducts.find((product) => product.id === id);
  }

  return data ? mapProduct(data as ProductRow) : undefined;
}

export async function saveProduct(product: ProductInput) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Faltan variables de Supabase para guardar productos.");
  }

  const { error } = await supabase
    .from("products")
    .upsert(toProductRow(product), { onConflict: "id" });

  if (error) throw new Error(error.message);
}

export async function deleteProduct(id: string) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Faltan variables de Supabase para borrar productos.");
  }

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw new Error(error.message);
}

export async function uploadProductMedia(file: File, productId: string, kind: "image" | "video") {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Faltan variables de Supabase para subir archivos.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || (kind === "image" ? "jpg" : "mp4");
  const path = `${productId}/${kind}-${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from("product-media")
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type || undefined,
      upsert: true,
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("product-media").getPublicUrl(path);
  return data.publicUrl;
}

export async function getProductsByCategoryFromDb(slug: string) {
  const allProducts = await getProducts();

  if (slug === "todos") return allProducts;

  return allProducts.filter((product) => {
    if (product.subcategory === slug) return true;
    return product.category === slug && !product.subcategory;
  });
}

export async function getFeaturedProductsFromDb() {
  const allProducts = await getProducts();
  return allProducts.filter((product) => product.featured);
}

export async function getCategoryProductCountFromDb(slug: string) {
  return (await getProductsByCategoryFromDb(slug)).length;
}

export async function getCategoryProductCountsFromDb(slugs: string[]) {
  const allProducts = await getProducts();

  return new Map(
    slugs.map((slug) => [
      slug,
      allProducts.filter((product) => {
        if (slug === "todos") return true;
        if (product.subcategory === slug) return true;
        return product.category === slug && !product.subcategory;
      }).length,
    ] as const),
  );
}

export async function getRelatedProductsFromDb(product: Product, limit = 3) {
  const allProducts = await getProducts();
  const relatedBySubcategory = product.subcategory
    ? allProducts.filter(
        (item) => item.id !== product.id && item.subcategory === product.subcategory,
      )
    : [];
  const relatedByCategory = allProducts.filter(
    (item) =>
      item.id !== product.id &&
      item.category === product.category &&
      item.subcategory !== product.subcategory,
  );

  return [...relatedBySubcategory, ...relatedByCategory].slice(0, limit);
}
