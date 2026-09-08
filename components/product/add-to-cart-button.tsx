"use client";

import { useCart } from "@/lib/store/cart-context";
import { Icon } from "@/components/ui/icon";

export function AddToCartButton({ productId, quantity = 1, compact = false }: { productId: string; quantity?: number; compact?: boolean }) {
  const { addItem } = useCart();
  return <button className={compact ? "add-button" : "primary-button wide"} type="button" onClick={() => addItem(productId, quantity)} aria-label="Agregar al carrito">
    {compact ? <Icon name="plus" /> : <>Agregar al carrito <Icon name="cart" /></>}
  </button>;
}
