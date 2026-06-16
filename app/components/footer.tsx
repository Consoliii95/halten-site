import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Início", href: "/" },
  { label: "Produtos", href: "/produtos" },
  { label: "Quem Somos", href: "/quem-somos" },
  { label: "Contato", href: "/contato" },
];

export function Footer() {
  return (
    <footer style={{ background: "#0f1923" }}>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "64px 32px 0",
        }}
      >
        {/* Grid principal */}
        <div
          style={{
            display: "grid",
            gap: 48,
            gridTemplateColumns: "2fr 1fr 1.4fr 1.4fr",
            paddingBottom: 48,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
          className="footer-grid"
        >
          {/* Marca */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <Image src="/logo-240-60.svg" alt="Halten Abraçadeiras" width={180} height={45} style={{ width: "auto", height: 45 }} />
            </div>
            <p
              style={{
                fontSize: 13,
                fontFamily: "var(--font-mono)",
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.75,
                margin: "0 0 20px",
                maxWidth: 280,
              }}
            >
              Soluções industriais em abraçadeiras com qualidade e desempenho para sua empresa.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.1)" }}>
              <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
                CNPJ
              </span>
              <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.55)", letterSpacing: "0.04em" }}>
                43.453.407/0001-87
              </span>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {/* WhatsApp */}
              <a
                href="https://wa.me/5545991517308"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="social-btn"
                style={{ width: 40, height: 40, borderRadius: 10, background: "var(--blue)", display: "grid", placeItems: "center", color: "white", textDecoration: "none", transition: "background 0.2s, color 0.2s", flexShrink: 0 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/haltenabracadeiras/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="social-btn"
                style={{ width: 40, height: 40, borderRadius: 10, background: "var(--blue)", display: "grid", placeItems: "center", color: "white", textDecoration: "none", transition: "background 0.2s, color 0.2s", flexShrink: 0 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navegação */}
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                fontFamily: "var(--font-mono)",
                margin: "0 0 18px",
              }}
            >
              Navegação
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contato */}
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                fontFamily: "var(--font-mono)",
                margin: "0 0 18px",
              }}
            >
              Contato
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)", margin: "0 0 3px", letterSpacing: "0.06em" }}>
                  E-mail
                </p>
                <a
                  href="mailto:contato@halten.ind.br"
                  style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-mono)", textDecoration: "none" }}
                >
                  contato@halten.ind.br
                </a>
              </div>
              <div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)", margin: "0 0 3px", letterSpacing: "0.06em" }}>
                  WhatsApp
                </p>
                <a
                  href="https://wa.me/5545991517308"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-mono)", textDecoration: "none" }}
                >
                  (45) 99151-7308
                </a>
              </div>
              <div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)", margin: "0 0 3px", letterSpacing: "0.06em" }}>
                  Telefone
                </p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-mono)", margin: 0 }}>
                  (45) 3197-2130
                </p>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                fontFamily: "var(--font-mono)",
                margin: "0 0 18px",
              }}
            >
              Localização
            </p>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.75)",
                fontFamily: "var(--font-mono)",
                lineHeight: 1.8,
                margin: "0 0 16px",
              }}
            >
              R. Alba Vieira, 653
              <br />
              Cataratas — Cascavel/PR
              <br />
              CEP 85818-630
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                borderRadius: 999,
                background: "rgba(28,155,215,0.15)",
                border: "1px solid rgba(28,155,215,0.25)",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#1c9bd7",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "rgba(28,155,215,0.9)" }}>
                Seg – Sex · 08:00 às 18:00
              </span>
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div
          style={{
            padding: "20px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <p
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.22)",
              fontFamily: "var(--font-mono)",
              margin: 0,
              letterSpacing: "0.06em",
            }}
          >
            © {new Date().getFullYear()} Halten Abraçadeiras · Todos os direitos reservados
          </p>
          <a
            href="https://wa.me/5545991250788?text=Ol%C3%A1%20vi%20seu%20projeto%20da%20Halten%2C%20gostaria%20de%20falar%20sobre%3A"
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "rgba(255,255,255,0.18)",
              letterSpacing: "0.06em",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            className="dev-credit"
          >
            Desenvolvido por Consoli Web Designer
          </a>
        </div>
      </div>

      <style>{`
        .social-btn:hover { background: white !important; color: var(--blue) !important; }
        .dev-credit:hover { color: rgba(255,255,255,0.45) !important; }
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 540px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
