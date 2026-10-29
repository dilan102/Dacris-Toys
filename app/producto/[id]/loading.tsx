import { AppHeader } from "@/components/ui/app-header";

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
    </main>
  );
}
