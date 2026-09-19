import type { Metadata } from "next";
import { CategoryView, type CatalogSearchParams } from "@/components/catalog/category-view";
import { AppHeader } from "@/components/ui/app-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { getCategory } from "@/lib/catalog";

const category = getCategory("ninas");

export const metadata: Metadata = {
  title: "Juguetería: Niñas | Dacri's Toys",
  description: category?.description,
};

type NinasPageProps = {
  searchParams: Promise<CatalogSearchParams>;
};

export default function NinasPage({ searchParams }: NinasPageProps) {
  return (
    <main className="site-shell inner-page">
      <AppHeader title="Niñas" backHref="/categorias/jugueteria" />
      <CategoryView searchParams={searchParams} slug="ninas" />
      <BottomNav active="categorias" alwaysVisible />
    </main>
  );
}
