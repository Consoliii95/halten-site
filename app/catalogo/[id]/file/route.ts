import { getSupabaseAdmin } from "../../../../lib/supabase";
import { fileVersion } from "../version";

export const dynamic = "force-dynamic";

/** Serve o PDF do catálogo pelo domínio da Halten (esconde a URL do Supabase). */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data } = await getSupabaseAdmin().from("links").select("url").eq("id", id).single();
  if (!data?.url) return new Response("Catálogo não encontrado", { status: 404 });

  const version = fileVersion(data.url);
  const etag = `"${version}"`;

  // Trocar o catálogo muda a versão, então o cache antigo nunca é reaproveitado:
  // com `?v=` correto o arquivo pode ficar guardado à vontade; sem ele, o
  // navegador revalida a cada visita (e leva 304 se nada mudou).
  const versioned = new URL(req.url).searchParams.get("v") === version;
  const cacheControl = versioned
    ? "public, max-age=31536000, immutable"
    : "public, max-age=0, must-revalidate";

  const headers = {
    "Content-Type": "application/pdf",
    "Content-Disposition": 'inline; filename="catalogo-halten.pdf"',
    "Cache-Control": cacheControl,
    ETag: etag,
  };

  // Já tem esta versão: responde 304 sem baixar o PDF do Storage.
  if (req.headers.get("if-none-match") === etag) {
    return new Response(null, { status: 304, headers });
  }

  const upstream = await fetch(data.url);
  if (!upstream.ok || !upstream.body) {
    return new Response("Falha ao carregar o arquivo", { status: 502 });
  }

  return new Response(upstream.body, { headers });
}
