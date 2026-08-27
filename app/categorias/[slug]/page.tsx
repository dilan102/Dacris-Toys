import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { AppHeader } from "@/components/ui/app-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import {
  formatPrice,
  getCategory,
  getCategoryProductCount,
  getProductsByCategory,
  getSubcategories,
  mainCategories,
} from "@/lib/catalog";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);

  if (!category) {
    return {
      title: "Categoría no encontrada | Dacri's Toys",
    };
  }

  return {
    title: `${category.slug === "todos" ? "Catálogo" : category.name} | Dacri's Toys`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategory(slug);

  if (!category) notFound();

  const visibleProducts = getProductsByCategory(slug);
  const parentCategory = category.parentSlug ? getCategory(category.parentSlug) : null;
  const subcategories = getSubcategories(category.parentSlug ?? category.slug);
  const prices = visibleProducts.map((product) => product.price);
  const priceRange =
    prices.length > 0
      ? `${formatPrice(Math.min(...prices))} - ${formatPrice(Math.max(...prices))}`
      : "Próximamente";

  return (
    <main className="site-shell inner-page">
      <AppHeader title={category.name} />
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
                href={`/categorias/${item.slug}`}
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
      <BottomNav active="categorias" />
    </main>
  );
}
