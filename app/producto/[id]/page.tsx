import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/ui/app-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Icon } from "@/components/ui/icon";
import { formatPrice, getProduct } from "@/lib/catalog";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProduct(id);

  if (!product) notFound();

  return (
    <main className="site-shell inner-page">
      <AppHeader title="Detalle" backHref="/categorias/todos" />
      <section className="content-wrap product-detail">
        <div className="detail-media">
          <Image src={product.image} alt={product.name} width={1152} height={896} priority />
        </div>
        <div className="detail-panel">
          <p className="stock-pill">{product.stock} disponibles</p>
          <h1>{product.name}</h1>
          <strong>{formatPrice(product.price)}</strong>
          <p>{product.detail}</p>
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
      <BottomNav active="categorias" />
    </main>
  );
}
