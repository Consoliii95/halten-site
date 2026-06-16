"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LayoutDashboard, Image as ImageIcon, Package, Settings, LogOut, User, Table2, MapPin, Link2, Menu, X } from "lucide-react";
import { logoutAction } from "./actions";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/templates", label: "Templates de Tabela", icon: Table2 },
  { href: "/admin/representantes", label: "Representantes", icon: MapPin },
  { href: "/admin/links", label: "Links", icon: Link2 },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

type Props = { userEmail: string };

export function AdminSidebar({ userEmail }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Fecha o drawer ao navegar entre páginas
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Trava o scroll do body enquanto o drawer está aberto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Topbar — só aparece no mobile (via CSS) */}
      <header className="admin-topbar">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menu"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "white", cursor: "pointer", flexShrink: 0 }}
        >
          <Menu size={20} />
        </button>
        <Link href="/admin/dashboard" style={{ display: "flex", alignItems: "center" }}>
          <Image src="/logo-white.svg" alt="Halten Admin" width={92} height={26} style={{ width: 92, height: "auto" }} />
        </Link>
      </header>

      {/* Overlay escuro atrás do drawer */}
      <div
        className={`admin-overlay${open ? " show" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      <aside
        className={`admin-sidebar${open ? " open" : ""}`}
        style={{
          width: 260,
          flexShrink: 0,
          background: "#0a1628",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
      {/* Logo */}
      <div
        style={{
          padding: "28px 24px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          position: "relative",
        }}
      >
        {/* Fechar — só no mobile */}
        <button
          type="button"
          className="admin-drawer-close"
          onClick={() => setOpen(false)}
          aria-label="Fechar menu"
          style={{ position: "absolute", top: 20, right: 16, width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: 9, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", cursor: "pointer" }}
        >
          <X size={18} />
        </button>
        <Link href="/admin/dashboard" style={{ display: "block" }}>
          <Image
            src="/logo-white.svg"
            alt="Halten Admin"
            width={110}
            height={32}
            style={{ width: 110, height: "auto" }}
          />
        </Link>
        <p
          style={{
            fontSize: 10,
            fontFamily: "var(--font-mono)",
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginTop: 8,
          }}
        >
          Painel Admin
        </p>
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/admin/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 10,
                fontSize: 13,
                fontFamily: "var(--font-mono)",
                fontWeight: active ? 600 : 400,
                color: active ? "white" : "rgba(255,255,255,0.45)",
                textDecoration: "none",
                background: active ? "rgba(28,155,215,0.2)" : "transparent",
                borderLeft: active
                  ? "3px solid var(--blue)"
                  : "3px solid transparent",
                transition: "all 0.15s ease",
              }}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Rodapé: usuário + logout */}
      <div
        style={{
          padding: "16px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {/* Usuário */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 14px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.04)",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "rgba(28,155,215,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <User size={14} color="var(--blue)" />
          </div>
          <p
            style={{
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              color: "rgba(255,255,255,0.5)",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {userEmail}
          </p>
        </div>

        {/* Logout */}
        <form action={logoutAction}>
          <button
            type="submit"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              borderRadius: 10,
              fontSize: 13,
              fontFamily: "var(--font-mono)",
              color: "rgba(255,255,255,0.35)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              width: "100%",
              transition: "color 0.15s ease",
            }}
          >
            <LogOut size={14} />
            Sair
          </button>
        </form>
      </div>
    </aside>
    </>
  );
}
