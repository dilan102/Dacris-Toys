import type { Metadata } from "next";
import { SimpleInfoPage } from "@/components/ui/simple-info-page";

export const metadata: Metadata = {
  title: "PQR | Dacri's Toys",
};

export default function PqrPage() {
  return (
    <SimpleInfoPage
      title="Peticiones, quejas y reclamos"
      description="Canal de atención para solicitudes relacionadas con compras, entregas, garantías y datos personales."
      sections={[
        {
          title: "Canales de atención",
          text: "Escríbenos a dacristoys@gmail.com o llámanos al +57 312 218 0298. Para una atención más ágil, indica si se trata de una petición, queja, reclamo o solicitud de garantía.",
        },
        {
          title: "Información necesaria",
          text: "Incluye tu nombre, correo o teléfono de contacto, número de pedido si existe, descripción clara de la solicitud y los soportes disponibles. No envíes datos de tarjeta ni contraseñas.",
        },
        {
          title: "Seguimiento",
          text: "Confirmaremos la recepción por el canal que indiques y responderemos dentro de los términos aplicables. Si la solicitud trata de datos personales, puedes ejercer tus derechos de consulta, corrección, supresión o revocatoria cuando proceda.",
        },
      ]}
    />
  );
}
