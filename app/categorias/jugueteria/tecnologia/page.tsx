import type { Metadata } from "next";
import { CategoryView } from "@/components/catalog/category-view";
import { AppHeader } from "@/components/ui/app-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { getCategory } from "@/lib/catalog";

const category = getCategory("tecnologia");

export const metadata: Metadata = {
  title: "Juguetería: Tecnología | Dacri's Toys",
  description: category?.description,
};

export default function TecnologiaPage() {
  return (
    <main className="site-shell inner-page">
      <AppHeader title="Tecnología" backHref="/categorias/jugueteria" />
      <CategoryView slug="tecnologia" />
      <BottomNav active="categorias" alwaysVisible />
    </main>
  );
}
