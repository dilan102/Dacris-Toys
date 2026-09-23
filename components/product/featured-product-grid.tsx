"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/lib/catalog";

type FeaturedProductGridProps = {
  products: Product[];
  favoriteProductIds?: string[];
};

export function FeaturedProductGrid({
  products,
  favoriteProductIds = [],
}: FeaturedProductGridProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase("es-CO");
  const filteredProducts = useMemo(
    () => products.filter((product) =>
      !normalizedQuery ||
      product.name.toLocaleLowerCase("es-CO").includes(normalizedQuery) ||
      product.id.toLocaleLowerCase("es-CO").includes(normalizedQuery),
    ),
    [normalizedQuery, products],
  );

  return (
    <>
      <div className="featured-grid-tools">
        <label className="featured-search">
          <span className="sr-only">Buscar en Más para descubrir</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre o referencia"
          />
        </label>
      </div>
      {filteredProducts.length > 0 ? (
        <div className="section-card-grid featured-product-grid" aria-label="Más productos para descubrir">
          {filteredProducts.map((product) => (
            <ProductCard
              isFavorite={favoriteProductIds.includes(product.id)}
              key={product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <p className="empty-media">No encontramos productos con esa búsqueda.</p>
      )}
    </>
  );
}
