import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";
import { getSupabaseAdmin } from "../../../lib/supabase";
import { ImageViewer } from "./image-viewer";
import { AddToCartButton } from "../../components/add-to-cart-button";

export const dynamic = "force-dynamic";

type ColumnDef = { key: string; label: string; highlight?: boolean };

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  price: number | null;
  excerpt: string | null;
  description: string | null;
  details: string[] | null;
  images: string[] | null;
  cart_qty_one: boolean | null;
};

type ProductTable = {
  rows: Record<string, string>[];
  product_table_templates: { name: string; columns: ColumnDef[] } | null;
};

type ConversionRow = { codigo_halten: string; codigos_originais: string };
type ProductConversion = { rows: ConversionRow[] };

async function getProductBySlug(slug: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("id,name,slug,category,price,excerpt,description,details,images,cart_qty_one")
    .eq("slug", slug.trim())
    .eq("active", true)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[produto/slug] Supabase error:", error.message);
    return null;
  }

  return data as ProductRow | null;
}

async function getProductTable(productId: string): Promise<ProductTable | null> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("product_tables")
    .select("rows, product_table_templates(name, columns)")
    .eq("product_id", productId)
    .maybeSingle();

  if (!data) return null;

  const allRows = (data.rows ?? []) as Record<string, string>[];
  const configRow = allRows.find(r => "__config__" in r);
  const cleanRows = configRow ? allRows.filter(r => !("__config__" in r)) : allRows;

  const tmpl = data.product_table_templates as unknown as { name: string; columns: ColumnDef[] } | null;
  let columns = tmpl?.columns ?? [];

  if (configRow) {
    try {
      const config = JSON.parse(String(configRow.__config__));
      const overrides = (config.labelOverrides ?? {}) as Record<string, string>;
      const extra = (config.extraCols ?? []) as ColumnDef[];
      columns = [
        ...columns.map(c => ({ ...c, label: overrides[c.key] ?? c.label })),
        ...extra,
      ];
    } catch {}
  }

  return {
    rows: cleanRows,
    product_table_templates: tmpl ? { name: tmpl.name, columns } : null,
  };
}

