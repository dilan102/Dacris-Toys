import { AppHeader } from "@/components/ui/app-header";
import { BottomNav } from "@/components/ui/bottom-nav";

export default function ToyCategoryLoading() {
  return (
    <main className="site-shell inner-page">
      <AppHeader title="Juguetería" backHref="/categorias/jugueteria" />
      <section className="content-wrap">
        <div className="section-loading">
          <span />
          <span />
          <span />
        </div>
      </section>
      <BottomNav active="categorias" alwaysVisible />
    </main>
  );
}
