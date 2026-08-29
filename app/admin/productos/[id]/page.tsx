import Image from "next/image";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/ui/app-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { formatPrice, getProduct } from "@/lib/catalog";

type AdminProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProductPage({ params }: AdminProductPageProps) {
  const { id } = await params;
  const product = id === "nuevo" ? null : getProduct(id);

  if (id !== "nuevo" && !product) notFound();

  return (
    <main className="site-shell inner-page admin-page">
      <AppHeader title={product ? "Editar producto" : "Nuevo producto"} backHref="/admin/productos" />
      <section className="content-wrap editor-layout">
        {product ? (
          <Image src={product.image} alt={product.name} width={1152} height={896} />
        ) : (
          <div className="empty-media">Imagen</div>
        )}
        <form className="checkout-form editor-form">
          <label>
            Nombre
            <input type="text" defaultValue={product?.name} placeholder="Nombre del producto" />
          </label>
          <label>
            Precio
            <input
              type="number"
              defaultValue={product?.price}
              placeholder={formatPrice(0)}
            />
          </label>
          <label>
            Stock
            <input type="number" defaultValue={product?.stock} placeholder="0" />
          </label>
          <label>
            Descripción
            <textarea defaultValue={product?.detail} placeholder="Descripción corta" />
          </label>
          <button className="primary-button wide" type="button">
            Guardar cambios
          </button>
        </form>
      </section>
      <BottomNav active="perfil" alwaysVisible />
    </main>
  );
}
