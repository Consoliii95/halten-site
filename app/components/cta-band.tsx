const WA_LINK = "https://wa.me/5545991517308";

export function CtaBand() {
  return (
    <section
      id="contato"
      style={{
        background: "var(--ink)",
        padding: "120px 0",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Glow radial */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(60% 80% at 50% 0%, rgba(28,155,215,0.15), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 32px",
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
        className="ctaband-wrap"
      >
        {/* Left — heading */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--blue)",
              marginBottom: 18,
            }}
          >
            [ 05 — Atendimento técnico ]
          </p>
          <h2
            className="font-sans"
            style={{
              fontSize: "clamp(44px,6vw,90px)",
              fontWeight: 700,
              lineHeight: 0.92,
              letterSpacing: "-0.035em",
              color: "white",
              margin: 0,
            }}
          >
            Vamos{" "}
            <em style={{ fontStyle: "italic", color: "var(--blue)" }}>apertar</em>
            <br />seu próximo
            <br />projeto?
          </h2>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.7)",
              marginTop: 24,
              maxWidth: 480,
            }}
          >
            Fale com nosso time de engenharia. Respondemos com proposta técnica em até 24h úteis — incluindo desenho dimensional e amostra para validação em linha.
          </p>
          <div style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href="/contato"
              className="font-sans"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                height: 46,
                padding: "0 22px",
                borderRadius: 10,
                background: "var(--blue)",
                color: "white",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                textDecoration: "none",
                fontWeight: 500,
                boxShadow: "0 12px 28px -12px rgba(28,155,215,0.55)",
              }}
            >
              Solicitar orçamento
            </a>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noreferrer"
              className="font-sans"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                height: 46,
                padding: "0 22px",
                borderRadius: 10,
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "white",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>

        {/* Right — contact card */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 18,
            padding: 36,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.18em",
              color: "var(--blue)",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Canais diretos
          </p>
          <h3
            className="font-sans"
            style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", color: "white", marginBottom: 24 }}
          >
            Halten Cascavel/PR
          </h3>

          {[
            {
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>
                </svg>
              ),
              label: "E-MAIL",
              value: "contato@halten.ind.br",
              href: "mailto:contato@halten.ind.br",
            },
            {
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.4 8.4 0 0 1-1.3 4.5L21 22l-6.1-1.6A8.5 8.5 0 1 1 21 11.5z"/>
                </svg>
              ),
              label: "WHATSAPP COMERCIAL",
              value: "(45) 99151-7308",
              href: WA_LINK,
            },
            {
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/>
                </svg>
              ),
              label: "TELEFONE",
              value: "(45) 3197-2130",
              href: "tel:+554531972130",
            },
            {
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              ),
              label: "FÁBRICA",
              value: "R. Alba Vieira, 653 — Cascavel/PR",
              href: "https://maps.google.com/?q=R.+Alba+Vieira+653+Cascavel+PR",
            },
          ].map((item, i, arr) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 0",
                borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 9,
                  background: "rgba(28,155,215,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--blue)",
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <div>
                <small
                  style={{
                    display: "block",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "rgba(255,255,255,0.45)",
                    letterSpacing: "0.1em",
                    marginBottom: 3,
                  }}
                >
                  {item.label}
                </small>
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  className="font-sans"
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "white",
                    letterSpacing: "-0.01em",
                    textDecoration: "none",
                  }}
                >
                  {item.value}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .ctaband-wrap { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  );
}
