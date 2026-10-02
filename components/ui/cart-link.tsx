"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { useCart } from "@/lib/store/cart-context";
import { calculateCartQuantity } from "@/lib/store/cart-store";

export function CartLink({ home = false }: { home?: boolean }) {
  const { items } = useCart();
  const quantity = calculateCartQuantity(items);
  if (home) {
    return (
      <Link className="icon-button light cart-link" href="/" aria-label="Ir al inicio">
        <Icon name="home" />
      </Link>
    );
  }

  return <Link className="icon-button light cart-link" href="/carrito" aria-label={`Abrir carrito, ${quantity} productos`}>
    <Icon name="cart" />
    {quantity ? <span className="cart-count">{quantity}</span> : null}
  </Link>;
}
