import { AppHeader } from "@/components/ui/app-header";
import { BottomNav } from "@/components/ui/bottom-nav";

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
      <BottomNav active="perfil" alwaysVisible />
    </main>
  );
}
