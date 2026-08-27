import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import {
  formatPrice,
  getCategory,
  getCategoryProductCount,
  getProductsByCategory,
  getSubcategories,
  sectionCategories,
} from "@/lib/catalog";

type CategoryViewProps = {
  slug: string;
};

export function CategoryView({ slug }: CategoryViewProps) {
  const category = getCategory(slug);

  if (!category) notFound();

  const visibleProducts = getProductsByCategory(slug);
  const parentCategory = category.parentSlug ? getCategory(category.parentSlug) : null;
  const subcategories = getSubcategories(category.parentSlug ?? category.slug);
  const showSectionCards = category.slug === "todos";
  const showSubcategoryCards = category.slug === "jugueteria";
  const prices = visibleProducts.map((product) => product.price);
  const priceRange =
    prices.length > 0
      ? `${formatPrice(Math.min(...prices))} - ${formatPrice(Math.max(...prices))}`
      : "Próximamente";
  const summaryCount = showSectionCards
    ? `${sectionCategories.length} categorías`
    : `${visibleProducts.length} productos`;

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
          {!showSectionCards ? <span>{priceRange}</span> : null}
        </div>
      </div>
      {showSectionCards ? (
        <div className="section-card-grid" aria-label="Secciones del catálogo">
          {sectionCategories.map((item) => (
            <Link className="section-card" href={`/categorias/${item.slug}`} key={item.slug}>
              <strong>{item.name}</strong>
              <p>{item.description}</p>
              <span>{getCategoryProductCount(item.slug)} productos</span>
            </Link>
          ))}
        </div>
      ) : null}
      {showSubcategoryCards ? (
        <div className="section-card-grid compact-section-grid" aria-label="Subsecciones">
          {subcategories.map((item) => (
            <Link
              className="section-card"
              href={`/categorias/jugueteria/${item.slug}`}
              key={item.slug}
            >
              <strong>{item.name}</strong>
              <p>{item.description}</p>
              <span>{getCategoryProductCount(item.slug)} productos</span>
            </Link>
          ))}
        </div>
      ) : null}
      {!showSectionCards && visibleProducts.length > 0 ? (
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      ) : !showSectionCards ? (
        <div className="empty-media">Muy pronto tendremos productos aquí</div>
      ) : null}
    </section>
  );
}
