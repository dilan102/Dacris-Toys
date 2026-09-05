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
  await requireAdminSession();

  const name = getString(formData, "name");
  const id = getString(formData, "id") || buildSlug(name);
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
    throw new Error("Revisa nombre, categoría, precio y stock.");
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

  revalidatePath("/");
  revalidatePath("/admin/productos");
  revalidatePath(`/admin/productos/${id}`);
  revalidatePath("/categorias/[slug]", "page");
  toySubcategories.forEach((category) => {
    revalidatePath(`/categorias/jugueteria/${category.slug}`);
  });
  redirect("/admin/productos");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdminSession();

  const id = getString(formData, "id");

  if (!id) throw new Error("Falta el id del producto.");

  await deleteProduct(id);

  revalidatePath("/");
  revalidatePath("/admin/productos");
  revalidatePath("/categorias/[slug]", "page");
  toySubcategories.forEach((category) => {
    revalidatePath(`/categorias/jugueteria/${category.slug}`);
  });
  redirect("/admin/productos");
}
