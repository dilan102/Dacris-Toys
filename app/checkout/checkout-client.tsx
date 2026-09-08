"use client";

import Script from "next/script";
import { useState } from "react";
import { createOrderAction } from "@/app/checkout/actions";
import { useCart } from "@/lib/store/cart-context";

export function CheckoutClient() {
  const { items } = useCart(); const [message, setMessage] = useState("");
  async function submit(formData: FormData) { try { setMessage("Preparando pago..."); const payment = await createOrderAction({ name: String(formData.get("name")), phone: String(formData.get("phone")), address: String(formData.get("address")), note: String(formData.get("note") || ""), items }); const Widget = (window as Window & { WidgetCheckout?: new (config: object) => { open: (callback: () => void) => void } }).WidgetCheckout; if (!Widget) throw new Error("No cargó Wompi. Intenta nuevamente."); new Widget({ currency: "COP", amountInCents: payment.amountInCents, reference: payment.reference, publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY, signature: { integrity: payment.signature }, redirectUrl: `${window.location.origin}/checkout?estado=procesando` }).open(() => setMessage("Pago en proceso. Confirmaremos por el canal seguro.")); } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo preparar el pago."); } }
  return <><Script src="https://checkout.wompi.co/widget.js" strategy="afterInteractive"/><form className="checkout-form" action={submit}><label>Nombre completo<input name="name" required /></label><label>Teléfono<input name="phone" type="tel" required /></label><label>Dirección<input name="address" required /></label><label>Nota para entrega<textarea name="note" /></label><button className="primary-button wide" type="submit" disabled={!items.length}>Pagar con Wompi</button>{message && <p className="form-status">{message}</p>}</form></>;
}
