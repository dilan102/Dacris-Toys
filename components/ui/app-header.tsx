import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { CartLink } from "@/components/ui/cart-link";

type AppHeaderProps = {
  title?: string;
  backHref?: string;
};

export function AppHeader({ title, backHref = "/" }: AppHeaderProps) {
  return (
    <header className="app-header">
      <Link className="icon-button light" href={backHref} aria-label="Volver">
        <Icon name={title ? "back" : "menu"} />
      </Link>
      {title ? (
        <strong>{title}</strong>
      ) : (
        <Link className="brand-pill" href="/" aria-label="Ir al inicio">
          <Image
            src="/Dacris-Logo.png"
            alt="Dacri's Toys"
            width={1536}
            height={1024}
            priority
          />
        </Link>
      )}
      <CartLink />
    </header>
  );
}
