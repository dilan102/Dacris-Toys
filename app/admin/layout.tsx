import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getSessionUser();

  if (session?.role !== "admin") {
    redirect("/acceso?estado=admin-requerido");
  }

  return children;
}
