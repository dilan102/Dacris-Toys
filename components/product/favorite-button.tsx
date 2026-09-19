"use client";

import { useState, useTransition } from "react";
import { toggleFavoriteAction } from "@/app/favoritos/actions";
import { Icon } from "@/components/ui/icon";

type FavoriteButtonProps = {
  productId: string;
  initialFavorite?: boolean;
};

export function FavoriteButton({ productId, initialFavorite = false }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const previousValue = isFavorite;
    setIsFavorite(!previousValue);

    startTransition(async () => {
      try {
        const result = await toggleFavoriteAction(productId);
        setIsFavorite(result.favorite);
      } catch {
        setIsFavorite(previousValue);
      }
    });
  }

  return (
    <button
      aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      aria-pressed={isFavorite}
      className={`favorite-button ${isFavorite ? "active" : ""}`}
      disabled={isPending}
      onClick={handleClick}
      type="button"
    >
      <Icon name="heart" />
    </button>
  );
}
