import type { Metadata } from "next";
import { SimpleInfoPage } from "@/components/ui/simple-info-page";

export const metadata: Metadata = {
  title: "Información del proveedor | Dacri's Toys",
};

export default function ProviderInformationPage() {
  return (
    <SimpleInfoPage
      title="Información del proveedor"
      description="Datos de contacto y atención de Dacri's Toys."
      sections={[
        {
          title: "Canales de contacto",
          text: "Dacri's Toys atiende consultas comerciales en dacristoys@gmail.com y en el teléfono +57 312 218 0298. Estos canales también están disponibles para compras, entregas, garantías y PQR.",
        },
        {
          title: "Identificación comercial",
          text: "Dacri's Toys es el nombre comercial informado en este sitio. Antes de publicar comercialmente, el titular de la tienda debe completar aquí la razón social o nombre del comerciante, NIT o identificación tributaria y domicilio físico aplicables.",
        },
        {
          title: "Compra segura",
          text: "Los precios, características y disponibilidad se muestran en el catálogo. El pago se procesa con Wompi y la confirmación final se realiza por el canal seguro del proveedor de pagos.",
        },
      ]}
    />
  );
}
