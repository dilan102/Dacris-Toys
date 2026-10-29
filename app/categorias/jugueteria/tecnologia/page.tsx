import type { Metadata } from "next";
import { CategoryView, type CatalogSearchParams } from "@/components/catalog/category-view";
import { AppHeader } from "@/components/ui/app-header";
import { getCategory } from "@/lib/catalog";

const category = getCategory("tecnologia");

export const metadata: Metadata = {
  title: "Juguetería: Tecnología | Dacri's Toys",
  description: category?.description,
};

type TecnologiaPageProps = {
  searchParams: Promise<CatalogSearchParams>;
};

export default function TecnologiaPage({ searchParams }: TecnologiaPageProps) {
  return (
    <main className="site-shell inner-page">
      <AppHeader title="Tecnología" backHref="/categorias/jugueteria" />
      <CategoryView searchParams={searchParams} slug="tecnologia" />
    </main>
  );
}
