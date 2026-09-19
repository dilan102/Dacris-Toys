"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function toggleFavoriteAction(productId: string) {
  const session = await getSessionUser();

  if (session?.role !== "customer") {
    redirect("/acceso");
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) throw new Error("No se pudo conectar con la tienda.");

  const { data: favorite, error: readError } = await supabase
    .from("favorites")
    .select("product_id")
    .eq("user_username", session.username)
    .eq("product_id", productId)
    .maybeSingle();

  if (readError) throw new Error(readError.message);

  if (favorite) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_username", session.username)
      .eq("product_id", productId);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("favorites")
      .insert({ user_username: session.username, product_id: productId });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/perfil");
  revalidatePath(`/producto/${productId}`);

  return { favorite: !favorite };
}
