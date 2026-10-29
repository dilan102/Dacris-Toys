import { AppHeader } from "@/components/ui/app-header";

export default function AdminLoading() {
  return (
    <main className="site-shell inner-page admin-page">
      <AppHeader title="Admin" />
      <section className="content-wrap loading-page">
        <div className="loading-lines">
          <span />
          <span />
          <span />
        </div>
      </section>
    </main>
  );
}
