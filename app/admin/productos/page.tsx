import Image from "next/image";
import Link from "next/link";
import { AppHeader } from "@/components/ui/app-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { formatPrice } from "@/lib/catalog";
import { getProducts } from "@/lib/catalog-db";

export default async function AdminProductsPage() {
  const products = await getProducts();

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

        {products.length > 0 ? (
          <div className="admin-table">
            {products.map((product) => (
              <Link
                className="admin-product-row"
                href={`/admin/productos/${product.id}`}
                key={product.id}
              >
                <Image src={product.image} alt={product.name} width={1152} height={896} />
                <div>
                  <h2>{product.name}</h2>
                  <p>
                    {product.category} - {product.stock} unidades
                  </p>
                </div>
                <strong>{formatPrice(product.price)}</strong>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-media">Aún no hay productos</div>
        )}
      </section>
      <BottomNav active="perfil" alwaysVisible />
    </main>
  );
}
