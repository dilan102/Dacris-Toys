import { AppHeader } from "@/components/ui/app-header";
import { BottomNav } from "@/components/ui/bottom-nav";

export default function ProductLoading() {
  return (
    <main className="site-shell inner-page">
      <AppHeader title="Detalle" backHref="/categorias/todos" />
      <section className="content-wrap product-detail">
        <div className="detail-media loading-pulse" />
        <div className="detail-panel loading-lines">
          <span />
          <span />
          <span />
        </div>
      </section>
      <BottomNav active="categorias" alwaysVisible />
    </main>
  );
}
