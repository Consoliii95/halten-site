import { notFound } from "next/navigation";
import { LinkForm } from "../LinkForm";
import { updateLink } from "../actions";
import { getSupabaseAdmin } from "../../../../lib/supabase";

export const dynamic = "force-dynamic";

export default async function EditLinkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: link } = await getSupabaseAdmin().from("links").select("*").eq("id", id).single();

  if (!link) notFound();

  const action = updateLink.bind(null, id);

  return (
    <div style={{ padding: "var(--admin-pad)", maxWidth: 800 }}>
      <h1 className="font-sans" style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", marginBottom: 28 }}>
        Editar Link
      </h1>
      <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--line)", padding: 28, boxShadow: "0 2px 12px rgba(15,25,35,0.04)" }}>
        <LinkForm link={link} action={action} />
      </div>
    </div>
  );
}
