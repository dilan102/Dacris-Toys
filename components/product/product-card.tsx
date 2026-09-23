import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Product } from "@/lib/catalog";
import { ProductCardActions } from "@/components/product/product-card-actions";

type ProductCardProps = {
  product: Product;
  isFavorite?: boolean;
};

export function ProductCard({ product, isFavorite = false }: ProductCardProps) {
  const lowStock = product.stock <= 5;

  return (
    <article className="product-card">
      <Link href={`/producto/${product.id}`} aria-label={`Ver ${product.name}`}>
        <Image src={product.image} alt={product.name} width={1152} height={896} />
      </Link>
      <div className="product-meta">
        <span className={lowStock ? "stock-warning" : undefined}>
          {lowStock ? "Últimas unidades" : `${product.stock} disponibles`}
        </span>
      </div>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <div className="product-footer">
        <strong>{formatPrice(product.price)}</strong>
        <ProductCardActions initialFavorite={isFavorite} productId={product.id} />
      </div>
    </article>
  );
}
