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

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 759px)");
    let animationFrame = 0;

    function tick() {
      if (mediaQuery.matches && !isTouching.current) {
        trackRefs.current.forEach((track, index) => {
          if (!track) return;

          const midpoint = track.scrollWidth / 2;
          const direction = index % 2 === 0 ? 1 : -1;

          if (direction === 1) {
            track.scrollLeft += 0.32;

            if (track.scrollLeft >= midpoint) {
              track.scrollLeft -= midpoint;
            }
          } else {
            track.scrollLeft -= 0.32;

            if (track.scrollLeft <= 0) {
              track.scrollLeft += midpoint;
            }
          }
        });
      }

      animationFrame = window.requestAnimationFrame(tick);
    }

    trackRefs.current.forEach((track, index) => {
      if (!track || index % 2 === 0) return;

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
    if (!isTouching.current) return;

    if (Math.abs(event.currentTarget.scrollLeft - startScrollLeft.current) > 8) {
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
