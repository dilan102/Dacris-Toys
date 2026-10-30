"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { HomeMenu } from "@/components/navigation/home-menu";
import { Icon } from "@/components/ui/icon";

export function HomeHero() {
  const heroRef = useRef<HTMLElement>(null);
  const [navProgress, setNavProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const heroBottom = heroRef.current?.getBoundingClientRect().bottom ?? Infinity;
      // The last 240px of the hero become the transition zone for the navbar.
      setNavProgress(Math.min(1, Math.max(0, (160 - heroBottom) / 240)));
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navStyle = {
    "--nav-progress": navProgress,
    "--nav-vertical-padding": `${8 - navProgress * 4}px`,
    "--nav-horizontal-padding": `${navProgress * 10}px`,
    "--nav-shadow-opacity": navProgress * 0.16,
    "--nav-brand-offset": `${navProgress * -8}px`,
    "--nav-brand-scale": 1 - navProgress * 0.06,
    "--nav-welcome-offset": `${(1 - navProgress) * -8}px`,
    "--nav-welcome-scale": 0.94 + navProgress * 0.06,
    "--nav-round-scale": 0.82 + navProgress * 0.18,
    "--whatsapp-callout-offset": `${navProgress * 10}px`,
    "--whatsapp-callout-scale": 1 - navProgress * 0.06,
  } as CSSProperties;

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-top" style={navStyle} aria-label="Navegación principal">
        <HomeMenu />
        <div className="hero-center">
          <Link
            className="brand-pill hero-brand"
            href="/"
            aria-label="Ir al inicio"
          >
            <Image src="/Dacris-Logo.png" alt="Dacri's Toys" width={1536} height={1024} priority />
          </Link>
          <Link
            className="brand-pill brand-welcome hero-welcome"
            href="/"
            aria-label="Ir al inicio"
          >
            Bienvenidos
          </Link>
        </div>
        <Link
          className="hero-round-logo"
          href="/"
          aria-label="Ir al inicio"
        >
          <Image src="/Dacris-Logo.png" alt="" width={1536} height={1024} />
        </Link>
      </div>

      <div className="whatsapp-contact" style={navStyle}>
        <p className="whatsapp-callout">Si eres mayorista, contáctate con nosotros</p>
        <a
          className="whatsapp-button"
          href="https://wa.me/573122180298"
          target="_blank"
          rel="noreferrer"
          aria-label="Contactar a Dacri's Toys por WhatsApp"
        >
          <Icon name="whatsapp" />
          <span>WhatsApp</span>
        </a>
      </div>

      <div className="hero-copy">
        <p className="eyebrow">Juguetes para crecer jugando</p>
        <h1>El juego empieza con <span>imaginación</span></h1>
        <p>Una selección especial para descubrir, aprender y divertirse.</p>
      </div>

      <Image className="hero-logo" src="/Dacris-Logo.png" alt="Dacri's Toys catálogo" width={1536} height={1024} priority />

      <div className="hero-cta">
        <Link href="#catalogo" className="primary-button">Ver catálogo <Icon name="arrow" /></Link>
      </div>

      <div className="trust-bar" aria-label="Beneficios de comprar en Dacri's Toys">
        <div><Icon name="truck" /><span>Envíos<br />coordinados</span></div>
        <div><Icon name="shield" /><span>Compra<br />segura</span></div>
        <div><Icon name="phone" /><span>Atención<br />cercana</span></div>
      </div>
    </section>
  );
}
