"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { formatPrice, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/store/cart-context";
import { calculateCartQuantity } from "@/lib/store/cart-store";

export function CartClient({ products }: { products: Product[] }) {
  const { items, changeQuantity, removeItem } = useCart();
  const rows = items.map((item) => ({ item, product: products.find((product) => product.id === item.productId) })).filter((row): row is { item: typeof items[number]; product: Product } => Boolean(row.product));
  const subtotal = rows.reduce((sum, row) => sum + row.product.price * row.item.quantity, 0);
  const totalUnits = calculateCartQuantity(items);
  const shipping = rows.length ? 8000 : 0;
  if (!rows.length) return <div className="empty-media"><h2>Tu carrito está vacío</h2><p>Elige algo especial para empezar.</p><Link className="primary-button" href="/categorias/todos">Ver catálogo</Link></div>;
  return <><div className="cart-list" aria-label={`${totalUnits} productos en el carrito`}>{rows.map(({ item, product }) => <article className="cart-item" key={product.id}><Image src={product.image} alt={product.name} width={1152} height={896}/><div><h2>{product.name}</h2><p>{formatPrice(product.price)}</p><div className="quantity-row small"><button onClick={() => changeQuantity(product.id, item.quantity - 1)} aria-label="Disminuir cantidad"><Icon name="minus"/></button><span>{item.quantity}</span><button onClick={() => changeQuantity(product.id, Math.min(item.quantity + 1, product.stock))} disabled={item.quantity >= product.stock} aria-label="Aumentar cantidad"><Icon name="plus"/></button><button onClick={() => removeItem(product.id)} aria-label="Eliminar producto">Eliminar</button></div>{item.quantity > product.stock ? <p className="stock-warning">Solo quedan {product.stock} disponibles.</p> : null}</div></article>)}</div><aside className="summary-card cart-summary"><h2>Resumen</h2><div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><div><span>Envío</span><strong>{formatPrice(shipping)}</strong></div><div className="total-row"><span>Total</span><strong>{formatPrice(subtotal + shipping)}</strong></div><Link className="primary-button wide" href="/checkout">Continuar <Icon name="arrow" /></Link></aside></>;
}
