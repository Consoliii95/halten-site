"use client";

import { useRef, useState, useTransition } from "react";
import { FileSpreadsheet, Loader2, Trash2, Check, AlertCircle, Plus, X, ChevronUp, ChevronDown } from "lucide-react";
import * as XLSX from "xlsx";
import { saveProductConversions, deleteProductConversions } from "./conversion-actions";

type ConversionRow = { codigo_halten: string; codigos_originais: string };
type ExistingConversion = { id: string; rows: ConversionRow[] };

type Props = {
  productId: string;
  existingConversion?: ExistingConversion | null;
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

const cellInput: React.CSSProperties = {
  width: "100%",
  border: "none",
  background: "transparent",
  fontSize: 13,
  fontFamily: "var(--font-mono)",
  color: "var(--ink)",
  outline: "none",
  padding: "6px 8px",
  borderRadius: 4,
};

export function ProductConversionSection({ productId, existingConversion }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<ConversionRow[]>(existingConversion?.rows ?? []);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  function handleDrop(targetIdx: number) {
    if (dragIdx === null || dragIdx === targetIdx) return;
    setRows(prev => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(targetIdx, 0, moved);
      return next;
    });
    setDragIdx(null);
    setDragOverIdx(null);
    setSuccess(false);
  }

  function moveRow(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= rows.length) return;
    setRows(prev => {
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
    setSuccess(false);
  }

  function addRow() {
    setRows(prev => [...prev, { codigo_halten: "", codigos_originais: "" }]);
    setSuccess(false);
  }

  function updateRow(idx: number, field: keyof ConversionRow, value: string) {
    setRows(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  }

  function removeRow(idx: number) {
    setRows(prev => prev.filter((_, i) => i !== idx));
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSuccess(false);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = ev.target?.result;
        const wb = XLSX.read(data, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 }) as string[][];

        const parsed: ConversionRow[] = [];
        for (let i = 1; i < raw.length; i++) {
          const row = raw[i];
          if (!row || (!row[0] && !row[1])) continue;
          parsed.push({
            codigo_halten: String(row[0] ?? "").trim(),
            codigos_originais: String(row[1] ?? "").trim(),
          });
        }

        if (parsed.length === 0) {
          setError("Nenhuma linha encontrada no Excel.");
          return;
        }

        setRows(prev => [...prev, ...parsed]);
        if (fileRef.current) fileRef.current.value = "";
      } catch {
        setError("Erro ao ler o arquivo Excel.");
      }
    };
    reader.readAsBinaryString(file);
  }

  function handleSave() {
    const valid = rows.filter(r => r.codigo_halten.trim() || r.codigos_originais.trim());
    if (!valid.length) {
      setError("Adicione pelo menos uma linha antes de salvar.");
      return;
    }
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      try {
        await saveProductConversions(productId, valid);
        setRows(valid);
        setSuccess(true);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  function handleDeleteAll() {
    if (!confirm("Remover toda a tabela de conversões deste produto?")) return;
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      try {
        await deleteProductConversions(productId);
        setRows([]);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {error && (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10 }}>
          <AlertCircle size={15} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 13, color: "#dc2626", fontFamily: "var(--font-mono)", margin: 0 }}>{error}</p>
        </div>
      )}
      {success && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10 }}>
          <Check size={15} color="#16a34a" />
          <p style={{ fontSize: 13, color: "#16a34a", fontFamily: "var(--font-mono)", margin: 0 }}>Tabela de conversões salva!</p>
        </div>
      )}

      {/* Tabela editável */}
      <div style={{ border: "1.5px solid var(--line)", borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: "var(--font-mono)" }}>
          <thead>
            <tr style={{ background: "#111827" }}>
              <th style={{ width: 28 }} />
              <th style={{ padding: "10px 14px", textAlign: "left", color: "white", fontWeight: 700, letterSpacing: "0.06em", width: "28%" }}>
                CÓDIGO HALTEN
              </th>
              <th style={{ padding: "10px 14px", textAlign: "left", color: "white", fontWeight: 700, letterSpacing: "0.06em" }}>
                CÓDIGOS ORIGINAIS
              </th>
              <th style={{ width: 52 }} />
              <th style={{ width: 36 }} />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "20px 16px", textAlign: "center", color: "var(--ink-mute)", fontSize: 13, fontFamily: "var(--font-mono)" }}>
                  Nenhuma linha ainda. Clique em "+ Adicionar linha" abaixo.
                </td>
              </tr>
            )}
            {rows.map((row, i) => (
              <tr
                key={i}
                onDragOver={(e) => { e.preventDefault(); setDragOverIdx(i); }}
                onDrop={() => handleDrop(i)}
                onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
                style={{
                  background: dragOverIdx === i ? "#eff6ff" : i % 2 === 0 ? "white" : "#f8fafc",
                  borderBottom: "1px solid var(--line)",
                  opacity: dragIdx === i ? 0.4 : 1,
                  outline: dragOverIdx === i && dragIdx !== null ? "2px solid var(--blue)" : "none",
                  outlineOffset: -2,
                }}
              >
                <td
                  draggable
                  onDragStart={() => setDragIdx(i)}
                  title="Arraste para reordenar"
                  style={{ padding: "3px 4px", textAlign: "center", cursor: "grab" }}
                >
                  <svg width="12" height="18" viewBox="0 0 12 18" fill="none" style={{ display: "block", margin: "0 auto" }}>
                    {[0, 6, 12].map(y => [2, 8].map(x => (
                      <circle key={`${x}-${y}`} cx={x} cy={y + 3} r={1.5} fill="#94a3b8" />
                    )))}
                  </svg>
                </td>
                <td style={{ padding: "3px 6px" }}>
                  <input
                    type="text"
                    value={row.codigo_halten}
                    onChange={(e) => updateRow(i, "codigo_halten", e.target.value)}
                    placeholder="Ex: OM5779"
                    style={{ ...cellInput, fontWeight: 700, color: "var(--ink)" }}
                    onFocus={(e) => (e.target.style.background = "#eff6ff")}
                    onBlur={(e) => (e.target.style.background = "transparent")}
                  />
                </td>
                <td style={{ padding: "3px 6px" }}>
                  <input
                    type="text"
                    value={row.codigos_originais}
                    onChange={(e) => updateRow(i, "codigos_originais", e.target.value)}
                    placeholder="Ex: CT300 (Norma) / A3849977390 (Mercedes)"
                    style={{ ...cellInput, color: "var(--ink-mid)" }}
                    onFocus={(e) => (e.target.style.background = "#eff6ff")}
                    onBlur={(e) => (e.target.style.background = "transparent")}
                  />
                </td>
                <td style={{ padding: "3px 2px", textAlign: "center", whiteSpace: "nowrap" }}>
                  <button
                    type="button"
                    onClick={() => moveRow(i, -1)}
                    disabled={i === 0}
                    title="Mover para cima"
                    style={{ background: "none", border: "none", cursor: i === 0 ? "default" : "pointer", color: i === 0 ? "#e2e8f0" : "#94a3b8", padding: 2, lineHeight: 0 }}
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveRow(i, 1)}
                    disabled={i === rows.length - 1}
                    title="Mover para baixo"
                    style={{ background: "none", border: "none", cursor: i === rows.length - 1 ? "default" : "pointer", color: i === rows.length - 1 ? "#e2e8f0" : "#94a3b8", padding: 2, lineHeight: 0 }}
                  >
                    <ChevronDown size={14} />
                  </button>
                </td>
                <td style={{ padding: "3px 6px", textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    title="Remover linha"
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", padding: 4, borderRadius: 4, display: "flex", alignItems: "center" }}
                  >
                    <X size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Adicionar linha + importar Excel */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button
          type="button"
          onClick={addRow}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 18px",
            borderRadius: 10,
            border: "1.5px dashed var(--blue)",
            background: "var(--blue-light)",
            fontSize: 13,
            fontFamily: "var(--font-mono)",
            color: "var(--blue)",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          <Plus size={14} />
          Adicionar linha
        </button>

        <span style={{ fontSize: 12, color: "var(--ink-mute)", fontFamily: "var(--font-mono)" }}>ou</span>

        <input ref={fileRef} type="file" accept=".xlsx,.xls" onChange={handleFile} style={{ display: "none" }} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          title="Importar linhas de um Excel (col A = Código Halten, col B = Códigos Originais, linha 1 = cabeçalho)"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 16px",
            borderRadius: 10,
            border: "1.5px solid var(--line)",
            background: "var(--bg)",
            fontSize: 13,
            fontFamily: "var(--font-mono)",
            color: "var(--ink-mid)",
            cursor: "pointer",
          }}
        >
          <FileSpreadsheet size={14} color="var(--blue)" />
          Importar Excel
        </button>
      </div>

      {/* Ações principais */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending || rows.length === 0}
          className="font-sans"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "11px 24px",
            borderRadius: 999,
            background: rows.length === 0 || isPending ? "#94a3b8" : "var(--blue)",
            color: "white",
            fontSize: 14,
            fontWeight: 700,
            border: "none",
            cursor: rows.length === 0 || isPending ? "not-allowed" : "pointer",
          }}
        >
          {isPending && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
          {isPending ? "Salvando…" : "Salvar Conversões"}
        </button>

        {(existingConversion || rows.length > 0) && (
          <button
            type="button"
            onClick={handleDeleteAll}
            disabled={isPending}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "11px 20px",
              borderRadius: 999,
              border: "1.5px solid #fecaca",
              color: "#dc2626",
              background: "white",
              fontSize: 13,
              fontFamily: "var(--font-mono)",
              cursor: isPending ? "not-allowed" : "pointer",
            }}
          >
            <Trash2 size={13} />
            Remover tudo
          </button>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
