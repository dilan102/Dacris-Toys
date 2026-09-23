import Link from "next/link";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Icon } from "@/components/ui/icon";

export default function AboutPage() {
  return (
    <main className="site-shell inner-page">
      <header className="inner-header">
        <Link className="icon-button" href="/" aria-label="Volver al inicio"><Icon name="back" /></Link>
        <div>
          <p className="eyebrow">Conocenos</p>
          <h1>Dacri&apos;s Toys</h1>
        </div>
      </header>
      <section className="content-wrap section">
        <article className="info-card about">
          <div className="about-heading">
            <div className="soft-icon heart"><Icon name="heart" /></div>
            <div><h2>Juguetes con amor</h2><p>Para crecer jugando.</p></div>
          </div>
          <p>
            Dacri&apos;s Toys nació para acompañar los momentos más especiales de la
            infancia. Elegimos juguetes seguros, educativos y divertidos para que
            cada niño pueda imaginar, descubrir y aprender a su manera.
          </p>
          <p>
            Nuestra misión es ofrecer una atención cercana y una selección cuidada
            para cada edad, porque creemos que jugar también crea recuerdos.
          </p>
          <div className="about-actions">
            <Link className="secondary-button filled" href="/categorias/todos">Ver catálogo <Icon name="arrow" /></Link>
            <a className="secondary-button outline" href="tel:+573122180298"><Icon name="phone" /> Llamar</a>
          </div>
        </article>
      </section>
      <BottomNav active="inicio" alwaysVisible />
    </main>
  );
}
