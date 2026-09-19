import Link from "next/link";
import { logoutAction } from "@/app/perfil/actions";
import { AppHeader } from "@/components/ui/app-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Icon } from "@/components/ui/icon";
import { getSessionUser } from "@/lib/auth";
import { formatPrice } from "@/lib/catalog";
import { getFavoriteProducts } from "@/lib/favorites";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/product/product-card";

const statusMessages: Record<string, string> = {
  "cuenta-creada": "Cuenta creada correctamente.",
};

type ProfilePageProps = {
  searchParams: Promise<{ estado?: string }>;
};

type CustomerOrder = {
  id: string;
  reference: string;
  created_at: string;
  total: number | string;
  status: "pending" | "paid" | "failed" | "cancelled";
};

const orderStatusLabels: Record<CustomerOrder["status"], string> = {
  pending: "Pendiente",
  paid: "Pagado",
  failed: "Fallido",
  cancelled: "Cancelado",
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const session = await getSessionUser();
  const { estado } = await searchParams;
  const statusMessage = estado ? statusMessages[estado] : null;
  let orders: CustomerOrder[] = [];
  const favoriteProducts = session?.role === "customer" ? await getFavoriteProducts() : [];

  if (session?.role === "customer") {
    const supabase = createSupabaseServerClient();

    if (supabase) {
      const { data, error } = await supabase
        .from("orders")
        .select("id,reference,created_at,total,status")
        .eq("customer_username", session.username)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("No se pudo leer el historial de pedidos:", error.message);
      } else {
        orders = (data ?? []) as CustomerOrder[];
      }
    }
  }

  return (
    <main className="site-shell inner-page">
      <AppHeader title="Perfil" />
      <section className="content-wrap profile-layout">
        <div className="page-intro">
          <h1>Tu perfil</h1>
          <p>Consulta tu cuenta, pedidos y acceso administrativo.</p>
        </div>

        {statusMessage ? <p className="form-status">{statusMessage}</p> : null}

        {session ? (
          <article className="info-card login-card">
            <div className="soft-icon heart">
              <Icon name="user" />
            </div>
            <h2>{session.username}</h2>
            <p>{session.role === "admin" ? "Modo administrador activo." : "Cuenta de cliente activa."}</p>
            <form action={logoutAction} className="login-actions">
              {session.role === "admin" ? (
                <Link className="secondary-button filled" href="/admin">
                  Panel administrativo
                </Link>
              ) : null}
              <button className="secondary-button outline" type="submit">
                Cerrar sesión
              </button>
            </form>
          </article>
        ) : (
          <article className="info-card login-card">
            <div className="soft-icon heart">
              <Icon name="user" />
            </div>
            <h2>Invitado</h2>
            <p>Estás navegando sin iniciar sesión.</p>
            <div className="login-actions">
              <Link className="secondary-button filled" href="/acceso">
                Iniciar sesión
              </Link>
              <Link className="secondary-button outline" href="/acceso">
                Crear cuenta
              </Link>
            </div>
          </article>
        )}

        <section className="profile-grid">
          {session?.role === "customer" ? (
            <article className="info-card profile-box">
              <Icon name="box" />
              <h2>Pedidos</h2>
              {orders.length > 0 ? (
                <ul>
                  {orders.map((order) => (
                    <li key={order.id}>
                      <strong>{order.reference}</strong> · {new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(new Date(order.created_at))} · {formatPrice(Number(order.total))} · {orderStatusLabels[order.status]}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Aún no tienes pedidos.</p>
              )}
            </article>
          ) : null}
          <article className="info-card profile-box">
            <Icon name="truck" />
            <h2>Direcciones</h2>
            <p>Guarda una dirección frecuente para comprar más rápido.</p>
          </article>
          {session?.role === "customer" ? (
            <article className="info-card profile-box profile-favorites">
              <Icon name="heart" />
              <h2>Favoritos</h2>
              {favoriteProducts.length > 0 ? (
                <div className="product-grid">
                  {favoriteProducts.map((product) => (
                    <ProductCard isFavorite product={product} key={product.id} />
                  ))}
                </div>
              ) : (
                <p>Aún no tienes productos favoritos.</p>
              )}
            </article>
          ) : null}
        </section>

        {session?.role === "admin" ? (
          <Link className="admin-link" href="/admin">
            Entrar al panel administrativo
          </Link>
        ) : null}
      </section>
      <BottomNav active="perfil" alwaysVisible />
    </main>
  );
}
