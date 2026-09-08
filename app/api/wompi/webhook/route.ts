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
    const { error } = await supabase.rpc("confirm_paid_order", { order_reference: transaction.reference });
    if (error) return NextResponse.json({ error: "No se pudo confirmar el pedido" }, { status: 409 });
  } else if (transaction.status === "DECLINED" || transaction.status === "ERROR") {
    await supabase.from("orders").update({ status: "failed" }).eq("id", order.id).eq("status", "pending");
  }
  return NextResponse.json({ ok: true });
}
