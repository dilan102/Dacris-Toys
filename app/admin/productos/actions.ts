"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth";
import { categories, toySubcategories } from "@/lib/catalog";
import {
  deleteProduct,
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

  try {
    return await uploadProductMedia(file, productId, kind);
  } catch (error) {
    console.error(
      `No se pudo subir ${kind === "image" ? "la imagen" : "el video"} del producto:`,
      error instanceof Error ? error.message : error,
    );
    return "";
  }
}

export async function saveProductAction(formData: FormData) {
  const name = getString(formData, "name");
  const id = getString(formData, "id") || buildSlug(name);

  try {
    await requireAdminSession();
  } catch (error) {
    console.error(
      "Sesión admin inválida al guardar producto:",
      error instanceof Error ? error.message : error,
    );
    redirect("/acceso?estado=admin-requerido");
  }

  const category = getString(formData, "category");
  const subcategory = category === "jugueteria" ? getString(formData, "subcategory") : "";
  const price = Number(getString(formData, "price"));
  const stock = Number(getString(formData, "stock"));

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
    !Number.isFinite(price) ||
    !Number.isFinite(stock)
  ) {
    redirectToEditor(id || "nuevo", "datos-invalidos");
  }

  const imageFile = formData.get("imageFile");
  const videoFile = formData.get("videoFile");
  const [uploadedImage, uploadedVideo] = await Promise.all([
    uploadOptionalProductMedia(imageFile, id, "image"),
    uploadOptionalProductMedia(videoFile, id, "video"),
  ]);

  const product: ProductInput = {
    id,
    name,
    description: getString(formData, "description"),
    detail: getString(formData, "detail"),
    price,
    image: uploadedImage || getString(formData, "image") || "/product-bloques.png",
    videoUrl: uploadedVideo || getString(formData, "videoUrl") || undefined,
    category,
    subcategory: subcategory || undefined,
    stock,
    ageRange: "",
    tags: parseTags(getString(formData, "tags")),
    featured: formData.get("featured") === "on",
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
    await requireAdminSession();
  } catch (error) {
    console.error(
      "Sesión admin inválida al borrar producto:",
      error instanceof Error ? error.message : error,
    );
    redirect("/acceso?estado=admin-requerido");
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
