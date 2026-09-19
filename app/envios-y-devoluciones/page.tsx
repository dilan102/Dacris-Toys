import type { Metadata } from "next";
import { SimpleInfoPage } from "@/components/ui/simple-info-page";

export const metadata: Metadata = {
  title: "Envíos y devoluciones | Dacri's Toys",
};

export default function ShippingAndReturnsPage() {
  return (
    <SimpleInfoPage
      title="Envíos y devoluciones"
      description="Información básica para acompañarte antes y después de tu compra."
      sections={[
        {
          title: "Envíos",
          text: "Revisaremos los datos de entrega de tu pedido para coordinar el envío. Si tienes dudas sobre la cobertura, contáctanos antes de comprar.",
        },
        {
          title: "Cambios y devoluciones",
          text: "Si necesitas ayuda con un producto o pedido, comunícate con la tienda para revisar tu caso.",
        },
        {
          title: "Contacto",
          text: "Escríbenos a dacristoys@gmail.com o llama al +57 312 218 0298.",
        },
      ]}
    />
  );
}
