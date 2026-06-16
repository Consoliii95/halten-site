import Link from "next/link";
import { Plus, Pencil, Eye, ChevronUp, ChevronDown, ExternalLink } from "lucide-react";
import { getSupabaseAdmin } from "../../../lib/supabase";
import { LinkIcon } from "../../links/link-icons";
import { deleteLink, toggleLinkActive, moveLink } from "./actions";

export const dynamic = "force-dynamic";

type LinkRow = {
  id: string;
  title: string;
  subtitle: string | null;
  url: string | null;
  icon: string | null;
  icon_url: string | null;
  clicks: number | null;
  active: boolean;
};

export default async function LinksPage() {
  const { data } = await getSupabaseAdmin()
    .from("links")
    .select("*")
    .order("position", { ascending: true });

  const links = (data ?? []) as LinkRow[];

  return (
    <div style={{ padding: "var(--admin-pad)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 className="font-sans" style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)", margin: 0 }}>
            Links
          </h1>
          <p style={{ fontSize: 13, color: "var(--ink-mid)", fontFamily: "var(--font-mono)", marginTop: 4 }}>
            {links.length} {links.length === 1 ? "link" : "links"} · página pública:{" "}
            <a href="/links" target="_blank" rel="noreferrer" style={{ color: "var(--blue)", textDecoration: "none" }}>
              /links <ExternalLink size={11} style={{ display: "inline", verticalAlign: "middle" }} />
            </a>
          </p>
        </div>
        <Link
          href="/admin/links/novo"
          className="font-sans"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 999, background: "var(--blue)", color: "white", fontSize: 13, fontWeight: 600, textDecoration: "none" }}
        >
          <Plus size={15} />
          Novo Link
        </Link>
      </div>

      <div className="admin-table-card" style={{ background: "white", borderRadius: 16, border: "1px solid var(--line)", boxShadow: "0 2px 12px rgba(15,25,35,0.04)" }}>
        {links.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--ink-dim)", fontFamily: "var(--font-mono)", fontSize: 14 }}>
            Nenhum link cadastrado.{" "}
            <Link href="/admin/links/novo" style={{ color: "var(--blue)" }}>Criar o primeiro</Link>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--line)", background: "var(--bg)" }}>
                {["Ordem", "Ícone", "Título", "Cliques", "Status", "Ações"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-dim)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {links.map((l, i) => (
                <tr key={l.id} style={{ borderBottom: i < links.length - 1 ? "1px solid var(--line-soft)" : "none" }}>
                  {/* Ordem — setas */}
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <form action={moveLink.bind(null, l.id, "up")}>
                        <button type="submit" disabled={i === 0} title="Subir" style={arrowStyle(i === 0)}>
                          <ChevronUp size={15} />
                        </button>
                      </form>
                      <form action={moveLink.bind(null, l.id, "down")}>
                        <button type="submit" disabled={i === links.length - 1} title="Descer" style={arrowStyle(i === links.length - 1)}>
                          <ChevronDown size={15} />
                        </button>
                      </form>
                    </div>
                  </td>

                  {/* Ícone */}
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ width: 40, height: 40, borderRadius: 10, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <LinkIcon icon={l.icon} iconUrl={l.icon_url} size={20} />
                    </span>
                  </td>

                  {/* Título + subtítulo + destino */}
                  <td style={{ padding: "12px 16px", maxWidth: 320 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", margin: 0, fontFamily: "var(--font-mono)" }}>
                      {l.title}
                    </p>
                    {l.subtitle && (
                      <p style={{ fontSize: 12, color: "var(--ink-dim)", margin: "2px 0 0", fontFamily: "var(--font-mono)" }}>{l.subtitle}</p>
                    )}
                    {l.url && (
                      <p style={{ fontSize: 11, color: "var(--ink-mute)", margin: "2px 0 0", fontFamily: "var(--font-mono)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {l.url}
                      </p>
                    )}
                  </td>

                  {/* Cliques */}
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--ink-mid)" }}>
                      <Eye size={14} color="var(--ink-dim)" />
                      {l.clicks ?? 0}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: "12px 16px" }}>
                    <form action={toggleLinkActive.bind(null, l.id, l.active)}>
                      <button type="submit" style={{ fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 600, padding: "4px 12px", borderRadius: 999, border: "none", cursor: "pointer", background: l.active ? "#dcfce7" : "#fee2e2", color: l.active ? "#166534" : "#991b1b" }}>
                        {l.active ? "Ativo" : "Inativo"}
                      </button>
                    </form>
                  </td>

                  {/* Ações */}
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Link href={`/admin/links/${l.id}`} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 8, border: "1px solid var(--line)", fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--ink)", textDecoration: "none" }}>
                        <Pencil size={12} />
                        Editar
                      </Link>
                      <form action={deleteLink.bind(null, l.id)}>
                        <button type="submit" style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #fecaca", background: "#fff5f5", fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--red)", cursor: "pointer" }}>
                          Excluir
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function arrowStyle(disabled: boolean): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 26,
    height: 22,
    borderRadius: 6,
    border: "1px solid var(--line)",
    background: disabled ? "var(--bg)" : "white",
    color: disabled ? "var(--ink-mute)" : "var(--ink-mid)",
    cursor: disabled ? "not-allowed" : "pointer",
  };
}
