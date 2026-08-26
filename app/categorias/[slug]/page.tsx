import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { AppHeader } from "@/components/ui/app-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { categories, getCategory, getProductsByCategory } from "@/lib/catalog";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategory(slug);

  if (!category) notFound();

  const visibleProducts = getProductsByCategory(slug);

  return (
    <main className="site-shell inner-page">
      <AppHeader title={category.name} />
      <section className="content-wrap">
        <div className="chips" aria-label="Categorías">
          {categories.map((item) => (
            <Link
              className={item.slug === slug ? "chip active" : "chip"}
              href={`/categorias/${item.slug}`}
              key={item.slug}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="page-intro">
          <h1>{category.slug === "todos" ? "Todo el catálogo" : category.name}</h1>
          <p>{visibleProducts.length} productos listos para explorar.</p>
        </div>
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </section>
      <BottomNav active="categorias" />
    </main>
  );
}
