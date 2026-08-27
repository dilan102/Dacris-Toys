import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import {
  formatPrice,
  getCategory,
  getCategoryProductCount,
  getProductsByCategory,
  getSubcategories,
  mainCategories,
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

  return (
    <section className="content-wrap">
      <div className="chips" aria-label="Categorías">
        {mainCategories.map((item) => (
          <Link
            className={
              item.slug === slug || item.slug === category.parentSlug
                ? "chip active"
                : "chip"
            }
            href={`/categorias/${item.slug}`}
            key={item.slug}
          >
            {item.name}
            <span>{getCategoryProductCount(item.slug)}</span>
          </Link>
        ))}
      </div>
      {subcategories.length > 0 ? (
        <div className="chips subcategory-chips" aria-label="Subcategorías de juguetería">
          {subcategories.map((item) => (
            <Link
              className={item.slug === slug ? "chip active" : "chip"}
              href={`/categorias/jugueteria/${item.slug}`}
              key={item.slug}
            >
              {item.name}
              <span>{getCategoryProductCount(item.slug)}</span>
            </Link>
          ))}
        </div>
      ) : null}
      <div className="catalog-heading">
        <div className="page-intro compact-intro">
          <h1>
            {category.slug === "todos"
              ? "Todo el catálogo"
              : parentCategory
                ? `${parentCategory.name}: ${category.name}`
                : category.name}
          </h1>
          <p>{category.description}</p>
        </div>
        <div className="catalog-summary" aria-label="Resumen del catálogo">
          <span>{visibleProducts.length} productos</span>
          <span>{priceRange}</span>
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
      {visibleProducts.length > 0 ? (
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      ) : (
        <div className="empty-media">Muy pronto tendremos productos aquí</div>
      )}
    </section>
  );
}
