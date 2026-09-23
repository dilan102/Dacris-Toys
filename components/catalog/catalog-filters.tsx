"use client";

import type { FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ProductSort } from "@/lib/catalog-db";

type CatalogFiltersProps = {
  search?: string;
  sortBy?: ProductSort;
};

export function CatalogFilters({
  search = "",
  sortBy = "alpha",
}: CatalogFiltersProps) {
  const pathname = usePathname();
  const router = useRouter();

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    const nextSearch = String(formData.get("search") ?? "").trim();
    const nextSort = String(formData.get("sortBy") ?? "alpha");

    if (nextSearch) params.set("search", nextSearch);
    if (nextSort !== "alpha") params.set("sortBy", nextSort);

    router.replace(`${pathname}${params.size ? `?${params}` : ""}`, { scroll: false });
  }

  return (
    <form className="catalog-filters" onSubmit={applyFilters}>
      <label className="catalog-search-filter">
        Buscar
        <input defaultValue={search} name="search" placeholder="Nombre del producto" type="search" />
      </label>
      <label>
        Ordenar por
        <select defaultValue={sortBy} name="sortBy" onChange={(event) => event.currentTarget.form?.requestSubmit()}>
          <option value="alpha">Alfabético (A-Z)</option>
          <option value="price_desc">Precio: mayor a menor</option>
          <option value="price_asc">Precio: menor a mayor</option>
          <option value="newest">Más recientes</option>
        </select>
      </label>
      <button type="submit">Buscar</button>
    </form>
  );
}
