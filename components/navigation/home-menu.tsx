"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";

const menuItems = [
  { label: "Inicio", href: "/", icon: "home" },
  { label: "Categorías", href: "/categorias/todos", icon: "grid" },
  { label: "Carrito", href: "/carrito", icon: "cart" },
  { label: "Perfil", href: "/perfil", icon: "user" },
];

export function HomeMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        className="icon-button ghost"
        type="button"
        aria-label="Abrir menú"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <Icon name="menu" />
      </button>

      <div className={isOpen ? "side-menu-layer open" : "side-menu-layer"} aria-hidden={!isOpen}>
        <button
          className="side-menu-backdrop"
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setIsOpen(false)}
        />
        <div className="side-menu" role="dialog" aria-label="Menú principal">
          <nav className="side-menu-nav" aria-label="Secciones">
            {menuItems.map((item) => (
              <Link
                href={item.href}
                key={item.href}
                onClick={() => setIsOpen(false)}
              >
                <Icon name={item.icon} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
