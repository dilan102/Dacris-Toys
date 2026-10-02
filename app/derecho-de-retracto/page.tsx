import type { Metadata } from "next";
import { SimpleInfoPage } from "@/components/ui/simple-info-page";

export const metadata: Metadata = {
  title: "Derecho de retracto | Dacri's Toys",
};

export default function RightOfWithdrawalPage() {
  return (
    <SimpleInfoPage
      title="Derecho de retracto"
      description="Información para ejercer este derecho en compras realizadas a distancia."
      sections={[
        {
          title: "Plazo y condiciones",
          text: "Cuando aplique conforme a la Ley 1480 de 2011, puedes ejercer el derecho de retracto dentro de los cinco (5) días hábiles siguientes a la entrega. El producto debe devolverse por los mismos medios y en las mismas condiciones en que fue recibido.",
        },
        {
          title: "Cómo solicitarlo",
          text: "Escríbenos a dacristoys@gmail.com con el asunto “Retracto”, indicando nombre, número de pedido, fecha de entrega, teléfono y la solicitud. Te responderemos con las instrucciones para gestionar la devolución.",
        },
        {
          title: "Costos y excepciones",
          text: "Los costos de transporte y demás costos asociados a la devolución serán asumidos por el consumidor cuando corresponda. El derecho de retracto tiene excepciones legales; revisaremos cada solicitud según la naturaleza y condiciones del producto.",
        },
      ]}
    />
  );
}
