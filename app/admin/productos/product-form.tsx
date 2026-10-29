"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { saveProductAction } from "@/app/admin/productos/actions";
import type { Category, Product } from "@/lib/catalog";

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
  const showSubcategory = category === "jugueteria";

  return (
    <form
      className="checkout-form editor-form"
      action={saveProductAction}
      onSubmit={(event) => {
        const formData = new FormData(event.currentTarget);
        const files = [formData.get("imageFile"), ...formData.getAll("additionalImageFiles")];
        const tooLarge = files.some((file) => file instanceof File && file.size > 24 * 1024 * 1024);

        if (tooLarge) {
          event.preventDefault();
          setFormError("Una imagen pesa más de 24 MB. Usa un archivo más liviano.");
          return;
        }

        setFormError("");
      }}
    >
      {formError ? <p className="form-status">{formError}</p> : null}
      <input type="hidden" name="originalId" value={product?.id ?? ""} />
      <input type="hidden" name="currentImage" value={product?.image ?? ""} />
      <input type="hidden" name="currentImages" value={product?.images?.join(",") ?? ""} />
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
