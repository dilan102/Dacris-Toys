import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import {
  categoryCardDesign,
  formatPrice,
  getCategory,
  getSubcategories,
  sectionCategories,
  sortCategoriesByDisplayOrder,
} from "@/lib/catalog";
import {
  getCategoryProductCountsFromDb,
  getProductsByCategoryFromDb,
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
};

function parsePrice(value?: string) {
  if (!value) return undefined;
  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? price : undefined;
}

export async function CategoryView({ slug, searchParams }: CategoryViewProps) {
  const category = getCategory(slug);

  if (!category) notFound();

  const filters = searchParams ? await searchParams : {};
  const minPrice = parsePrice(filters.minPrice);
  const maxPrice = parsePrice(filters.maxPrice);
  const onlyInStock = filters.onlyInStock === "true";
  const visibleProducts = await getProductsByCategoryFromDb(
    slug,
    minPrice,
    maxPrice,
    onlyInStock,
  );
  const favoriteProductIds = new Set(await getFavoriteProductIds());
  const parentCategory = category.parentSlug ? getCategory(category.parentSlug) : null;
  const subcategories = getSubcategories(category.parentSlug ?? category.slug);
  const showSectionCards = category.slug === "todos";
  const showSubcategoryCards = category.slug === "jugueteria";
  const showProducts = !showSectionCards && !showSubcategoryCards;
  const orderedSectionCategories = sortCategoriesByDisplayOrder(sectionCategories);
  const prices = visibleProducts.map((product) => product.price);
  const priceRange =
    prices.length > 0
      ? `${formatPrice(Math.min(...prices))} - ${formatPrice(Math.max(...prices))}`
      : "Próximamente";
  const summaryCount = showSectionCards
    ? `${sectionCategories.length} categorías`
    : showSubcategoryCards
      ? `${subcategories.length} subsecciones`
    : `${visibleProducts.length} productos`;
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
        <div className="catalog-summary" aria-label="Resumen del catálogo">
          <span>{summaryCount}</span>
          {showProducts ? <span>{priceRange}</span> : null}
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
      {showProducts ? (
        <form className="catalog-filters" method="get">
          <label>
            Precio mínimo
            <input defaultValue={minPrice} min="0" name="minPrice" type="number" />
          </label>
          <label>
            Precio máximo
            <input defaultValue={maxPrice} min="0" name="maxPrice" type="number" />
          </label>
          <label className="catalog-stock-filter">
            <input defaultChecked={onlyInStock} name="onlyInStock" type="checkbox" value="true" />
            Solo con stock
          </label>
          <button type="submit">Filtrar</button>
        </form>
      ) : null}
      {showProducts && visibleProducts.length > 0 ? (
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard
              isFavorite={favoriteProductIds.has(product.id)}
              product={product}
              key={product.id}
            />
          ))}
        </div>
      ) : showProducts ? (
        <div className="empty-media">Muy pronto tendremos productos aquí</div>
      ) : null}
    </section>
  );
}
