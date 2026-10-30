"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HomeMenu } from "@/components/navigation/home-menu";
import { Icon } from "@/components/ui/icon";

export function HomeHero() {
  const heroRef = useRef<HTMLElement>(null);
  const [isPastHero, setIsPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsPastHero((heroRef.current?.getBoundingClientRect().bottom ?? Infinity) <= 96);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div className={`hero-top ${isPastHero ? "hero-top-compact" : ""}`} aria-label="Navegación principal">
        <HomeMenu />
        <div className="hero-center">
          <Link
            className={`brand-pill hero-brand ${isPastHero ? "hero-brand-hidden" : ""}`}
            href="/"
            aria-label="Ir al inicio"
          >
            <Image src="/Dacris-Logo.png" alt="Dacri's Toys" width={1536} height={1024} priority />
          </Link>
          <Link
            className={`brand-pill brand-welcome hero-welcome ${isPastHero ? "hero-welcome-visible" : ""}`}
            href="/"
            aria-label="Ir al inicio"
          >
            Bienvenidos
          </Link>
        </div>
        <Link
          className={`hero-round-logo ${isPastHero ? "hero-round-logo-visible" : ""}`}
          href="/"
          aria-label="Ir al inicio"
        >
          <Image src="/Dacris-Logo.png" alt="" width={1536} height={1024} />
        </Link>
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
