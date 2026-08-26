import Image from "next/image";
import Link from "next/link";
import { AppHeader } from "@/components/ui/app-header";
import { formatPrice, products } from "@/lib/catalog";

export default function AdminProductsPage() {
  return (
    <main className="site-shell inner-page admin-page">
      <AppHeader title="Productos" backHref="/admin" />
      <section className="content-wrap">
        <div className="section-title-row page-action-row">
          <div className="page-intro compact-intro">
            <h1>Productos</h1>
            <p>Crear, editar o desactivar productos.</p>
          </div>
          <Link className="secondary-button filled" href="/admin/productos/nuevo">
            Nuevo
          </Link>
        </div>

        <div className="admin-table">
          {products.map((product) => (
            <Link className="admin-product-row" href={`/admin/productos/${product.id}`} key={product.id}>
              <Image src={product.image} alt={product.name} width={1152} height={896} />
              <div>
                <h2>{product.name}</h2>
                <p>{product.stock} unidades</p>
              </div>
              <strong>{formatPrice(product.price)}</strong>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
