import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabase";

export const dynamic = "force-dynamic";

/** Conta o clique e redireciona ao destino do link. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getSupabaseAdmin();

  const { data } = await db.from("links").select("url").eq("id", id).single();

  const fallback = new URL("/links", req.url);
  if (!data?.url) return NextResponse.redirect(fallback);

  // Incremento atômico (não bloqueia o redirect se falhar)
  await db.rpc("increment_link_clicks", { link_id: id });

  const target = /^https?:\/\//i.test(data.url)
    ? data.url
    : new URL(data.url, req.url).toString();

  return NextResponse.redirect(target);
}
