"use client";

import Image from "next/image";
import { useState } from "react";

type ProductGalleryProps = {
  name: string;
  mainImage: string;
  images?: string[];
  videoUrl?: string;
};

type GalleryItem =
  | { type: "image"; url: string }
  | { type: "video"; url: string };

export function ProductGallery({ name, mainImage, images = [], videoUrl }: ProductGalleryProps) {
  const galleryItems: GalleryItem[] = [
    { type: "image", url: mainImage },
    ...images
      .filter((image) => image !== mainImage)
      .map((url) => ({ type: "image" as const, url })),
    ...(videoUrl ? [{ type: "video" as const, url: videoUrl }] : []),
  ];
  const [selectedItem, setSelectedItem] = useState<GalleryItem>(galleryItems[0]);

  return (
    <div className="product-gallery">
      {galleryItems.length > 1 ? (
        <div className="product-gallery-thumbnails" aria-label="Más contenido del producto">
          {galleryItems.map((item, index) => (
            <button
              aria-label={`Ver ${item.type === "video" ? "video" : "imagen"} ${index + 1} de ${name}`}
              className={selectedItem.url === item.url ? "active" : undefined}
              key={item.url}
              onClick={() => setSelectedItem(item)}
              type="button"
            >
              {item.type === "video" ? (
                <span className="video-thumbnail" aria-hidden>▶</span>
              ) : (
                <Image src={item.url} alt="" width={120} height={96} />
              )}
            </button>
          ))}
        </div>
      ) : null}
      <div className="detail-media product-gallery-main">
        {selectedItem.type === "video" ? (
          <video src={selectedItem.url} controls preload="metadata" aria-label={`Video de ${name}`} />
        ) : (
          <Image
            src={selectedItem.url}
            alt={name}
            width={1152}
            height={896}
            preload
            sizes="(max-width: 767px) 100vw, (max-width: 1119px) 60vw, 680px"
          />
        )}
      </div>
    </div>
  );
}
