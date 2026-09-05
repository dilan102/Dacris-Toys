import Image from "next/image";
import { notFound } from "next/navigation";
import { deleteProductAction } from "@/app/admin/productos/actions";
import { ProductForm } from "@/app/admin/productos/product-form";
import { AppHeader } from "@/components/ui/app-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { categories, toySubcategories } from "@/lib/catalog";
import { getProductById } from "@/lib/catalog-db";

type AdminProductPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ category?: string; estado?: string; subcategory?: string }>;
};

const statusMessages: Record<string, string> = {
  "guardar-error": "No se pudo guardar. Revisa que la tabla products exista y tenga permisos de escritura.",
};

export default async function AdminProductPage({ params, searchParams }: AdminProductPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const statusMessage = query.estado ? statusMessages[query.estado] : null;
  const product = id === "nuevo" ? null : (await getProductById(id)) ?? null;
  const mainCategories = categories.filter(
    (category) => !category.parentSlug && category.slug !== "todos",
  );
  const queryCategory = mainCategories.some((category) => category.slug === query.category)
    ? query.category
    : undefined;
  const initialCategory = product?.category ?? queryCategory ?? "jugueteria";
  const initialSubcategory =
    initialCategory === "jugueteria" &&
    toySubcategories.some((category) => category.slug === (product?.subcategory ?? query.subcategory))
      ? product?.subcategory ?? query.subcategory ?? ""
      : "";

  if (id !== "nuevo" && !product) notFound();

  return (
    <main className="site-shell inner-page admin-page">
      <AppHeader title={product ? "Editar producto" : "Nuevo producto"} backHref="/admin/productos" />
      <section className="content-wrap editor-layout">
        {product?.videoUrl ? (
          <video
            className="editor-preview-media"
            src={product.videoUrl}
            poster={product.image}
            controls
          />
        ) : product ? (
          <Image
            className="editor-preview-media"
            src={product.image}
            alt={product.name}
            width={1152}
            height={896}
          />
        ) : (
          <div className="empty-media">Imagen</div>
        )}
        {statusMessage ? <p className="form-status">{statusMessage}</p> : null}
        <ProductForm
          product={product}
          mainCategories={mainCategories}
          toySubcategories={toySubcategories}
          initialCategory={initialCategory}
          initialSubcategory={initialSubcategory}
        />
        {product ? (
          <form className="delete-product-form" action={deleteProductAction}>
            <input type="hidden" name="id" value={product.id} />
            <button className="danger-button wide" type="submit">
              Borrar producto
            </button>
          </form>
        ) : null}
      </section>
      <BottomNav active="perfil" alwaysVisible />
    </main>
  );
}
