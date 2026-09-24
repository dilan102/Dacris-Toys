import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type WompiTransaction = {
  id?: string;
  reference?: string;
  status?: string;
};

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  const received = request.headers.get("authorization");
  const expected = secret ? `Bearer ${secret}` : "";
  return Boolean(secret && received && received.length === expected.length && timingSafeEqual(Buffer.from(received), Buffer.from(expected)));
}

async function getWompiTransaction(transactionId: string) {
  const privateKey = process.env.WOMPI_PRIVATE_KEY;
  if (!privateKey) throw new Error("Falta WOMPI_PRIVATE_KEY.");
  const response = await fetch(`https://production.wompi.co/v1/transactions/${encodeURIComponent(transactionId)}`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${privateKey}` },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Wompi respondió ${response.status}.`);
  const payload = await response.json() as { data?: WompiTransaction };
  return payload.data;
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const supabase = createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Servidor sin base de datos" }, { status: 500 });

  const now = Date.now();
  const pendingBefore = new Date(now - 30 * 60 * 1000).toISOString();
  const expiresBefore = new Date(now - 6 * 60 * 60 * 1000).toISOString();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("id,reference,wompi_transaction_id,created_at")
    .eq("status", "pending")
    .lt("created_at", pendingBefore)
    .order("created_at", { ascending: true })
    .limit(100);
  if (error) return NextResponse.json({ error: "No se pudieron leer pedidos pendientes" }, { status: 500 });

  let paid = 0;
  let failed = 0;
  let expired = 0;
  let deferred = 0;
  for (const order of orders ?? []) {
    if (!order.wompi_transaction_id) {
      if (new Date(order.created_at).getTime() < new Date(expiresBefore).getTime()) {
        const { error: updateError } = await supabase.from("orders").update({ status: "expired" }).eq("id", order.id).eq("status", "pending");
        if (!updateError) expired += 1;
      } else {
        deferred += 1;
      }
      continue;
    }

    try {
      const transaction = await getWompiTransaction(order.wompi_transaction_id);
      // The callback-provided ID is untrusted; never alter an order unless Wompi
      // confirms that the remote transaction belongs to this exact reference.
      if (!transaction || transaction.reference !== order.reference) {
        deferred += 1;
        continue;
      }
      if (transaction.status === "APPROVED") {
        const { error: confirmError } = await supabase.rpc("confirm_paid_order", { order_reference: order.reference });
        if (!confirmError) paid += 1;
      } else if (["DECLINED", "ERROR", "VOIDED"].includes(transaction.status ?? "")) {
        const { error: updateError } = await supabase.from("orders").update({ status: "failed" }).eq("id", order.id).eq("status", "pending");
        if (!updateError) failed += 1;
      } else {
        deferred += 1;
      }
    } catch (error) {
      console.error(`No se pudo reconciliar ${order.reference}:`, error);
      deferred += 1;
    }
  }
  return NextResponse.json({ ok: true, checked: orders?.length ?? 0, paid, failed, expired, deferred });
}
