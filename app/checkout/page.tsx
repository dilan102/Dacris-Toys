import { AppHeader } from "@/components/ui/app-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { CheckoutClient } from "@/app/checkout/checkout-client";

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
          <CheckoutClient />
        </div>

        <aside className="summary-card payment-card">
          <h2>Total a pagar</h2>
          <strong className="checkout-total">El total se calcula con el carrito actual</strong>
          <p>
            El pedido se crea antes de abrir Wompi. La confirmación final llega
            únicamente desde el webhook seguro.
          </p>
        </aside>
      </section>
      <BottomNav active="carrito" alwaysVisible />
    </main>
  );
}
