"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Loader2, AlertCircle, Upload, X, Link as LinkIconLucide } from "lucide-react";
import { LINK_ICON_OPTIONS, LinkIcon, type LinkIconKey } from "../../links/link-icons";

type LinkRow = {
  id?: string;
  title?: string | null;
  subtitle?: string | null;
  url?: string | null;
  icon?: string | null;
  icon_url?: string | null;
  active?: boolean | null;
};

type Props = {
  link?: LinkRow;
  action: (formData: FormData) => Promise<void>;
  isNew?: boolean;
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--ink-mid)",
  fontFamily: "var(--font-mono)",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  border: "1.5px solid var(--line)",
  borderRadius: 10,
  fontSize: 14,
  fontFamily: "var(--font-mono)",
  color: "var(--ink)",
  background: "white",
  outline: "none",
  boxSizing: "border-box",
};

export function LinkForm({ link, action, isNew }: Props) {
  const [icon, setIcon] = useState<LinkIconKey>((link?.icon as LinkIconKey) ?? "link");
  const [destFileName, setDestFileName] = useState<string | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(link?.icon_url ?? null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const destFileRef = useRef<HTMLInputElement>(null);
  const iconFileRef = useRef<HTMLInputElement>(null);

  function handleIconFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIconPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const fd = new FormData(e.currentTarget);
      fd.set("url_existing", link?.url ?? "");
      fd.set("icon_url_existing", link?.icon_url ?? "");
      await action(fd);
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "digest" in err &&
        typeof (err as { digest: string }).digest === "string" &&
        (err as { digest: string }).digest.startsWith("NEXT_")
      ) {
        throw err;
      }
      setError(err instanceof Error ? err.message : "Erro desconhecido ao salvar o link.");
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {error && (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "14px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10 }}>
          <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: "#dc2626", fontFamily: "var(--font-mono)", margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Título + Subtítulo */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
        <div>
          <label style={labelStyle}>Título *</label>
          <input name="title" required defaultValue={link?.title ?? ""} style={inputStyle} placeholder="Baixe o Catálogo Digital" />
        </div>
        <div>
          <label style={labelStyle}>Subtítulo (opcional)</label>
          <input name="subtitle" defaultValue={link?.subtitle ?? ""} style={inputStyle} placeholder="PDF · 21 páginas" />
        </div>
      </div>

      {/* Destino: link OU arquivo */}
      <div style={{ background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 12, padding: 18 }}>
        <label style={labelStyle}>Destino do botão</label>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <LinkIconLucide size={16} color="var(--ink-dim)" style={{ flexShrink: 0 }} />
          <input name="url" defaultValue={link?.url ?? ""} style={inputStyle} placeholder="https://wa.me/55... ou link da App Store / Google Play" />
        </div>

        <p style={{ fontSize: 11, color: "var(--ink-dim)", fontFamily: "var(--font-mono)", margin: "0 0 10px", textAlign: "center" }}>
          — ou envie um arquivo (o link é gerado automaticamente) —
        </p>

        <input
          ref={destFileRef}
          type="file"
          name="dest_file"
          accept="application/pdf,image/*"
          onChange={(e) => setDestFileName(e.target.files?.[0]?.name ?? null)}
          style={{ display: "none" }}
        />
        <button
          type="button"
          onClick={() => destFileRef.current?.click()}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10, border: "1.5px dashed var(--line)", background: "white", color: "var(--ink-mid)", fontSize: 13, fontFamily: "var(--font-mono)", cursor: "pointer" }}
        >
          <Upload size={15} />
          {destFileName ?? "Selecionar arquivo (PDF, imagem…)"}
        </button>
        {destFileName && (
          <button
            type="button"
            onClick={() => { setDestFileName(null); if (destFileRef.current) destFileRef.current.value = ""; }}
            style={{ marginLeft: 10, fontSize: 12, color: "var(--red)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-mono)" }}
          >
            remover
          </button>
        )}
      </div>

      {/* Seletor de ícone */}
      <div>
        <label style={labelStyle}>Ícone</label>
        <input type="hidden" name="icon" value={icon} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: 10 }}>
          {LINK_ICON_OPTIONS.map((opt) => {
            const selected = icon === opt.key;
            return (
              <button
                type="button"
                key={opt.key}
                onClick={() => setIcon(opt.key)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  padding: "12px 6px",
                  borderRadius: 10,
                  border: selected ? "2px solid var(--blue)" : "1.5px solid var(--line)",
                  background: selected ? "rgba(28,155,215,0.08)" : "white",
                  cursor: "pointer",
                }}
              >
                <span style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {opt.key === "custom" && iconPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={iconPreview} alt="" width={24} height={24} style={{ objectFit: "contain", borderRadius: 5 }} />
                  ) : (
                    <LinkIcon icon={opt.key === "custom" ? "link" : opt.key} size={22} />
                  )}
                </span>
                <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: selected ? "var(--blue)" : "var(--ink-dim)", textAlign: "center", lineHeight: 1.2 }}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Upload do ícone personalizado */}
        {icon === "custom" && (
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
            <input ref={iconFileRef} type="file" name="icon_file" accept="image/*" onChange={handleIconFile} style={{ display: "none" }} />
            {iconPreview && (
              <span style={{ position: "relative", width: 44, height: 44, borderRadius: 10, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={iconPreview} alt="" width={28} height={28} style={{ objectFit: "contain" }} />
                <button type="button" onClick={() => { setIconPreview(null); if (iconFileRef.current) iconFileRef.current.value = ""; }} style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: "#0a1628", border: "none", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <X size={11} />
                </button>
              </span>
            )}
            <button type="button" onClick={() => iconFileRef.current?.click()} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 10, border: "1.5px dashed var(--line)", background: "white", color: "var(--ink-mid)", fontSize: 12, fontFamily: "var(--font-mono)", cursor: "pointer" }}>
              <Upload size={14} />
              {iconPreview ? "Trocar ícone" : "Enviar ícone (PNG/SVG)"}
            </button>
          </div>
        )}
      </div>

      {/* Status */}
      <div>
        <label style={labelStyle}>Status</label>
        <select name="active" defaultValue={String(link?.active ?? true)} style={inputStyle}>
          <option value="true">Ativo — visível em /links</option>
          <option value="false">Inativo — oculto</option>
        </select>
      </div>

      {/* Botões */}
      <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
        <button
          type="submit"
          disabled={isPending}
          className="font-sans"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 999, background: isPending ? "#94a3b8" : "var(--blue)", color: "white", fontSize: 14, fontWeight: 700, border: "none", cursor: isPending ? "not-allowed" : "pointer" }}
        >
          {isPending && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
          {isPending ? "Salvando…" : isNew ? "Criar Link" : "Salvar Alterações"}
        </button>
        <Link href="/admin/links" className="font-sans" style={{ padding: "12px 24px", borderRadius: 999, border: "1.5px solid var(--line)", color: "var(--ink-mid)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
          Cancelar
        </Link>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}
