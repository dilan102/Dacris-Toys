import Link from "next/link";
import { AppHeader } from "@/components/ui/app-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Icon } from "@/components/ui/icon";
import { cartPreview, formatPrice, getProduct } from "@/lib/catalog";

const cartItems = cartPreview
  .map((item) => {
    const product = getProduct(item.productId);
    return product ? { ...item, product } : null;
  })
  .filter((item) => item !== null);

const subtotal = cartItems.reduce(
  (total, item) => total + item.product.price * item.quantity,
  0,
);
const total = subtotal + 8000;

export default function CheckoutPage() {
  return (
    <main className="site-shell inner-page">
      <AppHeader title="Checkout" backHref="/carrito" />
      <section className="content-wrap checkout-layout">
        <div>
          <div className="page-intro">
            <h1>Datos de entrega</h1>
            <p>Completa la información para preparar tu pedido.</p>
          </div>
          <form className="checkout-form">
            <label>
              Nombre completo
              <input type="text" placeholder="Tu nombre" />
            </label>
            <label>
              Teléfono
              <input type="tel" placeholder="+57 300 123 4567" />
            </label>
            <label>
              Dirección
              <input type="text" placeholder="Barrio, calle, casa o apto" />
            </label>
            <label>
              Nota para entrega
              <textarea placeholder="Horario, referencia o indicación especial" />
            </label>
          </form>
        </div>

        <aside className="summary-card payment-card">
          <div className="secure-line">
            <Icon name="lock" />
            Pago protegido con Wompi
          </div>
          <h2>Total a pagar</h2>
          <strong className="checkout-total">{formatPrice(total)}</strong>
          <p>
            En la siguiente integración se creará el pedido en Supabase antes de
            abrir Wompi. El estado final vendrá solo del webhook.
          </p>
          <Link className="primary-button wide" href="/perfil">
            Preparar pago <Icon name="arrow" />
          </Link>
        </aside>
      </section>
      <BottomNav active="carrito" alwaysVisible />
    </main>
  );
}
