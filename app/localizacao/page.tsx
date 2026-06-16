import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";

const INFO = [
  {
    label: "Endereço",
    lines: ["R. Alba Vieira, 653 — Cataratas", "Cascavel, PR · CEP 85818-630"],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 10c0 6-8 13-8 13S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    label: "Telefone",
    lines: ["(45) 3197-2130", "(45) 99151-7308 · WhatsApp"],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/>
      </svg>
    ),
  },
  {
    label: "E-mail",
    lines: ["contato@halten.ind.br"],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
  },
  {
    label: "Horário de atendimento",
    lines: ["Segunda a sexta · 08:00 às 18:00"],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
];

export default function LocationPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero header */}
        <section style={{ background: "var(--ink)", padding: "96px 32px 80px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                marginBottom: 20,
              }}
            >
              [ Localização ]
            </p>
            <h1
              className="font-sans"
              style={{
                fontSize: "clamp(48px,6vw,80px)",
                fontWeight: 700,
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                color: "white",
                margin: 0,
              }}
            >
              Estamos em{" "}
              <em style={{ fontStyle: "italic", color: "var(--blue)" }}>Cascavel/PR.</em>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 14,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.55)",
                maxWidth: 480,
                marginTop: 20,
              }}
            >
              Venha nos visitar ou entre em contato para agendar uma visita técnica.
            </p>
          </div>
        </section>

        {/* Conteúdo */}
        <section style={{ background: "var(--paper)", padding: "80px 32px 120px" }}>
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1.6fr",
              gap: 48,
              alignItems: "start",
            }}
            className="loc-wrap"
          >
            {/* Info cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {INFO.map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: "white",
                    borderRadius: 16,
                    border: "1px solid rgba(15,25,35,0.06)",
                    padding: "24px 28px",
                    display: "flex",
                    gap: 18,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: "rgba(28,155,215,0.10)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--blue)",
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "var(--blue)",
                        marginBottom: 6,
                        margin: "0 0 6px",
                      }}
                    >
                      {item.label}
                    </p>
                    {item.lines.map((line, i) => (
                      <p
                        key={i}
                        className={i === 0 ? "font-sans" : undefined}
                        style={{
                          fontSize: i === 0 ? 15 : 13,
                          fontWeight: i === 0 ? 600 : 400,
                          fontFamily: i === 0 ? undefined : "var(--font-mono)",
                          color: i === 0 ? "var(--ink)" : "rgba(15,25,35,0.55)",
                          margin: 0,
                          lineHeight: 1.6,
                        }}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Mapa */}
            <div
              style={{
                borderRadius: 20,
                overflow: "hidden",
                border: "1px solid rgba(15,25,35,0.06)",
                boxShadow: "0 20px 60px -20px rgba(15,25,35,0.15)",
                height: 520,
              }}
            >
              <iframe
                title="Localização Halten Abraçadeiras"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3765!2d-53.4007868!3d-24.957148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f3d5ebc7600681:0x29b1524dc2f68e56!2sHalten+Abra%C3%A7adeiras!5e0!3m2!1spt-BR!2sbr!4v1748873600000!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <style>{`
        @media (max-width: 860px) {
          .loc-wrap { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
