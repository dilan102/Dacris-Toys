"use client";

import { useRef, type MouseEvent, type PointerEvent } from "react";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/lib/catalog";

type FeaturedCarouselProps = {
  rows: Product[][];
};

export function FeaturedCarousel({ rows }: FeaturedCarouselProps) {
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const activeTrack = useRef<HTMLDivElement | null>(null);
  const didDrag = useRef(false);

  function canDragCarousel() {
    return window.matchMedia("(max-width: 759px)").matches;
  }

  function handlePointerDown(
    event: PointerEvent<HTMLDivElement>,
    track: HTMLDivElement,
  ) {
    if (!canDragCarousel()) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    activeTrack.current = track;
    startX.current = event.clientX;
    startScrollLeft.current = track.scrollLeft;
    didDrag.current = false;
    track.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const track = activeTrack.current;

    if (!track) return;

    const deltaX = event.clientX - startX.current;

    if (Math.abs(deltaX) > 8) {
      didDrag.current = true;
      track.scrollLeft = startScrollLeft.current - deltaX;
    }
  }

  function finishDrag(event: PointerEvent<HTMLDivElement>) {
    const track = activeTrack.current;

    if (track?.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }

    activeTrack.current = null;
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
