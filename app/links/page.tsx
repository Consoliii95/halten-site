import type { Metadata } from "next";
import Image from "next/image";
import { getSupabaseAdmin } from "../../lib/supabase";
import { LinkIcon } from "./link-icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Halten Abraçadeiras — Links",
  description: "Catálogo digital, aplicativo e canais oficiais da Halten Abraçadeiras.",
};

type LinkRow = {
  id: string;
  title: string;
  subtitle: string | null;
  icon: string | null;
  icon_url: string | null;
};

export default async function LinksPage() {
  const { data } = await getSupabaseAdmin()
    .from("links")
    .select("id, title, subtitle, icon, icon_url, position, active")
    .eq("active", true)
    .order("position", { ascending: true });

  const links = (data ?? []) as LinkRow[];

  return (
    <main
      style={{
        minHeight: "100dvh",
        width: "100%",
        background: "linear-gradient(180deg, #34b3e8 0%, #1c9bd7 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 20px 64px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth: 460, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Logo */}
        <Image
          src="/logo-white.svg"
          alt="Halten Abraçadeiras"
          width={170}
          height={48}
          priority
          style={{ width: 170, height: "auto", marginBottom: 40 }}
        />

        {/* Botões */}
        {links.length === 0 ? (
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              textAlign: "center",
            }}
          >
            Em breve.
          </p>
        ) : (
          <nav style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
            {links.map((link) => (
              <a
                key={link.id}
                href={link.icon === "catalogo" ? `/catalogo/${link.id}` : `/links/go/${link.id}`}
                className="hl-link-card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "16px 18px",
                  background: "#ffffff",
                  borderRadius: 16,
                  textDecoration: "none",
                  boxShadow: "0 2px 14px rgba(0,0,0,0.18)",
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LinkIcon icon={link.icon} iconUrl={link.icon_url} size={22} />
                </span>
                <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0, flex: 1 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-syne)",
                      fontWeight: 700,
                      fontSize: 15,
                      color: "#0a1628",
                      lineHeight: 1.25,
                    }}
                  >
                    {link.title}
                  </span>
                  {link.subtitle && (
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "#64748b",
                        lineHeight: 1.3,
                      }}
                    >
                      {link.subtitle}
                    </span>
                  )}
                </span>
              </a>
            ))}
          </nav>
        )}

        {/* Rodapé */}
        <p
          style={{
            marginTop: 48,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.7)",
            textAlign: "center",
          }}
        >
          © {new Date().getFullYear()} HALTEN ABRAÇADEIRAS
        </p>
      </div>

      <style>{`
        .hl-link-card { transition: transform .15s ease, box-shadow .15s ease; }
        .hl-link-card:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(0,0,0,0.28); }
        .hl-link-card:active { transform: scale(0.985); }
      `}</style>
    </main>
  );
}
