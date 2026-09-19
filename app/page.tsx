import Image from "next/image";
import Link from "next/link";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Icon } from "@/components/ui/icon";
import { HomeMenu } from "@/components/navigation/home-menu";
import { FeaturedCarousel } from "@/components/product/featured-carousel";
import {
  sectionCategories,
  sortCategoriesByDisplayOrder,
  categoryCardDesign,
  type Product,
} from "@/lib/catalog";
import {
  getCategoryProductCountsFromDb,
  getFeaturedProductsFromDb,
  getProducts,
} from "@/lib/catalog-db";
import { getFavoriteProductIds } from "@/lib/favorites";

const guarantees = [
  { icon: "truck", title: "Envíos", text: "Coordinamos la entrega de tu pedido." },
  { icon: "shield", title: "Compra segura", text: "Acompañamos tu compra de principio a fin." },
  { icon: "box", title: "Selección cuidada", text: "Juguetes elegidos para cada momento." },
];

function makeCarouselRows(products: Product[]) {
  const availableProducts = products.filter((product) => product.stock > 0);

  return [
    availableProducts.filter((_, index) => index % 2 === 0),
    availableProducts.filter((_, index) => index % 2 === 1),
  ].filter((row) => row.length > 0);
}

export default async function Home() {
  const [recentProducts, featuredProducts] = await Promise.all([
    getProducts("created_at"),
    getFeaturedProductsFromDb(),
  ]);
  const recentRows = makeCarouselRows(recentProducts);
  const featuredRows = makeCarouselRows(featuredProducts);
  const orderedSectionCategories = sortCategoriesByDisplayOrder(sectionCategories);
  const categoryCounts = await getCategoryProductCountsFromDb(
    orderedSectionCategories.map((category) => category.slug),
  );
  const favoriteProductIds = await getFavoriteProductIds();

  return (
    <main className="site-shell">
      <section className="hero">
        <div className="hero-top" aria-label="Navegación principal">
          <HomeMenu />
          <Link className="brand-pill" href="/" aria-label="Ir al inicio">
            <Image
              src="/Dacris-Logo.png"
              alt="Dacri's Toys"
              width={1536}
              height={1024}
              priority
            />
          </Link>
          <Link
            className="icon-button light"
            href="/carrito"
            aria-label="Abrir carrito"
          >
            <Icon name="cart" />
          </Link>
        </div>

        <div className="hero-copy">
          <p className="eyebrow">Juguetes para crecer jugando</p>
          <h1>
            El juego empieza con <span>imaginación</span>
          </h1>
          <p>Una selección especial para descubrir, aprender y divertirse.</p>
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
          <Link href="#catalogo" className="primary-button">
            Ver catálogo <Icon name="arrow" />
          </Link>
        </div>

        <div className="trust-bar" aria-label="Beneficios de comprar en Dacri's Toys">
          <div>
            <Icon name="truck" />
            <span>Envíos<br />coordinados</span>
          </div>
          <div>
            <Icon name="shield" />
            <span>Compra<br />segura</span>
          </div>
          <div>
            <Icon name="phone" />
            <span>Atención<br />cercana</span>
          </div>
        </div>
      </section>
      <div className="content-wrap" id="catalogo">
        <section className="section">
          <div className="section-title-row">
            <div>
              <h2>Explorá por categoría</h2>
              <p className="section-description">Encontrá juguetes pensados para cada interés.</p>
            </div>
          </div>
          <div
            className="section-card-grid home-category-grid"
            aria-label="Categorías principales"
          >
            {orderedSectionCategories.map((category) => {
              const design = categoryCardDesign[category.slug] ?? {
                image: "/category-jugueteria.png",
                width: 665,
                height: 390,
              };

              return (
                <Link
                  className="category-showcase"
                  href={`/categorias/${category.slug}`}
                  key={category.slug}
                >
                  <Image
                    src={design.image}
                    alt={`${category.name}: ${category.description}`}
                    width={design.width}
                    height={design.height}
                  />
                  <span className="sr-only">
                    Ver {categoryCounts.get(category.slug) ?? 0} productos de{" "}
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="section">
          <div className="section-title-row">
            <div>
              <h2>Recién llegados</h2>
              <p className="section-description">Novedades que acabamos de sumar.</p>
            </div>
          </div>
          {recentRows.length > 0 ? (
            <FeaturedCarousel favoriteProductIds={favoriteProductIds} rows={recentRows} />
          ) : (
            <div className="empty-media">Pronto encontrarás novedades aquí.</div>
          )}
        </section>

        <section className="section">
          <div className="section-title-row">
            <div>
              <h2>Más para descubrir</h2>
              <p className="section-description">Ideas para seguir jugando.</p>
            </div>
          </div>
          {featuredRows.length > 0 ? (
            <FeaturedCarousel favoriteProductIds={favoriteProductIds} rows={featuredRows} />
          ) : (
            <div className="empty-media">Pronto encontrarás más productos aquí.</div>
          )}
        </section>

        <section className="section">
          <h2>Compra con confianza</h2>
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
              <Link
                className="secondary-button filled"
                href="/categorias/todos"
              >
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
        <div className="footer-brand">
          <h2>Dacri&apos;s Toys</h2>
          <p>© 2026 · Todos los derechos reservados</p>
          <div className="footer-socials" aria-label="Redes sociales">
            <a
              href="https://www.instagram.com/toysdacris?utm_source=qr&igsh=OXUyb2FvcWFsYzE2"
              aria-label="Instagram"
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="instagram" />
            </a>
            <a
              href="https://www.facebook.com/share/1BESveKCrG/"
              aria-label="Facebook"
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="facebook" />
            </a>
            <a
              href="https://wa.me/573122180298"
              aria-label="WhatsApp"
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="whatsapp" />
            </a>

            <a
              href="https://www.tiktok.com/@dacris.toys?_r=1&_t=ZS-99Gzk0v0vu3"
              aria-label="Tiktok"
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="tiktok" />
            </a>
          </div>
        </div>
        <nav className="footer-columns" aria-label="Enlaces del pie de página">
          <div className="footer-column">
            <h3>Tienda</h3>
            <Link href="/categorias/todos">Catálogo</Link>
            <Link href="/categorias/todos">Categorías</Link>
            <Link href="/ofertas">Ofertas</Link>
          </div>
          <div className="footer-column">
            <h3>Ayuda</h3>
            <a href="mailto:dacristoys@gmail.com">Contacto</a>
            <Link href="/faq">Preguntas frecuentes</Link>
            <Link href="/envios-y-devoluciones">Envíos y devoluciones</Link>
          </div>
          <div className="footer-column">
            <h3>Mi cuenta</h3>
            <Link href="/perfil">Perfil</Link>
            <Link href="/perfil">Mis pedidos</Link>
            <Link href="/perfil">Favoritos</Link>
            <Link href="/carrito">Carrito</Link>
          </div>
          <div className="footer-column">
            <h3>Legal</h3>
            <Link href="/terminos">Términos y condiciones</Link>
            <Link href="/privacidad">Privacidad</Link>
          </div>
        </nav>
        <div className="footer-contact">
          <h3>Contacto</h3>
          <a href="tel:+573122180298">+57 312 218 0298</a>
          <a href="mailto:dacristoys@gmail.com">dacristoys@gmail.com</a>
        </div>
        <p className="tagline">
          &quot;Juguetes que hacen sonreír. Para cada edad, con amor.&quot;
        </p>
      </footer>

      <BottomNav active="inicio" />
    </main>
  );
}
