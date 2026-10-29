import Link from "next/link";
import { Icon } from "@/components/ui/icon";

type AppHeaderProps = {
  title?: string;
  backHref?: string;
  cartAsHome?: boolean;
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
        <Link className="brand-pill brand-welcome" href="/" aria-label="Ir al inicio">
          Bienvenidos
        </Link>
      )}
      <span className="app-header-spacer" aria-hidden />
    </header>
  );
}
