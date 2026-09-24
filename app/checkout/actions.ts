"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { wompiIntegrity } from "@/lib/wompi";

export async function createOrderAction(input: { requestId: string; name: string; phone: string; email: string; city: string; department: string; address: string; note?: string; deliveryLat?: string; deliveryLng?: string; items: { productId: string; quantity: number }[] }) {
  if (!input.requestId || !input.name.trim() || !input.phone.trim() || !input.email.trim() || !input.city.trim() || !input.department.trim() || !input.address.trim() || !input.items.length) throw new Error("Completa los datos obligatorios y agrega productos al carrito.");
  if (!/^\S+@\S+\.\S+$/.test(input.email.trim())) throw new Error("Ingresa un correo electrónico válido.");
  const supabase = createSupabaseServerClient();
  if (!supabase) throw new Error("No se pudo conectar con la tienda.");
  const { data: existingOrder } = await supabase.from("orders").select("reference,total").eq("client_request_id", input.requestId).maybeSingle();
  if (existingOrder) {
    const amountInCents = Math.round(Number(existingOrder.total) * 100);
    return { reference: existingOrder.reference, amountInCents, signature: wompiIntegrity(existingOrder.reference, amountInCents) };
  }
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
  const deliveryLat = Number(input.deliveryLat);
  const deliveryLng = Number(input.deliveryLng);
  const { data: order, error } = await supabase.from("orders").insert({ reference, client_request_id: input.requestId, customer_name: input.name.trim(), customer_phone: input.phone.trim(), customer_email: input.email.trim().toLowerCase(), delivery_city: input.city.trim(), delivery_department: input.department.trim(), customer_address: input.address.trim(), delivery_lat: Number.isFinite(deliveryLat) ? deliveryLat : null, delivery_lng: Number.isFinite(deliveryLng) ? deliveryLng : null, delivery_note: input.note?.trim() || null, customer_username: customerUsername, subtotal, shipping, total }).select("id").single();
  if (error?.code === "23505") {
    const { data: concurrentOrder } = await supabase.from("orders").select("reference,total").eq("client_request_id", input.requestId).maybeSingle();
    if (concurrentOrder) {
      const amountInCents = Math.round(Number(concurrentOrder.total) * 100);
      return { reference: concurrentOrder.reference, amountInCents, signature: wompiIntegrity(concurrentOrder.reference, amountInCents) };
    }
  }
  if (error || !order) throw new Error("No se pudo crear el pedido.");
  const { error: itemError } = await supabase.from("order_items").insert(items.map((item) => ({ order_id: order.id, product_id: item.product.id, product_name: item.product.name, unit_price: item.product.price, quantity: item.quantity })));
  if (itemError) throw new Error("No se pudo guardar el pedido.");
  revalidatePath("/perfil");
  return { reference, amountInCents: Math.round(total * 100), signature: wompiIntegrity(reference, Math.round(total * 100)) };
}

export async function saveWompiTransactionAction(reference: string, transactionId: string) {
  if (!reference || !transactionId) return;
  const supabase = createSupabaseServerClient();
  if (!supabase) return;
  await supabase.from("orders").update({ wompi_transaction_id: transactionId }).eq("reference", reference).eq("status", "pending");
}
