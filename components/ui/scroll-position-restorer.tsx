"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const scrollKey = (pathname: string) => `dacris-scroll-position:${pathname}`;

export function ScrollPositionRestorer() {
  const pathname = usePathname();

  useEffect(() => {
    const savedPosition = sessionStorage.getItem(scrollKey(pathname));
    if (savedPosition) {
      window.requestAnimationFrame(() => window.scrollTo(0, Number(savedPosition)));
    }

    const savePosition = () => {
      sessionStorage.setItem(scrollKey(pathname), String(window.scrollY));
    };

    window.addEventListener("scroll", savePosition, { passive: true });
    window.addEventListener("pagehide", savePosition);
    return () => {
      savePosition();
      window.removeEventListener("scroll", savePosition);
      window.removeEventListener("pagehide", savePosition);
    };
  }, [pathname]);

  return null;
}
