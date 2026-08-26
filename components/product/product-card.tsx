import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Product } from "@/lib/catalog";
import { Icon } from "@/components/ui/icon";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <Link href={`/producto/${product.id}`} aria-label={`Ver ${product.name}`}>
        <Image src={product.image} alt={product.name} width={1152} height={896} />
      </Link>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <div className="product-footer">
        <strong>{formatPrice(product.price)}</strong>
        <Link className="add-button" href="/carrito" aria-label={`Agregar ${product.name}`}>
          <Icon name="plus" />
        </Link>
      </div>
    </article>
  );
}
