type IconProps = {
  name: string;
};

export function Icon({ name }: IconProps) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2.4,
  };

  if (name === "menu") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    );
  }

  if (name === "cart") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M6 6h15l-2 8H8L6 3H3" />
        <circle cx="9" cy="20" r="1.6" fill="currentColor" />
        <circle cx="18" cy="20" r="1.6" fill="currentColor" />
      </svg>
    );
  }

  if (name === "arrow" || name === "back") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {name === "back" ? (
          <path {...common} d="M19 12H5M11 6l-6 6 6 6" />
        ) : (
          <path {...common} d="M5 12h14M13 6l6 6-6 6" />
        )}
      </svg>
    );
  }

  if (name === "plus") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M12 5v14M5 12h14" />
      </svg>
    );
  }

  if (name === "minus") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M5 12h14" />
      </svg>
    );
  }

  if (name === "shield") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M12 3l7 3v5c0 4.5-2.8 8-7 10-4.2-2-7-5.5-7-10V6l7-3z" />
        <path {...common} d="M9 12l2 2 4-5" />
      </svg>
    );
  }

  if (name === "badge") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M12 3l2.2 3.2 3.8.8-.5 3.9L20 14l-3.2 2.2-.8 3.8-4-1.6L8 20l-.8-3.8L4 14l2.5-3.1L6 7l3.8-.8L12 3z" />
        <path {...common} d="M9 12l2 2 4-5" />
      </svg>
    );
  }

  if (name === "heart") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M20.8 5.8a5 5 0 0 0-7.1 0L12 7.5l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21l8.8-8.1a5 5 0 0 0 0-7.1z" />
      </svg>
    );
  }

  if (name === "truck") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" />
        <circle cx="7" cy="19" r="1.8" fill="currentColor" />
        <circle cx="18" cy="19" r="1.8" fill="currentColor" />
      </svg>
    );
  }

  if (name === "refresh") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M20 7v5h-5M4 17v-5h5" />
        <path {...common} d="M18 12a6 6 0 0 0-10.2-4.2L4 12m2 0a6 6 0 0 0 10.2 4.2L20 12" />
      </svg>
    );
  }

  if (name === "home") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" />
      </svg>
    );
  }

  if (name === "grid") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M5 5h6v6H5zM13 5h6v6h-6zM5 13h6v6H5zM13 13h6v6h-6z" />
      </svg>
    );
  }

  if (name === "user") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
      </svg>
    );
  }

  if (name === "phone") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z" />
      </svg>
    );
  }

  if (name === "lock") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect {...common} x="5" y="10" width="14" height="11" rx="2" />
        <path {...common} d="M8 10V7a4 4 0 0 1 8 0v3" />
      </svg>
    );
  }

  if (name === "box") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8" />
      </svg>
    );
  }

  return null;
}
