import { createHash, timingSafeEqual } from "crypto";

export function wompiIntegrity(reference: string, amountInCents: number, currency = "COP") {
  const secret = process.env.WOMPI_INTEGRITY_SECRET;
  if (!secret) throw new Error("Falta WOMPI_INTEGRITY_SECRET.");
  return createHash("sha256").update(`${reference}${amountInCents}${currency}${secret}`).digest("hex");
}

function atPath(value: unknown, path: string) {
  return path.split(".").reduce<unknown>((current, key) => current && typeof current === "object" ? (current as Record<string, unknown>)[key] : undefined, value);
}

export function verifyWompiEvent(payload: Record<string, unknown>, checksum?: string | null) {
  const signature = payload.signature as { properties?: string[]; checksum?: string } | undefined;
  const secret = process.env.WOMPI_EVENTS_SECRET;
  if (!secret || !signature?.properties?.length) return false;
  const base = signature.properties.map((path) => String(atPath(payload.data, path) ?? "")).join("");
  const expected = createHash("sha256").update(`${base}${payload.timestamp}${secret}`).digest("hex");
  const received = checksum ?? signature.checksum;
  return Boolean(received) && received.length === expected.length && timingSafeEqual(Buffer.from(received), Buffer.from(expected));
}
