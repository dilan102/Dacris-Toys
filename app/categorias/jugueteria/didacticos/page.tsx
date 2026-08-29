import type { Metadata } from "next";
import { CategoryView } from "@/components/catalog/category-view";
import { AppHeader } from "@/components/ui/app-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { getCategory } from "@/lib/catalog";

const category = getCategory("didacticos");

export const metadata: Metadata = {
  title: "Juguetería: Didácticos | Dacri's Toys",
  description: category?.description,
};

export default function DidacticosPage() {
  return (
    <main className="site-shell inner-page">
      <AppHeader title="Didácticos" backHref="/categorias/jugueteria" />
      <CategoryView slug="didacticos" />
      <BottomNav active="categorias" alwaysVisible />
    </main>
  );
}
