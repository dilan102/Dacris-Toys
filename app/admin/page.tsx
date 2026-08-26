import Link from "next/link";
import { AppHeader } from "@/components/ui/app-header";
import { Icon } from "@/components/ui/icon";
import { products } from "@/lib/catalog";

const paidOrders = 3;
const pendingOrders = 2;

export default function AdminPage() {
  return (
    <main className="site-shell inner-page admin-page">
      <AppHeader title="Admin" />
      <section className="content-wrap">
        <div className="page-intro">
          <h1>Panel de control</h1>
          <p>Vista inicial para gestionar productos y pedidos.</p>
        </div>

        <div className="admin-stats">
          <article className="info-card profile-box">
            <Icon name="box" />
            <h2>{products.length}</h2>
            <p>Productos activos</p>
          </article>
          <article className="info-card profile-box">
            <Icon name="cart" />
            <h2>{pendingOrders}</h2>
            <p>Pedidos pendientes</p>
          </article>
          <article className="info-card profile-box">
            <Icon name="badge" />
            <h2>{paidOrders}</h2>
            <p>Pagos confirmados</p>
          </article>
        </div>

        <div className="admin-actions">
          <Link className="secondary-button filled" href="/admin/productos">
            Gestionar productos
          </Link>
          <Link className="secondary-button outline" href="/admin/pedidos">
            Ver pedidos
          </Link>
        </div>
      </section>
    </main>
  );
}
