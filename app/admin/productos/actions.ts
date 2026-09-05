"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth";
import { toySubcategories } from "@/lib/catalog";
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

export async function saveProductAction(formData: FormData) {
  await requireAdminSession();

  const name = getString(formData, "name");
  const id = getString(formData, "id") || buildSlug(name);
  const category = getString(formData, "category");
  const subcategory = getString(formData, "subcategory");
  const price = Number(getString(formData, "price"));
  const stock = Number(getString(formData, "stock"));

  if (!id || !name || !category || !Number.isFinite(price) || !Number.isFinite(stock)) {
    throw new Error("Revisa nombre, categoría, precio y stock.");
  }

  const imageFile = formData.get("imageFile");
  const videoFile = formData.get("videoFile");
  const uploadedImage =
    imageFile instanceof File && imageFile.size > 0
      ? await uploadProductMedia(imageFile, id, "image")
      : "";
  const uploadedVideo =
    videoFile instanceof File && videoFile.size > 0
      ? await uploadProductMedia(videoFile, id, "video")
      : "";

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
    ageRange: getString(formData, "ageRange"),
    tags: parseTags(getString(formData, "tags")),
    featured: formData.get("featured") === "on",
  };

  await saveProduct(product);

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
