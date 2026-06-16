import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSupabaseAdmin } from "../../../lib/supabase";
import { Flipbook } from "./Flipbook";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getSupabaseAdmin().from("links").select("title").eq("id", id).single();
  return { title: data?.title ? `${data.title} — Halten` : "Catálogo — Halten" };
}

export default async function CatalogoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getSupabaseAdmin();

  const { data: link } = await db.from("links").select("id, title, url").eq("id", id).single();
  if (!link?.url) notFound();

  // Conta o clique (mesma métrica do botão na /links)
  await db.rpc("increment_link_clicks", { link_id: id });

  return <Flipbook fileUrl={`/catalogo/${id}/file`} title={link.title ?? "Catálogo"} />;
}
