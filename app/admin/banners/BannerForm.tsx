"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { X, ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { uploadDirect } from "../upload-client";

type Banner = {
  id?: string;
  title?: string | null;
  subtitle?: string | null;
  cta_text?: string | null;
  cta_link?: string | null;
  image_url?: string | null;
  position?: number | null;
  active?: boolean | null;
};

type Props = {
  banner?: Banner;
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

export function BannerForm({ banner, action, isNew }: Props) {
  const [preview, setPreview] = useState<string | null>(banner?.image_url ?? null);
  const [hasNewFile, setHasNewFile] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setHasNewFile(true);
  }

  function clearImage() {
    setPreview(null);
    setHasNewFile(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const fd = new FormData(e.currentTarget);
      const imageFile = fileRef.current?.files?.[0];

      // A imagem vai direto do navegador para o Storage; a Server Action recebe
      // só a URL (o corpo da requisição precisa ficar abaixo de 4.5 MB).
      fd.delete("image_file");

      let imageUrl = banner?.image_url ?? "";
      if (hasNewFile && imageFile && imageFile.size > 0) {
        setProgress(0);
        imageUrl = await uploadDirect(imageFile, "banners", setProgress);
        setProgress(null);
      }
      fd.set("image_url_existing", imageUrl);

      await action(fd);

      // Se chegar aqui sem redirect, já terminou (raro)
    } catch (err: unknown) {
      console.error("[BannerForm] Erro ao salvar banner:", err);

      // Re-lança erros internos do Next.js (redirect, notFound)
      if (
        err &&
        typeof err === "object" &&
        "digest" in err &&
        typeof (err as { digest: string }).digest === "string" &&
        (err as { digest: string }).digest.startsWith("NEXT_")
      ) {
        throw err;
      }

      const message =
        err instanceof Error ? err.message : "Erro desconhecido ao salvar banner.";
      setError(message);
      setProgress(null);
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Erro visível */}
      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            padding: "14px 16px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 10,
          }}
        >
          <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#dc2626", fontFamily: "var(--font-mono)", margin: 0 }}>
              Erro ao salvar banner
            </p>
            <p style={{ fontSize: 12, color: "#dc2626", fontFamily: "var(--font-mono)", margin: "4px 0 0", opacity: 0.8 }}>
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Upload de imagem */}
      <div>
        <label style={labelStyle}>Imagem do Banner</label>

        <input
          ref={fileRef}
          type="file"
          name="image_file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {preview ? (
          <div style={{ marginTop: 8 }}>
            <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
              <img
                src={preview}
                alt="Preview do banner"
                style={{
                  width: "100%",
                  maxHeight: 220,
                  objectFit: "cover",
                  borderRadius: 10,
                  border: "1.5px solid var(--line)",
                  display: "block",
                }}
              />
              <button
                type="button"
                onClick={clearImage}
                title="Remover imagem"
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.65)",
                  border: "none",
                  cursor: "pointer",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={15} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              style={{
                marginTop: 8,
                fontSize: 12,
                color: "var(--blue)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
                padding: 0,
              }}
            >
              Trocar imagem
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            style={{
              marginTop: 8,
              width: "100%",
              padding: "40px 20px",
              border: "2px dashed var(--line)",
              borderRadius: 10,
              cursor: "pointer",
              background: "var(--bg)",
              color: "var(--ink-dim)",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <ImageIcon size={28} color="var(--ink-mute)" />
            <span>Clique para selecionar imagem</span>
            <span style={{ fontSize: 11, color: "var(--ink-mute)" }}>
              JPG, PNG, WebP
            </span>
          </button>
        )}

        {progress !== null && (
          <div style={{ marginTop: 12 }}>
            <div style={{ height: 6, borderRadius: 999, background: "var(--line)", overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: "var(--blue)", transition: "width 0.2s ease" }} />
            </div>
            <p style={{ fontSize: 11, color: "var(--ink-dim)", fontFamily: "var(--font-mono)", margin: "6px 0 0" }}>
              Enviando imagem… {progress}%
            </p>
          </div>
        )}
      </div>

      {/* Título + Subtítulo */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
        <div>
          <label style={labelStyle}>Título</label>
          <input
            name="title"
            defaultValue={banner?.title ?? ""}
            style={inputStyle}
            placeholder="Halten Abraçadeiras"
          />
        </div>
        <div>
          <label style={labelStyle}>Subtítulo</label>
          <input
            name="subtitle"
            defaultValue={banner?.subtitle ?? ""}
            style={inputStyle}
            placeholder="Soluções industriais"
          />
        </div>
      </div>

      {/* CTA + Link + Posição */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
        <div>
          <label style={labelStyle}>Texto do botão (CTA)</label>
          <input
            name="cta_text"
            defaultValue={banner?.cta_text ?? ""}
            style={inputStyle}
            placeholder="Ver produtos"
          />
        </div>
        <div>
          <label style={labelStyle}>Link do botão</label>
          <input
            name="cta_link"
            defaultValue={banner?.cta_link ?? ""}
            style={inputStyle}
            placeholder="/produtos"
          />
        </div>
        <div>
          <label style={labelStyle}>Posição (ordem)</label>
          <input
            name="position"
            type="number"
            defaultValue={banner?.position ?? 0}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Status */}
      <div>
        <label style={labelStyle}>Status</label>
        <select name="active" defaultValue={String(banner?.active ?? true)} style={inputStyle}>
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </select>
      </div>

      {/* Botões */}
      <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
        <button
          type="submit"
          disabled={isPending}
          className="font-sans"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 28px",
            borderRadius: 999,
            background: isPending ? "#94a3b8" : "var(--blue)",
            color: "white",
            fontSize: 14,
            fontWeight: 700,
            border: "none",
            cursor: isPending ? "not-allowed" : "pointer",
            transition: "background 0.15s ease",
          }}
        >
          {isPending && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
          {progress !== null
            ? `Enviando… ${progress}%`
            : isPending
              ? "Salvando…"
              : isNew
                ? "Criar Banner"
                : "Salvar Alterações"}
        </button>
        <Link
          href="/admin/banners"
          className="font-sans"
          style={{
            padding: "12px 24px",
            borderRadius: 999,
            border: "1.5px solid var(--line)",
            color: "var(--ink-mid)",
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Cancelar
        </Link>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </form>
  );
}
