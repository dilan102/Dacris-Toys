"use client";

import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { FavoriteButton } from "@/components/product/favorite-button";
import { Icon } from "@/components/ui/icon";
import { useCart } from "@/lib/store/cart-context";

type ProductCardActionsProps = {
  productId: string;
  initialFavorite: boolean;
};

export function ProductCardActions({ productId, initialFavorite }: ProductCardActionsProps) {
  const { items, removeItem } = useCart();
  const isInCart = items.some((item) => item.productId === productId);

  return (
    <div className="product-card-actions">
      {isInCart ? (
        <button
          className="remove-from-cart-button"
          type="button"
          onClick={() => removeItem(productId)}
          aria-label="Eliminar del carrito"
        >
          <Icon name="trash" />
        </button>
      ) : (
        <FavoriteButton initialFavorite={initialFavorite} productId={productId} />
      )}
      <AddToCartButton productId={productId} compact />
    </div>
  );
}
