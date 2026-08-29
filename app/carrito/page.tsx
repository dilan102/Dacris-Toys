import Image from "next/image";
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
const shipping = 8000;
const total = subtotal + shipping;

export default function CartPage() {
  return (
    <main className="site-shell inner-page">
      <AppHeader title="Carrito" />
      <section className="content-wrap cart-layout">
        <div className="page-intro">
          <h1>Tu carrito</h1>
          <p>Revisa tus juguetes antes de continuar.</p>
        </div>

        <div className="cart-list">
          {cartItems.map((item) => (
            <article className="cart-item" key={item.product.id}>
              <Image
                src={item.product.image}
                alt={item.product.name}
                width={1152}
                height={896}
              />
              <div>
                <h2>{item.product.name}</h2>
                <p>{formatPrice(item.product.price)}</p>
                <div className="quantity-row small" aria-label="Cantidad">
                  <button aria-label="Disminuir cantidad">
                    <Icon name="minus" />
                  </button>
                  <span>{item.quantity}</span>
                  <button aria-label="Aumentar cantidad">
                    <Icon name="plus" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="summary-card">
          <h2>Resumen</h2>
          <div>
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <div>
            <span>Envío</span>
            <strong>{formatPrice(shipping)}</strong>
          </div>
          <div className="total-row">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <Link className="primary-button wide" href="/checkout">
            Continuar <Icon name="arrow" />
          </Link>
        </aside>
      </section>
      <BottomNav active="carrito" alwaysVisible />
    </main>
  );
}
