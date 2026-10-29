import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/ui/app-header";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import {
  formatPrice,
  getCategory,
} from "@/lib/catalog";
import { getProductById, getProductDetailsFromDb } from "@/lib/catalog-db";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Producto no encontrado | Dacri's Toys",
    };
  }

  return {
    title: `${product.name} | Dacri's Toys`,
    description: product.detail,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const { product, relatedProducts } = await getProductDetailsFromDb(id);

  if (!product) notFound();

  const category = getCategory(product.category);
  const subcategory = product.subcategory ? getCategory(product.subcategory) : null;
  const productCategoryHref = subcategory
    ? `/categorias/jugueteria/${subcategory.slug}`
    : `/categorias/${product.category}`;
  const productCategoryLabel = subcategory
    ? `${category?.name}: ${subcategory.name}`
    : category?.name;
  return (
    <main className="site-shell inner-page">
      <AppHeader title="Detalle" backHref="/categorias/todos" />
      <div className="content-wrap">
        <nav className="product-breadcrumb" aria-label="Ruta de navegación">
          <Link href="/">Inicio</Link>
          <span>/</span>
          <Link href="/categorias/todos">Catálogo</Link>
          <span>/</span>
          <Link href={productCategoryHref}>{productCategoryLabel}</Link>
        </nav>
        <section className="product-detail">
          <ProductGallery name={product.name} mainImage={product.image} images={product.images} />
          <div className="detail-panel">
            <p className="detail-category">{productCategoryLabel}</p>
            <h1>{product.name}</h1>
            <p className="product-reference">Referencia: {product.id}</p>
            <strong>{formatPrice(product.price)}</strong>
          </div>
        </section>

        <section className="product-information" aria-labelledby="product-information-title">
          <div>
            <p className="section-eyebrow">Conoce más</p>
            <h2 id="product-information-title">Descripción del producto</h2>
          </div>
          <p>{product.detail}</p>
          {product.tags.length > 0 ? (
            <div className="product-tags large" aria-label="Características">
              {product.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          ) : null}
        </section>

        {relatedProducts.length > 0 ? (
          <section className="section">
            <div className="section-title-row">
              <h2>También te puede gustar</h2>
              <Link href={productCategoryHref}>Ver categoría</Link>
            </div>
            <div className="product-grid related-grid">
              {relatedProducts.map((item) => (
                <ProductCard
                  product={item}
                  key={item.id}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
