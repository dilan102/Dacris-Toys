import { AppHeader } from "@/components/ui/app-header";
import { formatPrice } from "@/lib/catalog";

const orders = [
  { id: "ORD-1001", customer: "María G.", status: "paid", total: 59000 },
  { id: "ORD-1002", customer: "Andrés R.", status: "pending", total: 108000 },
  { id: "ORD-1003", customer: "Cliente invitado", status: "failed", total: 99999 },
];

const labels: Record<string, string> = {
  paid: "Pagado",
  pending: "Pendiente",
  failed: "Fallido",
};

export default function AdminOrdersPage() {
  return (
    <main className="site-shell inner-page admin-page">
      <AppHeader title="Pedidos" backHref="/admin" />
      <section className="content-wrap">
        <div className="page-intro">
          <h1>Pedidos</h1>
          <p>Los estados reales vendrán del webhook de Wompi.</p>
        </div>
        <div className="chips order-filters" aria-label="Filtrar pedidos">
          <button className="chip active">Todos</button>
          <button className="chip">Pendientes</button>
          <button className="chip">Pagados</button>
          <button className="chip">Fallidos</button>
        </div>
        <div className="admin-table">
          {orders.map((order) => (
            <article className="order-row" key={order.id}>
              <div>
                <h2>{order.id}</h2>
                <p>{order.customer}</p>
              </div>
              <span className={`status-pill ${order.status}`}>{labels[order.status]}</span>
              <strong>{formatPrice(order.total)}</strong>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
