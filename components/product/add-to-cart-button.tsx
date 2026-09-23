"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/store/cart-context";
import { Icon } from "@/components/ui/icon";

export function AddToCartButton({ productId, quantity = 1, compact = false }: { productId: string; quantity?: number; compact?: boolean }) {
  const { addItem, changeQuantity, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const cartQuantity = items.find((item) => item.productId === productId)?.quantity ?? 0;

  function add() {
    addItem(productId, quantity);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 700);
  }

  if (cartQuantity > 0) {
    return (
      <div className="cart-card-controls">
        <div className={`quantity-row cart-card-quantity ${justAdded ? "cart-card-added" : ""}`} aria-label="Cantidad en el carrito">
          <button type="button" onClick={() => changeQuantity(productId, cartQuantity - 1)} aria-label="Restar uno"><Icon name="minus" /></button>
          <span aria-live="polite">{cartQuantity}</span>
          <button type="button" onClick={() => changeQuantity(productId, cartQuantity + 1)} aria-label="Sumar uno"><Icon name="plus" /></button>
        </div>
        <Link className="cart-link-button" href="/carrito" aria-label="Ir al carrito">
          <Icon name="cart" />
        </Link>
      </div>
    );
  }

  return <button className={`${compact ? "add-button" : "primary-button wide"} ${justAdded ? "cart-button-sent" : ""}`} type="button" onClick={add} aria-label="Agregar al carrito">
    {compact ? <Icon name="plus" /> : <>{justAdded ? "¡Añadido!" : "Agregar al carrito"} <Icon name="cart" /></>}
  </button>;
}
