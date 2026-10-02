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
          title: "Información de compra",
          text: "Antes de pagar puedes consultar la descripción, precio, disponibilidad y condiciones de cada producto. El total y cualquier costo de envío aplicable se presentan antes de iniciar el pago.",
        },
        {
          title: "Pedidos, pagos y entrega",
          text: "El pedido se confirma tras la validación del pago por nuestro proveedor. Debes proporcionar datos de contacto y entrega correctos; revisaremos la información para coordinar el despacho y te contactaremos si necesitamos una aclaración.",
        },
        {
          title: "Cambios, devoluciones y retracto",
          text: "Consulta las políticas de envíos, devoluciones y derecho de retracto antes de comprar. Los derechos del consumidor se aplican conforme a la normativa colombiana y a las condiciones particulares de cada caso.",
        },
        {
          title: "Atención al consumidor",
          text: "Para solicitudes, quejas, reclamos o consultas, usa el canal PQR de Dacri's Toys. También puedes escribirnos antes de realizar el pago si necesitas aclarar alguna condición.",
        },
      ]}
    />
  );
}
