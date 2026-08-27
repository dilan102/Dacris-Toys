"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import type { Category } from "@/lib/catalog";

type HomeMenuProps = {
  sections: Category[];
  toySubsections: Category[];
};

export function HomeMenu({ sections, toySubsections }: HomeMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.body.classList.add("menu-open");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("menu-open");
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
        <aside className="side-menu" aria-label="Menú principal">
          <div className="side-menu-head">
            <Link href="/" aria-label="Ir al inicio" onClick={() => setIsOpen(false)}>
              <Image
                src="/Dacris-Logo.png"
                alt="Dacri's Toys"
                width={1536}
                height={1024}
                priority
              />
            </Link>
            <button type="button" aria-label="Cerrar menú" onClick={() => setIsOpen(false)}>
              &times;
            </button>
          </div>

          <nav className="side-menu-nav" aria-label="Secciones">
            <Link href="/categorias/todos" onClick={() => setIsOpen(false)}>
              Todo el catálogo
            </Link>
            {sections.map((section) => (
              <Link
                href={`/categorias/${section.slug}`}
                key={section.slug}
                onClick={() => setIsOpen(false)}
              >
                {section.name}
              </Link>
            ))}
          </nav>

          <div className="side-menu-group">
            <strong>Juguetería</strong>
            <div>
              {toySubsections.map((section) => (
                <Link
                  href={`/categorias/jugueteria/${section.slug}`}
                  key={section.slug}
                  onClick={() => setIsOpen(false)}
                >
                  {section.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
