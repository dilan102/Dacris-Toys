import type { Metadata } from "next";
import { CategoryView } from "@/components/catalog/category-view";
import { AppHeader } from "@/components/ui/app-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { getCategory } from "@/lib/catalog";

const category = getCategory("bebes");

export const metadata: Metadata = {
  title: "Juguetería: Bebés | Dacri's Toys",
  description: category?.description,
};

export default function BebesPage() {
  return (
    <main className="site-shell inner-page">
      <AppHeader title="Bebés" backHref="/categorias/jugueteria" />
      <CategoryView slug="bebes" />
      <BottomNav active="categorias" alwaysVisible />
    </main>
  );
}