async function getProductConversion(productId: string): Promise<ProductConversion | null> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("product_conversions")
    .select("rows")
    .eq("product_id", productId)
    .maybeSingle();

  return data as ProductConversion | null;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const [productTable, productConversion] = await Promise.all([
    getProductTable(product.id),
    getProductConversion(product.id),
  ]);

  const images = Array.isArray(product.images) ? product.images : [];
  const whatsappMsg = encodeURIComponent(
    `Olá! Tenho interesse no produto *${product.name}*. Poderia me enviar um orçamento?`
  );

  const tableTemplate = productTable?.product_table_templates;
  const tableRows = productTable?.rows ?? [];
  const hasTable = !!(tableTemplate && tableRows.length > 0);

  const conversionRows = productConversion?.rows ?? [];
  const hasConversions = conversionRows.length > 0;

  const nameParts = product.name.trim().split(" ");
  const lastWord = nameParts.pop() ?? "";
  const restOfName = nameParts.join(" ");

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--paper)", minHeight: "100vh" }}>
        {/* Breadcrumb */}
        <div
          style={{
            background: "var(--ink)",
            padding: "20px 32px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Link
              href="/produtos"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "rgba(255,255,255,0.4)",
                textDecoration: "none",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Catálogo
            </Link>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "rgba(255,255,255,0.18)",
              }}
            >
              /
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "rgba(255,255,255,0.55)",
              }}
            >
              {product.name}
            </span>
          </div>
        </div>

        {/* Main content */}
        <section style={{ padding: "64px 32px 96px" }}>
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1.15fr 0.85fr",
              gap: 56,
              alignItems: "start",
            }}
            className="slug-wrap"
          >
            {/* Left: Image viewer */}
            <ImageViewer images={images} slug={product.slug} productName={product.name} />

            {/* Right: Product info */}
            <div style={{ position: "sticky", top: 96 }}>
              {/* Category badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#1c9bd7",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(15,25,35,0.4)",
                  }}
                >
                  {product.category ?? "Abraçadeiras"} · {product.slug.toUpperCase()}
                </span>
              </div>

              {/* Title */}
              <h1
                className="font-sans"
                style={{
                  fontSize: "clamp(28px,3.2vw,44px)",
                  fontWeight: 700,
                  lineHeight: 0.95,
                  letterSpacing: "-0.03em",
                  color: "var(--ink)",
                  margin: "0 0 20px",
                }}
              >
                {restOfName}{restOfName ? " " : ""}
                <em style={{ fontStyle: "italic", color: "var(--blue)" }}>{lastWord}</em>
              </h1>

              {/* Meta pills */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
                {product.category && (
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "4px 10px",
                      borderRadius: 4,
                      background: "rgba(15,25,35,0.05)",
                      color: "rgba(15,25,35,0.45)",
                    }}
                  >
                    FAMÍLIA · {product.category}
                  </span>
                )}
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "4px 10px",
                    borderRadius: 4,
                    background: "rgba(15,25,35,0.05)",
                    color: "rgba(15,25,35,0.45)",
                  }}
                >
                  EDIÇÃO · CAT-26
                </span>
              </div>

              {/* Details/specs */}
              {product.details && product.details.length > 0 && (
                <div
                  style={{
                    background: "white",
                    borderRadius: 14,
                    border: "1px solid rgba(15,25,35,0.07)",
                    padding: "20px 22px",
                    marginBottom: 16,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "rgba(15,25,35,0.35)",
                      margin: "0 0 14px",
                    }}
                  >
                    Especificações
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {product.details.map((d, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <span
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: "50%",
                            background: "#1c9bd7",
                            flexShrink: 0,
                            marginTop: 7,
                          }}
                        />
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                            color: "rgba(15,25,35,0.65)",
                            lineHeight: 1.5,
                          }}
                        >
                          {d}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description (if no details) */}
              {(!product.details || product.details.length === 0) &&
                (product.description ?? product.excerpt) && (
                  <div
                    style={{
                      background: "white",
                      borderRadius: 14,
                      border: "1px solid rgba(15,25,35,0.07)",
                      padding: "20px 22px",
                      marginBottom: 16,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "rgba(15,25,35,0.35)",
                        margin: "0 0 10px",
                      }}
                    >
                      Descrição
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "rgba(15,25,35,0.65)",
                        lineHeight: 1.7,
                        margin: 0,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {product.description ?? product.excerpt}
                    </p>
                  </div>
                )}

              {/* Price */}
              <div
                style={{
                  padding: "20px 22px",
                  background: "white",
                  borderRadius: 14,
                  border: "1px solid rgba(15,25,35,0.07)",
                  marginBottom: 14,
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(15,25,35,0.35)",
                    margin: "0 0 6px",
                  }}
                >
                  Preço unitário
                </p>
                <p
                  className="font-sans"
                  style={{
                    fontSize: 36,
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    color: "var(--ink)",
                    margin: "0 0 4px",
                    lineHeight: 1,
                  }}
                >
                  {product.price !== null
                    ? `R$ ${product.price.toFixed(2).replace(".", ",")}`
                    : "Sob consulta"}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "rgba(15,25,35,0.35)",
                    margin: 0,
                    letterSpacing: "0.04em",
                  }}
                >
                  Resposta em até 24h úteis · 240+ SKU · catálogo 2026
                </p>
              </div>

              {/* CNPJ box */}
              <div
                style={{
                  padding: "16px 20px",
                  background: "rgba(28,155,215,0.07)",
                  border: "1px solid rgba(28,155,215,0.18)",
                  borderRadius: 12,
                  marginBottom: 16,
                }}
              >
                <p
                  className="font-sans"
                  style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", margin: "0 0 4px" }}
                >
                  Venda exclusiva para CNPJ
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "rgba(15,25,35,0.55)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  Comercializado apenas para pessoas jurídicas. Tenha seu CNPJ em mãos ao solicitar orçamento.
                </p>
              </div>

              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/5545991517308?text=${whatsappMsg}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  padding: "16px 28px",
                  borderRadius: 14,
                  background: "#22c55e",
                  color: "white",
                  textDecoration: "none",
                  marginBottom: 20,
                  transition: "background 0.2s",
                }}
                className="whats-cta"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                <span
                  className="font-sans"
                  style={{ fontWeight: 700, fontSize: 15, letterSpacing: "0.02em" }}
                >
                  SOLICITAR ORÇAMENTO
                </span>
              </a>
            </div>
          </div>

          {/* Technical tables */}
          {(hasTable || hasConversions) && (
            <div
              style={{
                maxWidth: 1280,
                margin: "64px auto 0",
                display: "flex",
                flexDirection: "column",
                gap: 40,
              }}
            >
              {hasTable && (
                <div>
                  {/* Quote hint banner */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 18px",
                      marginBottom: 16,
                      borderRadius: 10,
                      background: "rgba(28,155,215,0.07)",
                      border: "1px solid rgba(28,155,215,0.18)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flex: 1 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1c9bd7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(15,25,35,0.65)", margin: 0, lineHeight: 1.5 }}>
                        <strong style={{ color: "#1c9bd7", fontWeight: 700 }}>Monte seu orçamento:</strong>{" "}
                        adicione os itens que precisa clicando nos botões abaixo e envie direto pelo WhatsApp — sem cadastro.
                      </p>
                    </div>
                  </div>

                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "rgba(15,25,35,0.35)",
                      margin: "0 0 16px",
                    }}
                  >
                    [ Tabela Técnica · {tableTemplate!.name} ]
                  </p>
                  <div
                    style={{
                      overflowX: "auto",
                      borderRadius: 16,
                      border: "1px solid rgba(15,25,35,0.08)",
                      background: "white",
                    }}
                  >
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: 13,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      <thead>
                        <tr style={{ background: "var(--ink)" }}>
                          {tableTemplate!.columns.map((col) => (
                            <th
                              key={col.key}
                              style={{
                                padding: "12px 16px",
                                textAlign: "left",
                                color: "white",
                                fontWeight: 700,
                                fontSize: 10,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {col.label}
                            </th>
                          ))}
                          <th style={{
                            padding: "12px 16px",
                            textAlign: "center",
                            fontFamily: "var(--font-mono)",
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "#1c9bd7",
                            background: "rgba(28,155,215,0.15)",
                            whiteSpace: "nowrap",
                          }}>
                            Orçamento
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableRows.map((row, i) => {
                          const highlightCols = tableTemplate!.columns.filter((c) => c.highlight);
                          const embalagemCol = tableTemplate!.columns.find((c) =>
                            c.key.toLowerCase().includes("embalagem") || c.label.toLowerCase().includes("embalagem")
                          );
                          const rowEmbalagem = embalagemCol ? (row[embalagemCol.key] ?? "") : "";
                          const multiHighlight = highlightCols.length > 1;
                          return (
                            <tr
                              key={i}
                              style={{
                                background: i % 2 === 0 ? "white" : "rgba(15,25,35,0.02)",
                              }}
                            >
                              {tableTemplate!.columns.map((col) => (
                                <td
                                  key={col.key}
                                  style={{
                                    padding: "10px 16px",
                                    color: col.highlight ? "#1c9bd7" : "var(--ink)",
                                    fontWeight: col.highlight ? 700 : 400,
                                    borderBottom:
                                      i < tableRows.length - 1
                                        ? "1px solid rgba(15,25,35,0.05)"
                                        : "none",
                                    whiteSpace: col.highlight ? "nowrap" : "normal",
                                  }}
                                >
                                  {row[col.key] ?? "—"}
                                </td>
                              ))}
                              <td
                                style={{
                                  padding: "8px 16px",
                                  borderBottom:
                                    i < tableRows.length - 1
                                      ? "1px solid rgba(15,25,35,0.05)"
                                      : "none",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "stretch", minWidth: 130 }}>
                                  {highlightCols.map((col) => {
                                    const code = row[col.key] ?? "";
                                    if (!code) return null;
                                    return (
                                      <AddToCartButton
                                        key={col.key}
                                        code={code}
                                        productName={product.name}
                                        embalagem={product.cart_qty_one ? undefined : rowEmbalagem}
                                        label={multiHighlight ? (col.label.split(" ").pop() ?? col.label) : undefined}
                                      />
                                    );
                                  })}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {hasConversions && (
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "rgba(15,25,35,0.35)",
                      margin: "0 0 16px",
                    }}
                  >
                    [ Tabela de Conversões ]
                  </p>
                  <div
                    style={{
                      overflowX: "auto",
                      borderRadius: 16,
                      border: "1px solid rgba(15,25,35,0.08)",
                      background: "white",
                    }}
                  >
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: 13,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      <thead>
                        <tr style={{ background: "var(--ink)" }}>
                          <th
                            style={{
                              padding: "12px 16px",
                              textAlign: "left",
                              color: "white",
                              fontWeight: 700,
                              fontSize: 10,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              whiteSpace: "nowrap",
                              width: "30%",
                            }}
                          >
                            Código Halten
                          </th>
                          <th
                            style={{
                              padding: "12px 16px",
                              textAlign: "left",
                              color: "white",
                              fontWeight: 700,
                              fontSize: 10,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                            }}
                          >
                            Códigos Originais
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {conversionRows.map((row, i) => (
                          <tr
                            key={i}
                            style={{
                              background: i % 2 === 0 ? "white" : "rgba(15,25,35,0.02)",
                            }}
                          >
                            <td
                              style={{
                                padding: "10px 16px",
                                fontWeight: 700,
                                color: "var(--ink)",
                                borderBottom:
                                  i < conversionRows.length - 1
                                    ? "1px solid rgba(15,25,35,0.05)"
                                    : "none",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {row.codigo_halten}
                            </td>
                            <td
                              style={{
                                padding: "10px 16px",
                                color: "rgba(15,25,35,0.55)",
                                borderBottom:
                                  i < conversionRows.length - 1
                                    ? "1px solid rgba(15,25,35,0.05)"
                                    : "none",
                              }}
                            >
                              {row.codigos_originais}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />

      <style>{`
        .whats-cta:hover { background: #16a34a !important; }
        @media (max-width: 860px) {
          .slug-wrap { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
