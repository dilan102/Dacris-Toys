"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";

type BottomNavProps = {
  active: "inicio" | "categorias" | "carrito" | "perfil";
};

const items = [
  { key: "inicio", label: "Inicio", href: "/", icon: "home" },
  { key: "categorias", label: "Categorías", href: "/categorias/todos", icon: "grid" },
  { key: "carrito", label: "Carrito", href: "/carrito", icon: "cart" },
  { key: "perfil", label: "Perfil", href: "/perfil", icon: "user" },
] as const;

export function BottomNav({ active }: BottomNavProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > 80);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={isVisible ? "bottom-nav" : "bottom-nav bottom-nav-hidden"}
      aria-label="Navegación inferior"
    >
      {items.map((item) => (
        <Link
          className={active === item.key ? "active" : undefined}
          href={item.href}
          key={item.key}
        >
          <Icon name={item.icon} />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
