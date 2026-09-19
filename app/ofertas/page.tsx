import type { Metadata } from "next";
import { SimpleInfoPage } from "@/components/ui/simple-info-page";

export const metadata: Metadata = {
  title: "Ofertas | Dacri's Toys",
};

export default function OffersPage() {
  return (
    <SimpleInfoPage
      title="Ofertas"
      description="Aquí compartiremos las promociones vigentes de la tienda."
      sections={[
        {
          title: "Promociones actuales",
          text: "Por ahora no hay una promoción publicada. Revisa el catálogo para conocer los productos disponibles.",
        },
        {
          title: "Próximas novedades",
          text: "Las ofertas temporales aparecerán en esta página cuando estén confirmadas.",
        },
      ]}
    />
  );
}
