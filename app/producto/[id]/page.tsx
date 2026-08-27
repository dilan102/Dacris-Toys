import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/ui/app-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Icon } from "@/components/ui/icon";
import { ProductCard } from "@/components/product/product-card";
import {
  formatPrice,
  getCategory,
  getProduct,
  getRelatedProducts,
} from "@/lib/catalog";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);

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
  const product = getProduct(id);

  if (!product) notFound();

  const category = getCategory(product.category);
  const relatedProducts = getRelatedProducts(product);

  return (
    <main className="site-shell inner-page">
      <AppHeader title="Detalle" backHref="/categorias/todos" />
      <div className="content-wrap">
        <section className="product-detail">
          <div className="detail-media">
            <Image src={product.image} alt={product.name} width={1152} height={896} priority />
          </div>
          <div className="detail-panel">
            <div className="detail-kicker">
              <p className="stock-pill">{product.stock} disponibles</p>
              <Link href={`/categorias/${product.category}`}>{category?.name}</Link>
            </div>
            <h1>{product.name}</h1>
            <strong>{formatPrice(product.price)}</strong>
            <p>{product.detail}</p>
            <dl className="product-specs">
              <div>
                <dt>Edad</dt>
                <dd>{product.ageRange}</dd>
              </div>
              <div>
                <dt>Disponibilidad</dt>
                <dd>{product.stock > 5 ? "Entrega normal" : "Últimas unidades"}</dd>
              </div>
            </dl>
            <div className="product-tags large" aria-label="Características">
              {product.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="quantity-row" aria-label="Cantidad">
              <button aria-label="Disminuir cantidad">
                <Icon name="minus" />
              </button>
              <span>1</span>
              <button aria-label="Aumentar cantidad">
                <Icon name="plus" />
              </button>
            </div>
            <Link className="primary-button wide" href="/carrito">
              Agregar al carrito <Icon name="cart" />
            </Link>
          </div>
        </section>

        {relatedProducts.length > 0 ? (
          <section className="section">
            <div className="section-title-row">
              <h2>También te puede gustar</h2>
              <Link href={`/categorias/${product.category}`}>Ver categoría</Link>
            </div>
            <div className="product-grid related-grid">
              {relatedProducts.map((item) => (
                <ProductCard product={item} key={item.id} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
      <BottomNav active="categorias" />
    </main>
  );
}
