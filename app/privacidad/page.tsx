import type { Metadata } from "next";
import { SimpleInfoPage } from "@/components/ui/simple-info-page";

export const metadata: Metadata = {
  title: "Privacidad | Dacri's Toys",
};

export default function PrivacyPage() {
  return (
    <SimpleInfoPage
      title="Privacidad"
      description="Cómo usamos la información necesaria para atender tus compras."
      sections={[
        {
          title: "Información que usamos",
          text: "Usamos los datos de contacto y entrega que proporcionas para procesar y gestionar tu pedido.",
        },
        {
          title: "Pagos",
          text: "El procesamiento de pagos se realiza a través de nuestro proveedor de pagos. No almacenamos datos de tarjetas en esta tienda.",
        },
        {
          title: "Tus consultas",
          text: "Para solicitar información sobre tus datos, escríbenos a dacristoys@gmail.com.",
        },
      ]}
    />
  );
}
