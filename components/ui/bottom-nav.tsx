"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";

type BottomNavProps = {
  active: "inicio" | "categorias" | "carrito" | "perfil";
  alwaysVisible?: boolean;
};

const items = [
  { key: "inicio", label: "Inicio", href: "/", icon: "home" },
  { key: "categorias", label: "Categorías", href: "/categorias/todos", icon: "grid" },
  { key: "carrito", label: "Carrito", href: "/carrito", icon: "cart" },
  { key: "perfil", label: "Perfil", href: "/perfil", icon: "user" },
] as const;

export function BottomNav({ active, alwaysVisible = false }: BottomNavProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (alwaysVisible) {
      setIsVisible(true);
      return;
    }

    function handleScroll() {
      setIsVisible(window.scrollY > 80);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [alwaysVisible]);

  return (
    <nav
      className={[
        "bottom-nav",
        alwaysVisible ? "bottom-nav-always" : "",
        isVisible ? "" : "bottom-nav-hidden",
      ]
        .filter(Boolean)
        .join(" ")}
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
