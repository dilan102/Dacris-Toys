"use client";

import {
  useEffect,
  useRef,
  type MouseEvent,
  type PointerEvent,
  type UIEvent,
} from "react";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/lib/catalog";

type FeaturedCarouselProps = {
  rows: Product[][];
};

export function FeaturedCarousel({ rows }: FeaturedCarouselProps) {
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const isTouching = useRef(false);
  const didDrag = useRef(false);
  const resumeTimer = useRef<number | null>(null);
  const trackRefs = useRef<Array<HTMLDivElement | null>>([]);
  const isLooping = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 759px)");
    let animationFrame = 0;

    function normalizeLoop(track: HTMLDivElement) {
      if (isLooping.current) return;

      const midpoint = track.scrollWidth / 2;
      const maxScrollLeft = track.scrollWidth - track.clientWidth;

      if (midpoint <= 0 || maxScrollLeft <= 0) return;

      isLooping.current = true;

      if (track.scrollLeft <= 2) {
        track.scrollLeft += midpoint;
        startScrollLeft.current += midpoint;
      } else if (track.scrollLeft >= maxScrollLeft - 2) {
        track.scrollLeft -= midpoint;
        startScrollLeft.current -= midpoint;
      }

      window.requestAnimationFrame(() => {
        isLooping.current = false;
      });
    }

    function tick() {
      if (mediaQuery.matches && !isTouching.current) {
        trackRefs.current.forEach((track, index) => {
          if (!track) return;

          const direction = index % 2 === 0 ? 1 : -1;

          track.scrollLeft += direction * 0.32;
          normalizeLoop(track);
        });
      }

      animationFrame = window.requestAnimationFrame(tick);
    }

    trackRefs.current.forEach((track) => {
      if (!track || !mediaQuery.matches) return;

      track.scrollLeft = track.scrollWidth / 2;
    });

    animationFrame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(animationFrame);

      if (resumeTimer.current) {
        window.clearTimeout(resumeTimer.current);
      }
    };
  }, []);

  function handlePointerDown(
    event: PointerEvent<HTMLDivElement>,
    track: HTMLDivElement,
  ) {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    if (resumeTimer.current) {
      window.clearTimeout(resumeTimer.current);
    }

    isTouching.current = true;
    startX.current = event.clientX;
    startScrollLeft.current = track.scrollLeft;
    didDrag.current = false;
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!isTouching.current) return;

    const deltaX = event.clientX - startX.current;

    if (Math.abs(deltaX) > 8) {
      didDrag.current = true;
    }
  }

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    const track = event.currentTarget;
    const midpoint = track.scrollWidth / 2;
    const maxScrollLeft = track.scrollWidth - track.clientWidth;

    if (!isLooping.current && midpoint > 0 && maxScrollLeft > 0) {
      isLooping.current = true;

      if (track.scrollLeft <= 2) {
        track.scrollLeft += midpoint;
        startScrollLeft.current += midpoint;
      } else if (track.scrollLeft >= maxScrollLeft - 2) {
        track.scrollLeft -= midpoint;
        startScrollLeft.current -= midpoint;
      }

      window.requestAnimationFrame(() => {
        isLooping.current = false;
      });
    }

    if (!isTouching.current) return;

    if (Math.abs(track.scrollLeft - startScrollLeft.current) > 8) {
      didDrag.current = true;
    }
  }

  function finishDrag() {
    if (!isTouching.current) return;

    isTouching.current = false;
    resumeTimer.current = window.setTimeout(() => {
      didDrag.current = false;
    }, 180);
  }

  function handleClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (!didDrag.current) return;

    event.preventDefault();
    event.stopPropagation();
    didDrag.current = false;
  }

  return (
    <div className="featured-carousel" aria-label="Productos destacados">
      {rows.map((row, rowIndex) => (
        <div
          className={
            rowIndex === 0
              ? "featured-track"
              : "featured-track featured-track-reverse"
          }
          key={rowIndex}
          onClickCapture={handleClickCapture}
          onPointerCancel={finishDrag}
          onPointerDown={(event) => handlePointerDown(event, event.currentTarget)}
          onPointerLeave={finishDrag}
          onPointerMove={handlePointerMove}
          onPointerUp={finishDrag}
          onScroll={handleScroll}
          ref={(element) => {
            trackRefs.current[rowIndex] = element;
          }}
        >
          {[...row, ...row].map((product, index) => (
            <div className="featured-slide" key={`${product.id}-${index}`}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
