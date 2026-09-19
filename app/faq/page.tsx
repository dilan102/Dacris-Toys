import type { Metadata } from "next";
import { SimpleInfoPage } from "@/components/ui/simple-info-page";

export const metadata: Metadata = {
  title: "Preguntas frecuentes | Dacri's Toys",
};

export default function FaqPage() {
  return (
    <SimpleInfoPage
      title="Preguntas frecuentes"
      description="Respuestas rápidas para ayudarte antes de comprar."
      sections={[
        {
          title: "¿Puedo comprar sin crear una cuenta?",
          text: "Sí. Puedes completar tu compra como invitado. Una cuenta te permite consultar tus pedidos y guardar favoritos.",
        },
        {
          title: "¿Cómo sé si mi pago fue confirmado?",
          text: "El estado de tu pedido se actualiza cuando recibimos la confirmación de pago del proveedor de pagos.",
        },
        {
          title: "¿Cómo contacto a la tienda?",
          text: "Puedes escribir a dacristoys@gmail.com o llamar al +57 312 218 0298.",
        },
      ]}
    />
  );
}
