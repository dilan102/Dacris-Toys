import type { Metadata } from "next";
import { CategoryView } from "@/components/catalog/category-view";
import { AppHeader } from "@/components/ui/app-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { getCategory } from "@/lib/catalog";

const category = getCategory("ninos");

export const metadata: Metadata = {
  title: "Juguetería: Niños | Dacri's Toys",
  description: category?.description,
};

export default function NinosPage() {
  return (
    <main className="site-shell inner-page">
      <AppHeader title="Niños" backHref="/categorias/jugueteria" />
      <CategoryView slug="ninos" />
      <BottomNav active="categorias" alwaysVisible />
    </main>
  );
}
