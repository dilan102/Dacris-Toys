export default function Loading() {
  return (
    <main className="site-shell inner-page">
      <section className="content-wrap loading-page" aria-label="Cargando">
        <div className="loading-pulse" />
        <div className="loading-lines">
          <span />
          <span />
          <span />
        </div>
      </section>
    </main>
  );
}
