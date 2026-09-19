import Link from "next/link";
import { AppHeader } from "@/components/ui/app-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { formatPrice } from "@/lib/catalog";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const orderStatuses = ["pending", "paid", "failed"] as const;
type OrderStatus = (typeof orderStatuses)[number] | "cancelled";

type OrderRow = {
  id: string;
  reference: string;
  customer_name: string;
  status: OrderStatus;
  total: number | string;
};

const labels: Record<OrderStatus, string> = {
  paid: "Pagado",
  pending: "Pendiente",
  failed: "Fallido",
  cancelled: "Cancelado",
};

const filters: { label: string; status?: (typeof orderStatuses)[number] }[] = [
  { label: "Todos" },
  { label: "Pendientes", status: "pending" },
  { label: "Pagados", status: "paid" },
  { label: "Fallidos", status: "failed" },
];

type AdminOrdersPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const { status: statusParam } = await searchParams;
  const status = orderStatuses.find((candidate) => candidate === statusParam);
  const supabase = createSupabaseServerClient();
  let orders: OrderRow[] = [];

  if (supabase) {
    let query = supabase
      .from("orders")
      .select("id,reference,customer_name,status,total")
      .order("created_at", { ascending: false });

    if (status) query = query.eq("status", status);

    const { data, error } = await query;

    if (error) {
      console.error("No se pudieron leer los pedidos de Supabase:", error.message);
    } else {
      orders = (data ?? []) as OrderRow[];
    }
  }

  return (
    <main className="site-shell inner-page admin-page">
      <AppHeader title="Pedidos" backHref="/admin" />
      <section className="content-wrap">
        <div className="page-intro">
          <h1>Pedidos</h1>
          <p>Consulta los pedidos y sus estados actualizados por Wompi.</p>
        </div>
        <div className="chips order-filters" aria-label="Filtrar pedidos">
          {filters.map((filter) => (
            <Link
              className={`chip ${status === filter.status ? "active" : ""}`}
              href={filter.status ? `/admin/pedidos?status=${filter.status}` : "/admin/pedidos"}
              key={filter.label}
            >
              {filter.label}
            </Link>
          ))}
        </div>
        <div className="admin-table">
          {orders.map((order) => (
            <article className="order-row" key={order.id}>
              <div>
                <h2>{order.reference}</h2>
                <p>{order.customer_name}</p>
              </div>
              <span className={`status-pill ${order.status}`}>{labels[order.status]}</span>
              <strong>{formatPrice(Number(order.total))}</strong>
            </article>
          ))}
          {orders.length === 0 ? <div className="empty-media">No hay pedidos para mostrar.</div> : null}
        </div>
      </section>
      <BottomNav active="perfil" alwaysVisible />
    </main>
  );
}
