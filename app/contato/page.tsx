"use client";

import { useState } from "react";
import { MessageCircle, Phone, Mail, Send } from "lucide-react";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Olá! Meu nome é *${form.name}*.\n\n${form.message}\n\nE-mail: ${form.email}${form.phone ? `\nTelefone: ${form.phone}` : ""}`
    );
    window.open(`https://wa.me/5545991517308?text=${text}`, "_blank");
  };

  const field: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    border: "1.5px solid var(--line)",
    borderRadius: 12,
    fontSize: 14,
    color: "var(--ink)",
    fontFamily: "var(--font-mono)",
    background: "white",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease",
  };

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
        {/* Header */}
        <section
          style={{
            background: "linear-gradient(135deg, #0f2d4a 0%, #1c9bd7 60%, #38b8f0 100%)",
            padding: "64px 24px",
          }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <p
              className="font-sans"
              style={{
                display: "inline-flex",
                background: "rgba(255,255,255,0.15)",
                color: "white",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "6px 16px",
                borderRadius: 999,
                marginBottom: 20,
              }}
            >
              Contato
            </p>
            <h1
              className="font-sans"
              style={{
                fontSize: "clamp(36px, 5vw, 56px)",
                fontWeight: 800,
                color: "white",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              Fale com a{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#7dd3f8" }}>
                Halten
              </span>
            </h1>
            <p
              style={{
                marginTop: 16,
                fontSize: 16,
                color: "rgba(255,255,255,0.8)",
                fontFamily: "var(--font-mono)",
                fontWeight: 300,
              }}
            >
              Atendimento comercial e técnico. Respondemos rapidamente no horário comercial.
            </p>
          </div>
        </section>

        {/* Content */}
        <section style={{ padding: "64px 24px" }}>
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              display: "grid",
              gap: 32,
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            }}
          >
            {/* Contact info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div
                style={{
                  background: "white",
                  borderRadius: 24,
                  border: "1px solid var(--line)",
                  padding: 28,
                  boxShadow: "0 4px 24px rgba(15,25,35,0.05)",
                }}
              >
                <p
                  className="font-sans"
                  style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", marginBottom: 20 }}
                >
                  Canais de atendimento
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <a
                    href="https://wa.me/5545991517308"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      textDecoration: "none",
                      padding: "14px 16px",
                      borderRadius: 16,
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "#22c55e",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <MessageCircle size={18} color="white" />
                    </div>
                    <div>
                      <p className="font-sans" style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", margin: 0 }}>
                        (45) 99151-7308
                      </p>
                      <p style={{ fontSize: 12, color: "#16a34a", fontFamily: "var(--font-mono)", margin: 0 }}>
                        WhatsApp · atendimento comercial
                      </p>
                    </div>
                  </a>

                  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 16, background: "var(--bg)" }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "var(--blue-light)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Phone size={18} color="var(--blue)" />
                    </div>
                    <div>
                      <p className="font-sans" style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", margin: 0 }}>
                        (45) 3197-2130
                      </p>
                      <p style={{ fontSize: 12, color: "var(--ink-dim)", fontFamily: "var(--font-mono)", margin: 0 }}>
                        Telefone fixo
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 16, background: "var(--bg)" }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "var(--blue-light)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Mail size={18} color="var(--blue)" />
                    </div>
                    <div>
                      <p className="font-sans" style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", margin: 0 }}>
                        contato@halten.ind.br
                      </p>
                      <p style={{ fontSize: 12, color: "var(--ink-dim)", fontFamily: "var(--font-mono)", margin: 0 }}>
                        E-mail comercial
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address + hours */}
              <div
                style={{
                  background: "var(--blue)",
                  borderRadius: 24,
                  padding: 28,
                  color: "white",
                }}
              >
                <p className="font-sans" style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>
                  Endereço
                </p>
                <p style={{ fontSize: 14, fontFamily: "var(--font-mono)", lineHeight: 1.7, margin: 0, opacity: 0.9 }}>
                  R. Alba Vieira, 653 — Cataratas
                  <br />
                  Cascavel, PR · 85818-630
                </p>
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.2)" }}>
                  <p className="font-sans" style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
                    Horário
                  </p>
                  <p style={{ fontSize: 14, fontFamily: "var(--font-mono)", opacity: 0.9, margin: 0 }}>
                    Segunda a sexta · 08:00 às 17:30
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div
              style={{
                background: "white",
                borderRadius: 24,
                border: "1px solid var(--line)",
                padding: 36,
                boxShadow: "0 4px 24px rgba(15,25,35,0.05)",
              }}
            >
              <p
                className="font-sans"
                style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}
              >
                Envie uma mensagem
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--ink-mid)",
                  fontFamily: "var(--font-mono)",
                  marginBottom: 28,
                  lineHeight: 1.6,
                }}
              >
                Preencha o formulário e enviaremos sua mensagem via WhatsApp.
              </p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink-mid)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", marginBottom: 6 }}>
                    Nome *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Seu nome completo"
                    style={field}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink-mid)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", marginBottom: 6 }}>
                    E-mail *
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="seu@email.com"
                    style={field}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink-mid)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", marginBottom: 6 }}>
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="(00) 00000-0000"
                    style={field}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink-mid)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", marginBottom: 6 }}>
                    Mensagem *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Descreva o que você precisa..."
                    style={{ ...field, resize: "vertical" }}
                  />
                </div>

                <button
                  type="submit"
                  className="font-sans"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    padding: "14px 24px",
                    borderRadius: 999,
                    background: "#22c55e",
                    color: "white",
                    fontSize: 15,
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    transition: "background 0.2s ease",
                  }}
                >
                  <Send size={16} />
                  Enviar via WhatsApp
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
