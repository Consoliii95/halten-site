"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X, Download, Loader2, Plus, Minus } from "lucide-react";

type Props = {
  fileUrl: string;
  title: string;
};

export function Flipbook({ fileUrl, title }: Props) {
  const [pages, setPages] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [error, setError] = useState(false);
  const [index, setIndex] = useState(0); // índice da página da esquerda
  const [isMobile, setIsMobile] = useState(false);
  const [dir, setDir] = useState<"next" | "prev">("next");
  const [zoom, setZoom] = useState<number | null>(null); // página aberta em zoom
  const cancelled = useRef(false);

  // Detecta mobile (1 página) x desktop (2 páginas lado a lado)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 820px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Renderiza o PDF para imagens (no navegador)
  useEffect(() => {
    cancelled.current = false;

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const doc = await pdfjs.getDocument(fileUrl).promise;
        if (cancelled.current) return;
        setTotal(doc.numPages);

        const rendered: string[] = [];
        for (let n = 1; n <= doc.numPages; n++) {
          const page = await doc.getPage(n);
          const base = page.getViewport({ scale: 1 });
          const scale = 1400 / base.width; // resolução de render
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;

          await page.render({ canvasContext: ctx, viewport }).promise;
          if (cancelled.current) return;

          rendered.push(canvas.toDataURL("image/jpeg", 0.82));
          setLoaded(n);
        }

        if (!cancelled.current) setPages(rendered);
      } catch (err) {
        console.error("[Flipbook] Erro ao renderizar PDF:", err);
        if (!cancelled.current) setError(true);
      }
    })();

    return () => {
      cancelled.current = true;
    };
  }, [fileUrl]);

  const step = isMobile ? 1 : 2;
  // Página da esquerda normalizada (no desktop sempre par, formando o "spread")
  const left = isMobile ? index : index - (index % 2);

  const goNext = useCallback(() => {
    setDir("next");
    setIndex((i) => {
      const b = isMobile ? i : i - (i % 2);
      return b + step < pages.length ? b + step : b;
    });
  }, [isMobile, pages.length, step]);

  const goPrev = useCallback(() => {
    setDir("prev");
    setIndex((i) => {
      const b = isMobile ? i : i - (i % 2);
      return b - step >= 0 ? b - step : b;
    });
  }, [isMobile, step]);

  // Navegação por teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  const ready = pages.length > 0;
  const canPrev = left > 0;
  const canNext = left + step < pages.length;
  const counter =
    isMobile || !pages[left + 1]
      ? `${left + 1} / ${pages.length}`
      : `${left + 1}–${left + 2} / ${pages.length}`;

  return (
    <main
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "100dvh",
        background: "radial-gradient(circle at 50% 0%, #243044 0%, #0e141f 70%)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Barra superior */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "calc(14px + env(safe-area-inset-top)) 18px 14px",
          gap: 12,
          flexShrink: 0,
        }}
      >
        <Link href="/links" aria-label="Voltar" style={barBtn}>
          <X size={18} />
        </Link>
        <p
          style={{
            color: "rgba(255,255,255,0.85)",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </p>
        <a href={fileUrl} download aria-label="Baixar PDF" style={barBtn}>
          <Download size={17} />
        </a>
      </header>

      {/* Área da revista */}
      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0, padding: "0 8px" }}>
        {!ready ? (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-mono)" }}>
            {error ? (
              <>
                <p style={{ fontSize: 14, marginBottom: 12 }}>Não foi possível abrir o catálogo aqui.</p>
                <a href={fileUrl} style={{ color: "#34b3e8", fontSize: 13 }}>Abrir o PDF →</a>
              </>
            ) : (
              <>
                <Loader2 size={28} style={{ animation: "spin 1s linear infinite", marginBottom: 12 }} />
                <p style={{ fontSize: 13 }}>
                  Carregando catálogo{total ? `… ${loaded}/${total}` : "…"}
                </p>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Setas laterais — só no desktop (no mobile vão pro rodapé) */}
            {!isMobile && (
              <button onClick={goPrev} disabled={!canPrev} aria-label="Página anterior" style={arrowBtn("left", canPrev)}>
                <ChevronLeft size={26} />
              </button>
            )}

            <div style={{ perspective: 2000, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", maxWidth: "100%" }}>
              <div key={left} className={`book-spread ${dir === "next" ? "turn-next" : "turn-prev"}`} style={{ display: "flex", gap: 2, height: "100%", alignItems: "center", justifyContent: "center" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pages[left]} alt={`Página ${left + 1}`} onClick={() => setZoom(left)} style={{ ...pageImg, maxWidth: isMobile ? "94vw" : "47vw", cursor: "zoom-in" }} />
                {!isMobile && pages[left + 1] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={pages[left + 1]} alt={`Página ${left + 2}`} onClick={() => setZoom(left + 1)} style={{ ...pageImg, maxWidth: "47vw", cursor: "zoom-in" }} />
                )}
              </div>
            </div>

            {!isMobile && (
              <button onClick={goNext} disabled={!canNext} aria-label="Próxima página" style={arrowBtn("right", canNext)}>
                <ChevronRight size={26} />
              </button>
            )}
          </>
        )}
      </div>

      {/* Rodapé: no mobile, setas + contador; no desktop só o contador */}
      {ready && (
        <footer style={{ flexShrink: 0, padding: isMobile ? "12px 0 calc(135px + env(safe-area-inset-bottom))" : "12px 0 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
            {isMobile && (
              <button onClick={goPrev} disabled={!canPrev} aria-label="Página anterior" style={navBtnMobile(canPrev)}>
                <ChevronLeft size={22} />
              </button>
            )}
            <span style={counterStyle}>{counter}</span>
            {isMobile && (
              <button onClick={goNext} disabled={!canNext} aria-label="Próxima página" style={navBtnMobile(canNext)}>
                <ChevronRight size={22} />
              </button>
            )}
          </div>
          {isMobile && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(255,255,255,0.55)", textAlign: "center", padding: "0 16px", lineHeight: 1.5 }}>
              Use as setas para virar a página · toque na página para ampliar
            </span>
          )}
        </footer>
      )}

      {/* Overlay de zoom */}
      {zoom !== null && pages[zoom] && (
        <ZoomViewer src={pages[zoom]} label={`Página ${zoom + 1}`} onClose={() => setZoom(null)} />
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .book-spread { transform-origin: center; }
        .turn-next { animation: turnNext .42s cubic-bezier(.2,.7,.2,1); }
        .turn-prev { animation: turnPrev .42s cubic-bezier(.2,.7,.2,1); }
        @keyframes turnNext {
          0%   { transform: rotateY(-14deg) translateX(36px); opacity: .35; }
          100% { transform: rotateY(0deg) translateX(0); opacity: 1; }
        }
        @keyframes turnPrev {
          0%   { transform: rotateY(14deg) translateX(-36px); opacity: .35; }
          100% { transform: rotateY(0deg) translateX(0); opacity: 1; }
        }
      `}</style>
    </main>
  );
}

const barBtn: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 38,
  height: 38,
  borderRadius: 10,
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "white",
  flexShrink: 0,
  cursor: "pointer",
  textDecoration: "none",
};

const pageImg: React.CSSProperties = {
  maxHeight: "100%",
  objectFit: "contain",
  boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
  background: "white",
  display: "block",
};

const counterStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 12,
  color: "rgba(255,255,255,0.65)",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 999,
  padding: "7px 14px",
};

function navBtnMobile(enabled: boolean): React.CSSProperties {
  return {
    width: 46,
    height: 46,
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.18)",
    background: enabled ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.04)",
    color: enabled ? "white" : "rgba(255,255,255,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: enabled ? "pointer" : "not-allowed",
    flexShrink: 0,
  };
}

/** Visualizador de página com zoom: pinça (mobile), scroll/arrastar (desktop), duplo-clique. */
function ZoomViewer({ src, label, onClose }: { src: string; label: string; onClose: () => void }) {
  const [t, setT] = useState({ s: 1, x: 0, y: 0 });
  const [gesturing, setGesturing] = useState(false);
  const pts = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchDist = useRef<number | null>(null);

  const clampS = (s: number) => Math.min(6, Math.max(1, s));

  function onDown(e: React.PointerEvent) {
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setGesturing(true);
  }

  function onMove(e: React.PointerEvent) {
    if (!pts.current.has(e.pointerId)) return;
    const prev = pts.current.get(e.pointerId)!;
    const cur = { x: e.clientX, y: e.clientY };
    pts.current.set(e.pointerId, cur);

    const arr = [...pts.current.values()];
    if (arr.length >= 2) {
      const [a, b] = arr;
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchDist.current) {
        const ratio = dist / pinchDist.current;
        setT((o) => ({ ...o, s: clampS(o.s * ratio) }));
      }
      pinchDist.current = dist;
    } else {
      const dx = cur.x - prev.x;
      const dy = cur.y - prev.y;
      setT((o) => (o.s > 1 ? { ...o, x: o.x + dx, y: o.y + dy } : o));
    }
  }

  function onUp(e: React.PointerEvent) {
    pts.current.delete(e.pointerId);
    if (pts.current.size < 2) pinchDist.current = null;
    if (pts.current.size === 0) setGesturing(false);
  }

  function onWheel(e: React.WheelEvent) {
    setT((o) => {
      const s = clampS(o.s - e.deltaY * 0.0016 * o.s);
      return s === 1 ? { s: 1, x: 0, y: 0 } : { ...o, s };
    });
  }

  function onDouble() {
    setT((o) => (o.s > 1 ? { s: 1, x: 0, y: 0 } : { s: 2.6, x: 0, y: 0 }));
  }

  const zoomIn = () => setT((o) => ({ ...o, s: clampS(o.s * 1.4) }));
  const zoomOut = () =>
    setT((o) => {
      const s = clampS(o.s / 1.4);
      return s === 1 ? { s: 1, x: 0, y: 0 } : { ...o, s };
    });

  // Esc fecha o zoom
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(8,12,20,0.97)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Barra de controles — fora do palco, não captura o ponteiro */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", gap: 10, flexShrink: 0, zIndex: 2 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{label}</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={zoomOut} aria-label="Diminuir zoom" style={barBtn}>
            <Minus size={18} />
          </button>
          <button onClick={zoomIn} aria-label="Aumentar zoom" style={barBtn}>
            <Plus size={18} />
          </button>
          <button onClick={onClose} aria-label="Fechar zoom" style={{ ...barBtn, background: "rgba(255,255,255,0.16)" }}>
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Palco — só ele captura arrasto/pinça */}
      <div
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onWheel={onWheel}
        onDoubleClick={onDouble}
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          touchAction: "none",
          cursor: t.s > 1 ? "grab" : "zoom-in",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={label}
          draggable={false}
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "contain",
            transform: `translate(${t.x}px, ${t.y}px) scale(${t.s})`,
            transition: gesturing ? "none" : "transform 0.12s ease-out",
            userSelect: "none",
            background: "white",
          }}
        />
      </div>

      <span
        style={{
          flexShrink: 0,
          textAlign: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "rgba(255,255,255,0.45)",
          padding: "8px 0 14px",
          pointerEvents: "none",
        }}
      >
        Pinça ou role para ampliar · arraste para mover · duplo-toque
      </span>
    </div>
  );
}

function arrowBtn(side: "left" | "right", enabled: boolean): React.CSSProperties {
  return {
    position: "absolute",
    [side]: 10,
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 5,
    width: 48,
    height: 48,
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.15)",
    background: enabled ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.03)",
    color: enabled ? "white" : "rgba(255,255,255,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: enabled ? "pointer" : "not-allowed",
    backdropFilter: "blur(4px)",
  };
}
