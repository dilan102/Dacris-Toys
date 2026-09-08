"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { useCart } from "@/lib/store/cart-context";
import { calculateCartQuantity } from "@/lib/store/cart-store";

export function CartLink() {
  const { items } = useCart();
  const quantity = calculateCartQuantity(items);
  return <Link className="icon-button light cart-link" href="/carrito" aria-label={`Abrir carrito, ${quantity} productos`}>
    <Icon name="cart" />
    {quantity ? <span className="cart-count">{quantity}</span> : null}
  </Link>;
}
