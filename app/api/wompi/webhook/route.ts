import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifyWompiEvent } from "@/lib/wompi";

export async function POST(request: Request) {
  const payload = await request.json() as Record<string, unknown>;
  if (!verifyWompiEvent(payload, request.headers.get("x-event-checksum"))) return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  const transaction = (payload.data as { transaction?: { reference?: string; status?: string } })?.transaction;
  if (!transaction?.reference || !transaction.status) return NextResponse.json({ ok: true });
  const supabase = createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Servidor sin base de datos" }, { status: 500 });
  const { data: order } = await supabase.from("orders").select("id,status").eq("reference", transaction.reference).maybeSingle();
  if (!order || order.status !== "pending") return NextResponse.json({ ok: true });
  if (transaction.status === "APPROVED") {
    const { data: items } = await supabase.from("order_items").select("product_id,quantity").eq("order_id", order.id);
    for (const item of items ?? []) {
      const { data: product } = await supabase.from("products").select("stock").eq("id", item.product_id).maybeSingle();
      if (!product || product.stock < item.quantity) return NextResponse.json({ error: "Stock agotado" }, { status: 409 });
      await supabase.from("products").update({ stock: product.stock - item.quantity }).eq("id", item.product_id);
    }
    await supabase.from("orders").update({ status: "paid" }).eq("id", order.id).eq("status", "pending");
  } else if (transaction.status === "DECLINED" || transaction.status === "ERROR") {
    await supabase.from("orders").update({ status: "failed" }).eq("id", order.id).eq("status", "pending");
  }
  return NextResponse.json({ ok: true });
}
