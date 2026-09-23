"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HomeMenu } from "@/components/navigation/home-menu";
import { Icon } from "@/components/ui/icon";

export function HomeHero() {
  const heroRef = useRef<HTMLElement>(null);
  const [isCompact, setIsCompact] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsCompact(window.scrollY > 80);
      // Start the transition shortly before the hero leaves the viewport.
      setShowLogin((heroRef.current?.getBoundingClientRect().bottom ?? Infinity) <= 220);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div className={`hero-top ${isCompact ? "hero-top-compact" : ""}`} aria-label="Navegación principal">
        <HomeMenu />
        <div className="hero-center">
          <Link className={`brand-pill hero-brand ${showLogin ? "hero-brand-hidden" : ""}`} href="/" aria-label="Ir al inicio">
            <Image src="/Dacris-Logo.png" alt="Dacri's Toys" width={1536} height={1024} priority />
          </Link>
          <Link className={`brand-pill login-pill ${showLogin ? "login-pill-visible" : ""}`} href="/acceso">
            Iniciar sesión <Icon name="user" />
          </Link>
        </div>
        <Link className="icon-button light" href="/carrito" aria-label="Abrir carrito">
          <Icon name="cart" />
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
