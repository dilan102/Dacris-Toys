import Image from "next/image";

const products = [
  {
    name: "Bloques de madera",
    description: "Para construir y aprender. Madera sostenible y color...",
    price: "19.000$",
    image: "/product-bloques.png",
  },
  {
    name: "Rompecabezas",
    description: "Desarrolla la memoria y la coordinación. Piezas suav...",
    price: "40.000$",
    image: "/product-rompecabezas.png",
  },
  {
    name: "Cocinita",
    description: "Cocina de juguete con accesorios. Ideal para role...",
    price: "100.000$",
    image: "/product-cocinita.png",
  },
  {
    name: "Kit médico",
    description: "Instrumentos de juguete para cuidar a los amigos.",
    price: "99.999$",
    image: "/product-kit-medico.png",
  },
];

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

function Icon({ name }: { name: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2.4,
  };

  if (name === "menu") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    );
  }

  if (name === "cart") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M6 6h15l-2 8H8L6 3H3" />
        <circle cx="9" cy="20" r="1.6" fill="currentColor" />
        <circle cx="18" cy="20" r="1.6" fill="currentColor" />
      </svg>
    );
  }

  if (name === "arrow") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    );
  }

  if (name === "plus") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M12 5v14M5 12h14" />
      </svg>
    );
  }

  if (name === "shield") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M12 3l7 3v5c0 4.5-2.8 8-7 10-4.2-2-7-5.5-7-10V6l7-3z" />
        <path {...common} d="M9 12l2 2 4-5" />
      </svg>
    );
  }

  if (name === "badge") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M12 3l2.2 3.2 3.8.8-.5 3.9L20 14l-3.2 2.2-.8 3.8-4-1.6L8 20l-.8-3.8L4 14l2.5-3.1L6 7l3.8-.8L12 3z" />
        <path {...common} d="M9 12l2 2 4-5" />
      </svg>
    );
  }

  if (name === "heart") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M20.8 5.8a5 5 0 0 0-7.1 0L12 7.5l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21l8.8-8.1a5 5 0 0 0 0-7.1z" />
      </svg>
    );
  }

  if (name === "truck") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" />
        <circle cx="7" cy="19" r="1.8" fill="currentColor" />
        <circle cx="18" cy="19" r="1.8" fill="currentColor" />
      </svg>
    );
  }

  if (name === "refresh") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M20 7v5h-5M4 17v-5h5" />
        <path {...common} d="M18 12a6 6 0 0 0-10.2-4.2L4 12m2 0a6 6 0 0 0 10.2 4.2L20 12" />
      </svg>
    );
  }

  if (name === "home") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" />
      </svg>
    );
  }

  if (name === "grid") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M5 5h6v6H5zM13 5h6v6h-6zM5 13h6v6H5zM13 13h6v6h-6z" />
      </svg>
    );
  }

  if (name === "user") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
      </svg>
    );
  }

  if (name === "phone") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z" />
      </svg>
    );
  }

  return null;
}

export default function Home() {
  return (
    <main className="site-shell">
      <section className="hero">
        <div className="hero-top" aria-label="Navegación principal">
          <button className="icon-button ghost" aria-label="Abrir menu">
            <Icon name="menu" />
          </button>
          <div className="brand-pill">
            <Image
              src="/Dacris-Logo.png"
              alt="Dacri's Toys"
              width={1536}
              height={1024}
              priority
            />
          </div>
          <button className="icon-button light" aria-label="Abrir carrito">
            <Icon name="cart" />
          </button>
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
          <a href="#catalogo" className="primary-button">
            Ver catálogo <Icon name="arrow" />
          </a>
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
          <h2>Categorías</h2>
          <div className="chips" aria-label="Categorías">
            <button className="chip active">Todos</button>
            <button className="chip">Juguetes</button>
            <button className="chip">Cacharrería</button>
            <button className="chip">Variados</button>
          </div>
        </section>

        <section className="offer-card">
          <div>
            <h2>Oferta del mes</h2>
            <p>20% OFF en juguetes educativos.</p>
            <p>Código: DACRI20</p>
          </div>
          <a href="#catalogo">
            Ver ofertas <Icon name="arrow" />
          </a>
        </section>

        <section className="section">
          <div className="section-title-row">
            <h2>Productos destacados</h2>
            <a href="#catalogo">Ver todo</a>
          </div>
          <div className="product-grid">
            {products.map((product) => (
              <article className="product-card" key={product.name}>
                <Image
                  src={product.image}
                  alt={product.name}
                  width={1152}
                  height={896}
                />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-footer">
                  <strong>{product.price}</strong>
                  <button aria-label={`Agregar ${product.name} al carrito`}>
                    <Icon name="plus" />
                  </button>
                </div>
              </article>
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
              <a className="secondary-button filled" href="#catalogo">
                Conocer más <Icon name="arrow" />
              </a>
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
          <a href="#catalogo">Tienda</a>
          <a href="#catalogo">Envíos</a>
          <a href="#catalogo">Devoluciones</a>
          <a href="#catalogo">Contacto</a>
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

      <nav className="bottom-nav" aria-label="Navegación inferior">
        <a className="active" href="#catalogo">
          <Icon name="home" />
          Inicio
        </a>
        <a href="#catalogo">
          <Icon name="grid" />
          Categorías
        </a>
        <a href="#catalogo">
          <Icon name="cart" />
          Carrito
        </a>
        <a href="#catalogo">
          <Icon name="user" />
          Perfil
        </a>
      </nav>
    </main>
  );
}
