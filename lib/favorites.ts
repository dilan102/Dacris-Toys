import { getSessionUser } from "@/lib/auth";
import type { Product } from "@/lib/catalog";
import { getProducts } from "@/lib/catalog-db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getFavoriteProductIds() {
  const session = await getSessionUser();

  if (session?.role !== "customer") return [];

  const supabase = createSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("favorites")
    .select("product_id")
    .eq("user_username", session.username);

  if (error) {
    console.error("No se pudieron leer los favoritos:", error.message);
    return [];
  }

  return (data ?? []).map((favorite) => favorite.product_id as string);
}

export async function getFavoriteProducts(): Promise<Product[]> {
  const favoriteIds = await getFavoriteProductIds();
  if (favoriteIds.length === 0) return [];

  const productsById = new Map((await getProducts()).map((product) => [product.id, product]));
  return favoriteIds.flatMap((id) => {
    const product = productsById.get(id);
    return product ? [product] : [];
  });
}
