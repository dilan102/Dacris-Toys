import type { ProductSort } from "@/lib/catalog-db";

type CatalogFiltersProps = {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  onlyInStock?: boolean;
  sortBy?: ProductSort;
};

export function CatalogFilters({
  search = "",
  minPrice,
  maxPrice,
  onlyInStock = false,
  sortBy = "alpha",
}: CatalogFiltersProps) {
  return (
    <form className="catalog-filters" method="get">
      <label className="catalog-search-filter">
        Buscar
        <input defaultValue={search} name="search" placeholder="Nombre del producto" type="search" />
      </label>
      <label>
        Precio mínimo
        <input defaultValue={minPrice} min="0" name="minPrice" type="number" />
      </label>
      <label>
        Precio máximo
        <input defaultValue={maxPrice} min="0" name="maxPrice" type="number" />
      </label>
      <label>
        Ordenar por
        <select defaultValue={sortBy} name="sortBy">
          <option value="alpha">Alfabético (A-Z)</option>
          <option value="price_desc">Precio: mayor a menor</option>
          <option value="price_asc">Precio: menor a mayor</option>
          <option value="newest">Más recientes</option>
        </select>
      </label>
      <label className="catalog-stock-filter">
        <input defaultChecked={onlyInStock} name="onlyInStock" type="checkbox" value="true" />
        Solo con stock
      </label>
      <button type="submit">Aplicar</button>
    </form>
  );
}
