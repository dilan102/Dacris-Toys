"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { wompiIntegrity } from "@/lib/wompi";

export async function createOrderAction(input: { name: string; phone: string; address: string; note?: string; items: { productId: string; quantity: number }[] }) {
  if (!input.name.trim() || !input.phone.trim() || !input.address.trim() || !input.items.length) throw new Error("Completa los datos y agrega productos al carrito.");
  const supabase = createSupabaseServerClient();
  if (!supabase) throw new Error("No se pudo conectar con la tienda.");
  const ids = [...new Set(input.items.map((item) => item.productId))];
  const { data: products } = await supabase.from("products").select("id,name,price,stock").in("id", ids);
  if (!products || products.length !== ids.length) throw new Error("Uno de los productos ya no está disponible.");
  const items = input.items.map((item) => {
    const product = products.find((row) => row.id === item.productId);
    if (!product || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > product.stock) throw new Error("Revisa la disponibilidad del carrito.");
    return { ...item, product };
  });
  const subtotal = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  const shipping = 8000;
  const total = subtotal + shipping;
  const reference = `DAC-${randomUUID().replaceAll("-", "").slice(0, 18).toUpperCase()}`;
  const session = await getSessionUser();
  const customerUsername = session?.role === "customer" ? session.username : null;
  const { data: order, error } = await supabase.from("orders").insert({ reference, customer_name: input.name.trim(), customer_phone: input.phone.trim(), customer_address: input.address.trim(), delivery_note: input.note?.trim() || null, customer_username: customerUsername, subtotal, shipping, total }).select("id").single();
  if (error || !order) throw new Error("No se pudo crear el pedido.");
  const { error: itemError } = await supabase.from("order_items").insert(items.map((item) => ({ order_id: order.id, product_id: item.product.id, product_name: item.product.name, unit_price: item.product.price, quantity: item.quantity })));
  if (itemError) throw new Error("No se pudo guardar el pedido.");
  revalidatePath("/perfil");
  return { reference, amountInCents: Math.round(total * 100), signature: wompiIntegrity(reference, Math.round(total * 100)) };
}
