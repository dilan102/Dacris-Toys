"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession, requireOwnerSession } from "@/lib/auth";
import { categories, toySubcategories } from "@/lib/catalog";
import { hasSupabaseServiceRole } from "@/lib/supabase/server";
import {
  deleteProduct,
  getProductById,
  saveProduct,
  uploadProductMedia,
  type ProductInput,
} from "@/lib/catalog-db";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function buildSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function redirectToEditor(id: string, status: string): never {
  redirect(`/admin/productos/${id}?estado=${encodeURIComponent(status)}`);
}

function revalidateCatalogPaths(productId?: string) {
  revalidateTag("catalog-products", "max");

  const paths = [
    "/",
    "/admin",
    "/admin/productos",
    "/categorias/todos",
    ...categories
      .filter((category) => !category.parentSlug && category.slug !== "todos")
      .map((category) => `/categorias/${category.slug}`),
    ...toySubcategories.map((category) => `/categorias/jugueteria/${category.slug}`),
  ];

  if (productId) {
    paths.push(`/admin/productos/${productId}`, `/producto/${productId}`);
  }

  paths.forEach((path) => {
    try {
      revalidatePath(path);
    } catch (error) {
      console.error(
        `No se pudo revalidar ${path}:`,
        error instanceof Error ? error.message : error,
      );
    }
  });
}

async function uploadOptionalProductMedia(
  file: FormDataEntryValue | null,
  productId: string,
  kind: "image" | "video",
) {
  if (!(file instanceof File) || file.size <= 0) return "";

  return uploadProductMedia(file, productId, kind);
}

async function uploadProductImages(files: FormDataEntryValue[], productId: string) {
  return Promise.all(
    files
      .filter((file): file is File => file instanceof File && file.size > 0)
      .map((file) => uploadProductMedia(file, productId, "image")),
  );
}

export async function saveProductAction(formData: FormData) {
  const name = getString(formData, "name");
  const requestedId = getString(formData, "id");
  const originalId = getString(formData, "originalId");
  let id = requestedId || buildSlug(name);

  try {
    await requireAdminSession();
  } catch (error) {
    console.error(
      "Sesión admin inválida al guardar producto:",
      error instanceof Error ? error.message : error,
    );
    redirect("/login?estado=admin-requerido");
  }

  if (!hasSupabaseServiceRole()) {
    redirectToEditor(id || "nuevo", "configuracion-servidor");
  }

  const category = getString(formData, "category");
  const subcategory = category === "jugueteria" ? getString(formData, "subcategory") : "";
  const price = Number(getString(formData, "price"));

  const validCategory = categories.some(
    (item) => !item.parentSlug && item.slug !== "todos" && item.slug === category,
  );
  const validSubcategory =
    !subcategory || toySubcategories.some((item) => item.slug === subcategory);

  if (
    !id ||
    !name ||
    !validCategory ||
    !validSubcategory ||
    !Number.isFinite(price)
  ) {
    redirectToEditor(id || "nuevo", "datos-invalidos");
  }

  // A new product must never silently replace another one with the same slug.
  // When the slug is automatic, add a number instead; explicit duplicates ask
  // the administrator to choose a different ID.
  if (!originalId) {
    const existing = await getProductById(id);

    if (existing && requestedId) {
      redirectToEditor("nuevo", "slug-duplicado");
    }

    if (existing) {
      const baseId = id;
      let suffix = 2;

      while (await getProductById(`${baseId}-${suffix}`)) {
        suffix += 1;
      }

      id = `${baseId}-${suffix}`;
    }
  } else if (originalId !== id) {
    redirectToEditor(originalId, "slug-no-editable");
  }

  const imageFile = formData.get("imageFile");
  const additionalImageFiles = formData.getAll("additionalImageFiles");
  let uploadedImage = "";
  let uploadedImages: string[] = [];

  try {
    [uploadedImage, uploadedImages] = await Promise.all([
      uploadOptionalProductMedia(imageFile, id, "image"),
      uploadProductImages(additionalImageFiles, id),
    ]);
  } catch (error) {
    console.error(
      "No se pudo subir el archivo del producto:",
      error instanceof Error ? error.message : error,
    );
    redirectToEditor(id, "archivo-invalido");
  }

  if (!originalId && !uploadedImage) {
    redirectToEditor(id, "imagen-principal-requerida");
  }

  const existingImages = getString(formData, "currentImages").split(",").filter(Boolean);

  const product: ProductInput = {
    id,
    name,
    description: getString(formData, "description"),
    detail: getString(formData, "detail"),
    price,
    image: uploadedImage || getString(formData, "currentImage") || "/product-bloques.png",
    images: [...existingImages, ...uploadedImages],
    category,
    subcategory: subcategory || undefined,
    // Retained for the dormant checkout flow; inventory is not managed in catalogue mode.
    stock: 0,
    ageRange: "",
    tags: parseTags(getString(formData, "tags")),
    // New products always join the carousel; this is no longer a manual step.
    featured: true,
  };

  try {
    await saveProduct(product);
  } catch (error) {
    console.error(
      "No se pudo guardar el producto:",
      error instanceof Error ? error.message : error,
    );
    redirectToEditor(id, "guardar-error");
  }

  revalidateCatalogPaths(id);
  redirect("/admin/productos");
}

export async function deleteProductAction(formData: FormData) {
  const id = getString(formData, "id");

  try {
    await requireOwnerSession();
  } catch (error) {
    console.error(
      "Sesión admin inválida al borrar producto:",
      error instanceof Error ? error.message : error,
    );
    redirect("/login?estado=admin-requerido");
  }

  if (!hasSupabaseServiceRole()) {
    redirect("/admin/productos?estado=configuracion-servidor");
  }

  if (!id) redirect("/admin/productos");

  try {
    await deleteProduct(id);
  } catch (error) {
    console.error(
      "No se pudo borrar el producto:",
      error instanceof Error ? error.message : error,
    );
    redirectToEditor(id, "borrar-error");
  }

  revalidateCatalogPaths(id);
  redirect("/admin/productos");
}
