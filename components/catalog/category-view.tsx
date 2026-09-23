import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { ProductCard } from "@/components/product/product-card";
import {
  categoryCardDesign,
  getCategory,
  getSubcategories,
  sectionCategories,
  sortCategoriesByDisplayOrder,
} from "@/lib/catalog";
import {
  filterAndSortProducts,
  getCategoryProductCountsFromDb,
  getProducts,
  getProductsByCategoryFromDb,
  type ProductSort,
} from "@/lib/catalog-db";
import { getFavoriteProductIds } from "@/lib/favorites";

type CategoryViewProps = {
  slug: string;
  searchParams?: Promise<CatalogSearchParams>;
};

export type CatalogSearchParams = {
  minPrice?: string;
  maxPrice?: string;
  onlyInStock?: string;
  search?: string;
  sortBy?: string;
};

function parsePrice(value?: string) {
  if (!value) return undefined;
  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? price : undefined;
}

function parseSort(value?: string): ProductSort {
  return value === "price_asc" || value === "price_desc" || value === "newest"
    ? value
    : "alpha";
}

export async function CategoryView({ slug, searchParams }: CategoryViewProps) {
  const category = getCategory(slug);

  if (!category) notFound();

  const filters = searchParams ? await searchParams : {};
  const minPrice = parsePrice(filters.minPrice);
  const maxPrice = parsePrice(filters.maxPrice);
  const onlyInStock = filters.onlyInStock === "true";
  const search = filters.search?.trim() ?? "";
  const sortBy = parseSort(filters.sortBy);
  const parentCategory = category.parentSlug ? getCategory(category.parentSlug) : null;
  const subcategories = getSubcategories(category.parentSlug ?? category.slug);
  const showSectionCards = category.slug === "todos";
  const showSubcategoryCards = category.slug === "jugueteria";
  const showProducts = !showSectionCards && !showSubcategoryCards;
  const showProductGrid = showSectionCards || showProducts;
  const visibleProducts = showProducts
    ? await getProductsByCategoryFromDb(
        slug,
        minPrice,
        maxPrice,
        onlyInStock,
        search,
        sortBy,
      )
    : showSectionCards
      ? filterAndSortProducts(
          await getProducts(sortBy === "newest" ? "created_at" : "name"),
          { search, minPrice, maxPrice, onlyInStock, sortBy },
        )
      : [];
  const favoriteProductIds = new Set(
    showProductGrid ? await getFavoriteProductIds() : [],
  );
  const orderedSectionCategories = sortCategoriesByDisplayOrder(sectionCategories);
  const sectionProductCounts = await getCategoryProductCountsFromDb(
    [...orderedSectionCategories, ...subcategories].map((item) => item.slug),
  );

  return (
    <section className="content-wrap">
      <div className="catalog-heading">
        <div className="page-intro compact-intro">
          <h1>
            {category.slug === "todos"
              ? "Categorías"
              : parentCategory
                ? `${parentCategory.name}: ${category.name}`
                : category.name}
          </h1>
          <p>{category.description}</p>
        </div>
      </div>
      {showSectionCards ? (
        <>
          <div
            className="section-card-grid home-category-grid"
            aria-label="Secciones del catálogo"
          >
            {orderedSectionCategories.map((item) => {
              const design = categoryCardDesign[item.slug] ?? {
                image: "/category-jugueteria.png",
                width: 665,
                height: 390,
              };

              return (
                <Link
                  className="category-showcase"
                  href={`/categorias/${item.slug}`}
                  key={item.slug}
                  scroll={false}
                >
                  <Image
                    src={design.image}
                    alt={`${item.name}: ${item.description}`}
                    width={design.width}
                    height={design.height}
                  />
                  <span className="sr-only">
                    Ver {sectionProductCounts.get(item.slug) ?? 0} productos de{" "}
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </>
      ) : null}
      {showSubcategoryCards ? (
        <div
          className="section-card-grid compact-section-grid toy-section-grid"
          aria-label="Subsecciones"
        >
          {subcategories.map((item) => (
            <article className="section-card toy-section-card" key={item.slug}>
              <Link href={`/categorias/jugueteria/${item.slug}`} scroll={false}>
                <strong>{item.name}</strong>
                <p>{item.description}</p>
                <span>{sectionProductCounts.get(item.slug) ?? 0} productos</span>
              </Link>
            </article>
          ))}
        </div>
      ) : null}
      {showProductGrid ? (
        <CatalogFilters
          maxPrice={maxPrice}
          minPrice={minPrice}
          onlyInStock={onlyInStock}
          search={search}
          sortBy={sortBy}
        />
      ) : null}
      {showProductGrid && visibleProducts.length > 0 ? (
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard
              isFavorite={favoriteProductIds.has(product.id)}
              product={product}
              key={product.id}
            />
          ))}
        </div>
      ) : showProductGrid ? (
        <div className="empty-media">No encontramos productos con esos filtros.</div>
      ) : null}
    </section>
  );
}
