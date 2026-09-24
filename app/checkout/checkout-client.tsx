"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { createOrderAction, saveWompiTransactionAction } from "@/app/checkout/actions";
import { useCart } from "@/lib/store/cart-context";

type GoogleAutocomplete = {
  addListener: (eventName: "place_changed", listener: () => void) => void;
  getPlace: () => { formatted_address?: string; geometry?: { location?: { lat: () => number; lng: () => number } } };
};

declare global {
  interface Window {
    google?: { maps?: { places?: { Autocomplete: new (input: HTMLInputElement, options?: object) => GoogleAutocomplete } } };
  }
}

export function CheckoutClient() {
  const { items } = useCart();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const requestIdRef = useRef<string | null>(null);

  if (!requestIdRef.current) requestIdRef.current = crypto.randomUUID();

  useEffect(() => {
    if (!mapsLoaded || !addressInputRef.current || !window.google?.maps?.places) return;
    const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
      componentRestrictions: { country: "co" },
      fields: ["formatted_address", "geometry"],
    });
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address && addressInputRef.current) addressInputRef.current.value = place.formatted_address;
      const location = place.geometry?.location;
      const form = addressInputRef.current?.form;
      const lat = form?.elements.namedItem("deliveryLat") as HTMLInputElement | null;
      const lng = form?.elements.namedItem("deliveryLng") as HTMLInputElement | null;
      if (location && lat && lng) {
        lat.value = String(location.lat());
        lng.value = String(location.lng());
      }
    });
  }, [mapsLoaded]);

  async function submit(formData: FormData) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      setMessage("Preparando pago...");
      const payment = await createOrderAction({
        requestId: requestIdRef.current!, name: String(formData.get("name")), phone: String(formData.get("phone")),
        email: String(formData.get("email")), city: String(formData.get("city")), department: String(formData.get("department")),
        address: String(formData.get("address")), note: String(formData.get("note") || ""),
        deliveryLat: String(formData.get("deliveryLat") || ""), deliveryLng: String(formData.get("deliveryLng") || ""), items,
      });
      const Widget = (window as Window & { WidgetCheckout?: new (config: object) => { open: (callback: (result?: { transaction?: { id?: string } }) => void) => void } }).WidgetCheckout;
      if (!Widget) throw new Error("No cargó Wompi. Intenta nuevamente.");
      new Widget({ currency: "COP", amountInCents: payment.amountInCents, reference: payment.reference, publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY, signature: { integrity: payment.signature }, redirectUrl: `${window.location.origin}/checkout?estado=procesando` }).open((result) => {
        const transactionId = result?.transaction?.id;
        if (transactionId) void saveWompiTransactionAction(payment.reference, transactionId);
        setMessage("Pago en proceso. Confirmaremos por el canal seguro.");
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo preparar el pago.");
      setIsSubmitting(false);
    }
  }

  const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  return <>
    <Script src="https://checkout.wompi.co/widget.js" strategy="afterInteractive" />
    {googleMapsKey && <Script id="google-maps-places" src={`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(googleMapsKey)}&libraries=places&language=es&region=CO`} strategy="afterInteractive" onLoad={() => setMapsLoaded(true)} />}
    <form className="checkout-form" action={submit}>
      <label>Nombre completo<input name="name" required /></label><label>Teléfono<input name="phone" type="tel" required /></label>
      <label>Correo electrónico<input name="email" type="email" required /></label><label>Ciudad<input name="city" required /></label><label>Departamento<input name="department" required /></label>
      <label>Dirección<input ref={addressInputRef} name="address" required autoComplete="street-address" /></label>
      <input name="deliveryLat" type="hidden" /><input name="deliveryLng" type="hidden" />
      <label>Nota para entrega<textarea name="note" /></label><button className="primary-button wide" type="submit" disabled={!items.length || isSubmitting}>{isSubmitting ? "Preparando pago..." : "Pagar"}</button>{message && <p className="form-status">{message}</p>}
    </form>
  </>;
}
