import Link from "next/link";
import { AppHeader } from "@/components/ui/app-header";
import { BottomNav } from "@/components/ui/bottom-nav";

type InfoSection = {
  title: string;
  text: string;
};

type SimpleInfoPageProps = {
  title: string;
  description: string;
  sections: InfoSection[];
};

export function SimpleInfoPage({ title, description, sections }: SimpleInfoPageProps) {
  return (
    <main className="site-shell inner-page">
      <AppHeader title={title} />
      <section className="content-wrap">
        <div className="page-intro">
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className="simple-info-list">
          {sections.map((section) => (
            <article className="info-card simple-info-card" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </article>
          ))}
        </div>
        <Link className="secondary-button filled" href="/categorias/todos">
          Ver catálogo
        </Link>
      </section>
      <BottomNav active="inicio" alwaysVisible />
    </main>
  );
}
