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
          text: "Revisaremos los datos de entrega de tu pedido para coordinar el envío. Los tiempos y cobertura pueden variar según el destino; si necesitas confirmarlos antes de pagar, contáctanos por nuestros canales de atención.",
        },
        {
          title: "Cambios y devoluciones",
          text: "Si el producto llega con una novedad, presenta una solicitud PQR con el número de pedido, descripción del caso y evidencia disponible. Revisaremos el caso y te indicaremos el siguiente paso.",
        },
        {
          title: "Derecho de retracto",
          text: "En las ventas a distancia, el derecho de retracto aplica cuando la ley lo contempla. Consulta el procedimiento y plazo en nuestra página de derecho de retracto antes de realizar tu compra.",
        },
        {
          title: "Contacto",
          text: "Escríbenos a dacristoys@gmail.com o llama al +57 312 218 0298.",
        },
      ]}
    />
  );
}
