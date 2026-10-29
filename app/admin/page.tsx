import Link from "next/link";
import { AppHeader } from "@/components/ui/app-header";
import { Icon } from "@/components/ui/icon";
import { getProducts } from "@/lib/catalog-db";

export default async function AdminPage() {
  const products = await getProducts();

  return (
    <main className="site-shell inner-page admin-page">
      <AppHeader title="Admin" />
      <section className="content-wrap">
        <div className="page-intro">
          <h1>Panel de control</h1>
          <p>Gestiona los productos que se muestran en el catálogo.</p>
        </div>

        <div className="admin-stats">
          <article className="info-card profile-box">
            <Icon name="box" />
            <h2>{products.length}</h2>
            <p>Productos activos</p>
          </article>
        </div>

        <div className="admin-actions">
          <Link className="secondary-button filled" href="/admin/productos">
            Gestionar productos
          </Link>
        </div>
      </section>
    </main>
  );
}
