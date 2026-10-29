import { AppHeader } from "@/components/ui/app-header";

export default function CategoryLoading() {
  return (
    <main className="site-shell inner-page">
      <AppHeader title="Categorías" backHref="/#catalogo" />
      <section className="content-wrap">
        <div className="section-loading">
          <span />
          <span />
          <span />
        </div>
      </section>
    </main>
  );
}
