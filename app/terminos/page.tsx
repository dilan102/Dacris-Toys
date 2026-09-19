import type { Metadata } from "next";
import { SimpleInfoPage } from "@/components/ui/simple-info-page";

export const metadata: Metadata = {
  title: "Términos y condiciones | Dacri's Toys",
};

export default function TermsPage() {
  return (
    <SimpleInfoPage
      title="Términos y condiciones"
      description="Información general sobre el uso de la tienda y las compras."
      sections={[
        {
          title: "Pedidos y disponibilidad",
          text: "Los productos y su disponibilidad se muestran en el catálogo. Un pedido queda sujeto a la confirmación de pago correspondiente.",
        },
        {
          title: "Datos de compra",
          text: "Al comprar, debes proporcionar datos de contacto y entrega correctos para que podamos gestionar el pedido.",
        },
        {
          title: "Consultas",
          text: "Si necesitas aclarar una condición de compra, contáctanos antes de realizar el pago.",
        },
      ]}
    />
  );
}
