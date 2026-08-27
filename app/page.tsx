import Image from "next/image";
import Link from "next/link";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Icon } from "@/components/ui/icon";
import { HomeMenu } from "@/components/navigation/home-menu";
import { ProductCard } from "@/components/product/product-card";
import {
  getCategoryProductCount,
  getFeaturedProducts,
  sectionCategories,
  toySubcategories,
} from "@/lib/catalog";

const guarantees = [
  { icon: "truck", title: "Envío rápido", text: "Entrega en 2-3 días" },
  { icon: "refresh", title: "Cambios fáciles", text: "Devoluciones en 7 días" },
];

const reviews = [
  {
    name: "María G.",
    role: "Mamá de 4 años",
    initial: "M",
    text: '"Los juguetes son hermosos y muy bien hechos. Mi hijo no se despega."',
  },
  {
    name: "Andrés R.",
    role: "Papá de 2 años",
    initial: "A",
    text: '"La atención al cliente es excelente. Todo llegó muy bien empaquetado."',
  },
];

export default function Home() {
  const featuredProducts = getFeaturedProducts();
  const featuredRows = [
    featuredProducts.filter((_, index) => index % 2 === 0),
    featuredProducts.filter((_, index) => index % 2 === 1),
  ];

  return (
    <main className="site-shell">
      <section className="hero">
        <div className="hero-top" aria-label="Navegación principal">
          <HomeMenu sections={sectionCategories} toySubsections={toySubcategories} />
          <Link className="brand-pill" href="/" aria-label="Ir al inicio">
            <Image
              src="/Dacris-Logo.png"
              alt="Dacri's Toys"
              width={1536}
              height={1024}
              priority
            />
          </Link>
          <Link className="icon-button light" href="/carrito" aria-label="Abrir carrito">
            <Icon name="cart" />
          </Link>
        </div>

        <div className="hero-copy">
          <p className="eyebrow">Bienvenidos a</p>
          <h1>
            Un mundo de <span>Diversión</span>
          </h1>
          <p>Juguetes para imaginar, jugar y crear recuerdos</p>
        </div>

        <Image
          className="hero-logo"
          src="/Dacris-Logo.png"
          alt="Dacri's Toys catálogo"
          width={1536}
          height={1024}
          priority
        />

        <div className="hero-cta">
          <p>Explora nuestro catálogo y encuentra el juguete perfecto</p>
          <Link href="#catalogo" className="primary-button">
            Ver catálogo <Icon name="arrow" />
          </Link>
        </div>

        <div className="trust-bar" aria-label="Beneficios">
          <div>
            <Icon name="shield" />
            <span>Juguetes seguros</span>
          </div>
          <div>
            <Icon name="badge" />
            <span>Calidad garantizada</span>
          </div>
          <div>
            <Icon name="heart" />
            <span>Hechos para durar</span>
          </div>
        </div>
      </section>

      <div className="content-wrap" id="catalogo">
        <section className="section">
          <div className="section-title-row">
            <h2>Categorías</h2>
            <Link href="/categorias/todos">Explorar todo</Link>
          </div>
          <div className="chips" aria-label="Categorías">
            {sectionCategories.map((category) => (
              <Link
                className="chip"
                href={`/categorias/${category.slug}`}
                key={category.slug}
              >
                {category.name}
                <span>{getCategoryProductCount(category.slug)}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="offer-card">
          <div>
            <h2>Oferta del mes</h2>
            <p>20% OFF en juguetes educativos.</p>
            <p>Código: DACRI20</p>
          </div>
          <Link href="/categorias/jugueteria">
            Ver ofertas <Icon name="arrow" />
          </Link>
        </section>

        <section className="section">
          <div className="section-title-row">
            <h2>Productos destacados</h2>
            <Link href="/categorias/todos">Ver todo</Link>
          </div>
          <div className="featured-carousel" aria-label="Productos destacados">
            {featuredRows.map((row, rowIndex) => (
              <div
                className={
                  rowIndex === 0
                    ? "featured-track"
                    : "featured-track featured-track-reverse"
                }
                key={rowIndex}
              >
                {[...row, ...row].map((product, index) => (
                  <div className="featured-slide" key={`${product.id}-${index}`}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>Garantías</h2>
          <div className="guarantee-grid">
            {guarantees.map((item) => (
              <article className="info-card compact" key={item.title}>
                <div className="soft-icon">
                  <Icon name={item.icon} />
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>Opiniones</h2>
          <div className="review-grid">
            {reviews.map((review) => (
              <article className="info-card review" key={review.name}>
                <div className="stars" aria-label="5 estrellas">
                  ☆ ☆ ☆ ☆ ☆
                </div>
                <p>{review.text}</p>
                <div className="person">
                  <span>{review.initial}</span>
                  <div>
                    <h3>{review.name}</h3>
                    <small>{review.role}</small>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>¿Quiénes somos?</h2>
          <article className="info-card about">
            <div className="about-heading">
              <div className="soft-icon heart">
                <Icon name="heart" />
              </div>
              <div>
                <h3>Dacri&apos;s Toys</h3>
                <p>Juguetes con amor</p>
              </div>
            </div>
            <p>
              Somos una tienda de juguetes pensada para que los niños aprendan
              jugando. Buscamos productos seguros, educativos y divertidos para
              cada edad. Queremos que la infancia sea mágica.
            </p>
            <div className="about-actions">
              <Link className="secondary-button filled" href="/categorias/todos">
                Conocer más <Icon name="arrow" />
              </Link>
              <a className="secondary-button outline" href="tel:+573001234567">
                <Icon name="phone" /> Llamar
              </a>
            </div>
          </article>
        </section>
      </div>

      <footer className="footer">
        <div>
          <h2>Dacri&apos;s Toys</h2>
          <p>© 2026 · Todos los derechos reservados</p>
        </div>
        <div className="footer-links">
          <Link href="/categorias/todos">Tienda</Link>
          <Link href="/checkout">Envíos</Link>
          <Link href="/perfil">Devoluciones</Link>
          <Link href="/perfil">Contacto</Link>
        </div>
        <div>
          <h3>Contacto</h3>
          <p>+57 300 123 4567</p>
          <p>hola@dacristoys.com</p>
        </div>
        <p className="tagline">
          &quot;Juguetes que hacen sonreír. Para cada edad, con amor.&quot;
        </p>
      </footer>

      <BottomNav active="inicio" />
    </main>
  );
}
