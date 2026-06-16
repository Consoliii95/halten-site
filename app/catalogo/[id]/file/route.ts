import { getSupabaseAdmin } from "../../../../lib/supabase";

export const dynamic = "force-dynamic";

/** Serve o PDF do catálogo pelo domínio da Halten (esconde a URL do Supabase). */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data } = await getSupabaseAdmin().from("links").select("url").eq("id", id).single();
  if (!data?.url) return new Response("Catálogo não encontrado", { status: 404 });

  const upstream = await fetch(data.url);
  if (!upstream.ok || !upstream.body) {
    return new Response("Falha ao carregar o arquivo", { status: 502 });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="catalogo-halten.pdf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
