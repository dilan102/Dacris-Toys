import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import {
  categoryCardDesign,
  formatPrice,
  getCategory,
  getCategoryProductCount,
  getProductsByCategory,
  getSubcategories,
  sectionCategories,
  sortCategoriesByDisplayOrder,
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
                  Ver productos de {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      ) : null}
      {showSubcategoryCards ? (
        <div
          className="section-card-grid compact-section-grid toy-section-grid"
          aria-label="Subsecciones"
        >
          {subcategories.map((item) => (
            <Link
              className="section-card toy-section-card"
              href={`/categorias/jugueteria/${item.slug}`}
              key={item.slug}
              scroll={false}
            >
              <strong>{item.name}</strong>
              <p>{item.description}</p>
              <span>{getCategoryProductCount(item.slug)} productos</span>
            </Link>
          ))}
        </div>
      ) : null}
      {showProducts && visibleProducts.length > 0 ? (
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      ) : showProducts ? (
        <div className="empty-media">Muy pronto tendremos productos aquí</div>
      ) : null}
    </section>
  );
}
