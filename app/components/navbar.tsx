"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Produtos" },
  { href: "/quem-somos", label: "Quem somos" },
  { href: "/representantes", label: "Representantes" },
  { href: "/localizacao", label: "Localização" },
  { href: "/contato", label: "Contato" },
];

const WA_LINK = "https://wa.me/5545991517308";

export function Navbar() {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          height: 78,
          background: "rgba(15,25,35,0.88)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Grid 3 colunas: logo | nav centralizada | botões */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            maxWidth: 1440,
            margin: "0 auto",
            padding: "0 32px",
            height: "100%",
          }}
        >
          {/* Coluna esquerda — Logo */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link href="/" style={{ display: "inline-flex", lineHeight: 0, textDecoration: "none" }}>
              <Image
                src="/logo-240-60.svg"
                alt="Halten Abraçadeiras"
                width={240}
                height={60}
                priority
                style={{ width: "auto", height: 60 }}
              />
            </Link>
          </div>

          {/* Coluna central — Nav */}
          <nav
            className="hidden md:flex items-center"
            style={{
              gap: 4,
              opacity: searchOpen ? 0 : 1,
              pointerEvents: searchOpen ? "none" : "auto",
              transition: "opacity 0.25s ease",
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.78)",
                  textDecoration: "none",
                  fontFamily: "var(--font-mono)",
                  whiteSpace: "nowrap",
                  transition: "color 0.15s, background 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "white";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.78)";
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Coluna direita — Search expandível + Atendimento */}
          <div
            className="hidden md:flex items-center"
            style={{ gap: 10, justifyContent: "flex-end" }}
          >
            {/*
              Search: container único que expande.
              Fechado: 46×46, só ícone.
              Aberto: ~260px, ícone + input + X — mesmo formato do botão Atendimento.
            */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: 46,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.04)",
                overflow: "hidden",
                width: searchOpen ? 260 : 46,
                transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)",
                flexShrink: 0,
              }}
            >
              {/* Ícone lupa — clicável quando fechado */}
              <button
                type="button"
                onClick={() => !searchOpen && setSearchOpen(true)}
                aria-label="Buscar"
                style={{
                  flexShrink: 0,
                  width: 46,
                  height: 46,
                  border: "none",
                  background: "none",
                  cursor: searchOpen ? "default" : "pointer",
                  color: "rgba(255,255,255,0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Search size={17} />
              </button>

              {/* Input — aparece quando open */}
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") closeSearch();
                  if (e.key === "Enter" && searchQuery.trim()) {
                    router.push(`/produtos?q=${encodeURIComponent(searchQuery.trim())}`);
                    closeSearch();
                  }
                }}
                placeholder="Buscar produto..."
                aria-hidden={!searchOpen}
                style={{
                  flex: 1,
                  border: "none",
                  background: "transparent",
                  color: "white",
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  outline: "none",
                  padding: "0",
                  opacity: searchOpen ? 1 : 0,
                  transition: "opacity 0.2s ease",
                  minWidth: 0,
                }}
              />

              {/* X — fechar */}
              {searchOpen && (
                <button
                  type="button"
                  onClick={closeSearch}
                  aria-label="Fechar busca"
                  style={{
                    flexShrink: 0,
                    width: 40,
                    height: 46,
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.55)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Atendimento CTA */}
            <a
              href={WA_LINK}
              target="_blank"
              rel="noreferrer"
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
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/>
              </svg>
              Atendimento
            </a>
          </div>

          {/* Mobile right */}
          <div
            className="flex md:hidden items-center"
            style={{ justifyContent: "flex-end", gap: 8, gridColumn: 3 }}
          >
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Abrir menu"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 38,
                height: 38,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "white",
              }}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Overlay drawer */}
      <div
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 60,
          background: "rgba(0,0,0,0.55)",
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Mobile drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 70,
          width: 280,
          background: "#0a1219",
          boxShadow: "-4px 0 40px rgba(0,0,0,0.4)",
          transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          display: "flex",
          flexDirection: "column",
          padding: "20px 24px 32px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
          <Link href="/" onClick={() => setDrawerOpen(false)} style={{ lineHeight: 0 }}>
            <Image src="/logo-240-60.svg" alt="Halten" width={140} height={35} style={{ width: "auto", height: 35 }} />
          </Link>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Fechar menu"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, border: "none", background: "transparent", cursor: "pointer", color: "rgba(255,255,255,0.7)" }}
          >
            <X size={20} />
          </button>
        </div>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setDrawerOpen(false)}
              style={{ fontSize: 16, fontWeight: 500, color: "rgba(255,255,255,0.78)", textDecoration: "none", padding: "14px 4px", borderBottom: "1px solid rgba(255,255,255,0.07)", fontFamily: "var(--font-mono)" }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={WA_LINK}
          target="_blank"
          rel="noreferrer"
          onClick={() => setDrawerOpen(false)}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 20px", borderRadius: 10, background: "var(--blue)", color: "white", fontSize: 13, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textDecoration: "none", marginTop: 24, textTransform: "uppercase" }}
        >
          Atendimento
        </a>
      </div>
    </>
  );
}
