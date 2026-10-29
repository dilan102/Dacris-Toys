"use client";

import Image from "next/image";
import { useState } from "react";

type ProductGalleryProps = {
  name: string;
  mainImage: string;
  images?: string[];
};

export function ProductGallery({ name, mainImage, images = [] }: ProductGalleryProps) {
  const galleryImages = [mainImage, ...images.filter((image) => image !== mainImage)];
  const [selectedImage, setSelectedImage] = useState(galleryImages[0]);

  return (
    <div className="detail-media product-gallery">
      <Image
        src={selectedImage}
        alt={name}
        width={1152}
        height={896}
        preload
        sizes="(max-width: 767px) 100vw, (max-width: 1119px) 60vw, 680px"
      />
      {galleryImages.length > 1 ? (
        <div className="product-gallery-thumbnails" aria-label="Más imágenes del producto">
          {galleryImages.map((image, index) => (
            <button
              aria-label={`Ver imagen ${index + 1} de ${name}`}
              className={selectedImage === image ? "active" : undefined}
              key={image}
              onClick={() => setSelectedImage(image)}
              type="button"
            >
              <Image src={image} alt="" width={120} height={96} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
