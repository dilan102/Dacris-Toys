"use client";

import { useState } from "react";
import { saveProductAction } from "@/app/admin/productos/actions";
import { type Category, formatPrice, type Product } from "@/lib/catalog";

type ProductFormProps = {
  product: Product | null;
  mainCategories: Category[];
  toySubcategories: Category[];
  initialCategory: string;
  initialSubcategory: string;
};

export function ProductForm({
  product,
  mainCategories,
  toySubcategories,
  initialCategory,
  initialSubcategory,
}: ProductFormProps) {
  const [category, setCategory] = useState(initialCategory);
  const showSubcategory = category === "jugueteria";

  return (
    <form className="checkout-form editor-form" action={saveProductAction}>
      <label>
        ID / slug
        <input
          type="text"
          name="id"
          defaultValue={product?.id}
          placeholder="bloques-madera"
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
          placeholder={formatPrice(0)}
          min="0"
          required
        />
      </label>
      <label>
        Stock
        <input
          type="number"
          name="stock"
          defaultValue={product?.stock}
          placeholder="0"
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
        URL de imagen
        <input
          type="text"
          name="image"
          defaultValue={product?.image}
          placeholder="/product-bloques.png"
        />
      </label>
      <label>
        Subir imagen
        <input type="file" name="imageFile" accept="image/*" />
      </label>
      <label>
        URL de video
        <input
          type="text"
          name="videoUrl"
          defaultValue={product?.videoUrl}
          placeholder="https://..."
        />
      </label>
      <label>
        Subir video
        <input type="file" name="videoFile" accept="video/*" />
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
      <label className="checkbox-field">
        <input type="checkbox" name="featured" defaultChecked={product?.featured} />
        Mostrar en destacados
      </label>
      <button className="primary-button wide" type="submit">
        Guardar cambios
      </button>
    </form>
  );
}
