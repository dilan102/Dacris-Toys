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
          title: "Responsable y alcance",
          text: "Dacri's Toys es responsable del tratamiento de los datos que proporcionas al crear una cuenta, realizar una compra o contactar a la tienda. Para consultas, escríbenos a dacristoys@gmail.com o llámanos al +57 312 218 0298.",
        },
        {
          title: "Finalidades",
          text: "Usamos nombre, correo, teléfono, ciudad, dirección y datos del pedido para crear tu cuenta, procesar pagos, coordinar entregas, atender solicitudes y mantener el historial de compras. No usamos tus datos para fines incompatibles con estas finalidades.",
        },
        {
          title: "Autorización y derechos",
          text: "Cuando la ley lo requiere, solicitamos tu autorización previa, expresa e informada. Puedes conocer, actualizar, rectificar o solicitar la supresión de tus datos, así como revocar la autorización cuando proceda, escribiendo a dacristoys@gmail.com.",
        },
        {
          title: "Seguridad y pagos",
          text: "Aplicamos medidas razonables para proteger la información. Los pagos se procesan mediante Wompi; Dacri's Toys no almacena datos completos de tarjetas.",
        },
        {
          title: "Vigencia y cambios",
          text: "Conservamos los datos durante el tiempo necesario para las finalidades informadas y obligaciones aplicables. Si actualizamos materialmente esta política, publicaremos la nueva versión en este sitio.",
        },
      ]}
    />
  );
}
