import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CategoryView } from "@/components/catalog/category-view";
import { AppHeader } from "@/components/ui/app-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { categories, getCategory } from "@/lib/catalog";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

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

  if (category?.parentSlug === "jugueteria") {
    redirect(`/categorias/jugueteria/${category.slug}`);
  }

  return (
    <main className="site-shell inner-page">
      <AppHeader title={category?.name ?? "Catálogo"} backHref="/#catalogo" />
      <CategoryView slug={slug} />
      <BottomNav active="categorias" alwaysVisible />
    </main>
  );
}
