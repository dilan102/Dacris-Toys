import { AppHeader } from "@/components/ui/app-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { getProducts } from "@/lib/catalog-db";
import { CartClient } from "@/app/carrito/cart-client";

export default async function CartPage() {
  const products = await getProducts();
  const newestProducts = (await getProducts("created_at")).slice(0, 4);
  return (
    <main className="site-shell inner-page">
      <AppHeader title="Carrito" />
      <section className="content-wrap cart-layout">
        <div className="page-intro">
          <h1>Tu carrito</h1>
          <p>Revisa tus juguetes antes de continuar.</p>
        </div>

        <CartClient products={products} newestProducts={newestProducts} />
      </section>
      <BottomNav active="carrito" alwaysVisible />
    </main>
  );
}
