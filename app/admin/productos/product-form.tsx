"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  prepareProductVideoUploadAction,
  saveProductAction,
} from "@/app/admin/productos/actions";
import type { Category, Product } from "@/lib/catalog";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type ProductFormProps = {
  product: Product | null;
  mainCategories: Category[];
  toySubcategories: Category[];
  initialCategory: string;
  initialSubcategory: string;
};

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button className="primary-button wide pending-button" type="submit" disabled={pending}>
      <span>{pending ? "Guardando..." : "Guardar cambios"}</span>
    </button>
  );
}

export function ProductForm({
  product,
  mainCategories,
  toySubcategories,
  initialCategory,
  initialSubcategory,
}: ProductFormProps) {
  const [category, setCategory] = useState(initialCategory);
  const [formError, setFormError] = useState("");
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadedVideoName, setUploadedVideoName] = useState("");
  const videoInputRef = useRef<HTMLInputElement>(null);
  const uploadedVideoRef = useRef<HTMLInputElement>(null);
  const showSubcategory = category === "jugueteria";

  const uploadVideoBeforeSaving = async (form: HTMLFormElement, video: File) => {
    const formData = new FormData(form);
    const requestedId = String(formData.get("id") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const productId = requestedId || name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!productId) throw new Error("Escribe el nombre del producto antes de subir el video.");

    const upload = await prepareProductVideoUploadAction(productId, video.type);
    if (!upload.success) throw new Error(upload.message);

    const supabase = createSupabaseBrowserClient();
    if (!supabase) throw new Error("No está configurada la subida de videos en el navegador.");

    const { error } = await supabase.storage
      .from("product-media")
      .uploadToSignedUrl(upload.path, upload.token, video, { contentType: video.type });

    if (error) throw new Error("No se pudo subir el video. Inténtalo de nuevo.");
    if (uploadedVideoRef.current) uploadedVideoRef.current.value = upload.publicUrl;
    if (videoInputRef.current) videoInputRef.current.value = "";
    setUploadedVideoName(video.name);
  };

  return (
    <form
      className="checkout-form editor-form"
      action={saveProductAction}
      onSubmit={async (event) => {
        const formData = new FormData(event.currentTarget);
        const imageFiles = [
          formData.get("imageFile"),
          ...formData.getAll("additionalImageFiles"),
        ];
        const tooLarge = imageFiles.some((file) => file instanceof File && file.size > 24 * 1024 * 1024);

        if (tooLarge) {
          event.preventDefault();
          setFormError("Una imagen pesa más de 24 MB. Usa un archivo más liviano.");
          return;
        }

        setFormError("");

        const video = formData.get("videoFile");
        if (video instanceof File && video.size > 0) {
          event.preventDefault();
          setIsUploadingVideo(true);

          try {
            await uploadVideoBeforeSaving(event.currentTarget, video);
            event.currentTarget.requestSubmit();
          } catch (error) {
            setFormError(error instanceof Error ? error.message : "No se pudo subir el video.");
          } finally {
            setIsUploadingVideo(false);
          }
        }
      }}
    >
      {formError ? <p className="form-status">{formError}</p> : null}
      <input type="hidden" name="originalId" value={product?.id ?? ""} />
      <input type="hidden" name="currentImage" value={product?.image ?? ""} />
      <input type="hidden" name="currentImages" value={product?.images?.join(",") ?? ""} />
      <input type="hidden" name="currentVideo" value={product?.videoUrl ?? ""} />
      <input ref={uploadedVideoRef} type="hidden" name="uploadedVideo" />
      <label>
        ID / slug {product ? "(no se puede cambiar al editar)" : "(opcional)"}
        <input
          type="text"
          name="id"
          defaultValue={product?.id}
          placeholder="bloques-madera"
          readOnly={Boolean(product)}
        />
      </label>
      <label>
        Nombre
        <input
          type="text"
          name="name"
          defaultValue={product?.name}
          placeholder="Nombre del producto"
          required
        />
      </label>
      <label>
        Descripción corta
        <input
          type="text"
          name="description"
          defaultValue={product?.description}
          placeholder="Texto corto para la tarjeta"
          required
        />
      </label>
      <label>
        Precio
        <input
          type="number"
          name="price"
          defaultValue={product?.price}
          placeholder="$0"
          min="0"
          required
        />
      </label>
      <label>
        Categoría
        <select
          name="category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          required
        >
          {mainCategories.map((item) => (
            <option value={item.slug} key={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      {showSubcategory ? (
        <label>
          Subsección de juguetería
          <select name="subcategory" defaultValue={initialSubcategory}>
            <option value="">No aplica</option>
            {toySubcategories.map((item) => (
              <option value={item.slug} key={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <label>
        Imagen principal {product ? "(opcional para reemplazarla)" : ""}
        <input type="file" name="imageFile" accept="image/*" required={!product} />
      </label>
      <label>
        Imágenes adicionales
        <input type="file" name="additionalImageFiles" accept="image/*" multiple />
        <span className="form-help">Puedes seleccionar varias imágenes para la galería.</span>
      </label>
      <label>
        Video del producto {product?.videoUrl ? "(opcional para reemplazarlo)" : "(opcional)"}
        <input
          ref={videoInputRef}
          type="file"
          name="videoFile"
          accept="video/mp4,video/webm,video/quicktime"
          disabled={isUploadingVideo}
          onChange={() => {
            if (uploadedVideoRef.current) uploadedVideoRef.current.value = "";
            setUploadedVideoName("");
          }}
        />
        <span className="form-help">Formatos permitidos: MP4, WebM o MOV.</span>
      </label>
      {isUploadingVideo ? <p className="form-help">Subiendo video...</p> : null}
      {uploadedVideoName ? (
        <p className="form-help" role="status">
          Video cargado: {uploadedVideoName}. Se guardará al enviar el producto.
        </p>
      ) : null}
      <label>
        Etiquetas
        <input
          type="text"
          name="tags"
          defaultValue={product?.tags.join(", ")}
          placeholder="Educativo, Regalo, Colores"
        />
      </label>
      <label>
        Descripción
        <textarea
          name="detail"
          defaultValue={product?.detail}
          placeholder="Descripción completa"
          required
        />
      </label>
      <p className="form-help">Este producto aparecerá automáticamente en el catálogo y el carrusel de inicio.</p>
      <SaveButton />
    </form>
  );
}
