"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "../../../lib/supabase";

/**
 * A imagem sobe do navegador direto para o Storage antes do submit — ver
 * `BannerForm` e `upload-client`. Aqui só chega a URL, que é o que mantém a
 * requisição abaixo do limite de 4.5 MB da Vercel.
 */
function resolveImageUrl(formData: FormData): string {
  return ((formData.get("image_url_existing") as string) ?? "").trim();
}

export async function createBanner(formData: FormData) {
  const db = getSupabaseAdmin();
  const imageUrl = resolveImageUrl(formData);

  const payload = {
    title: (formData.get("title") as string) || "",   // "" passa NOT NULL; null quebraria
    subtitle: (formData.get("subtitle") as string) || null,
    cta_text: (formData.get("cta_text") as string) || null,
    cta_link: (formData.get("cta_link") as string) || null,
    image_url: imageUrl || null,
    position: Number(formData.get("position")) || 0,
    active: formData.get("active") === "true",
  };

  const { error: dbErr } = await db.from("banners").insert(payload);
  if (dbErr) throw new Error(`Erro ao salvar no banco: ${dbErr.message}`);

  revalidatePath("/admin/banners");
  revalidatePath("/");
  redirect("/admin/banners");
}

export async function updateBanner(id: string, formData: FormData) {
  const db = getSupabaseAdmin();
  const imageUrl = resolveImageUrl(formData);

  const payload = {
    title: (formData.get("title") as string) || "",
    subtitle: (formData.get("subtitle") as string) || null,
    cta_text: (formData.get("cta_text") as string) || null,
    cta_link: (formData.get("cta_link") as string) || null,
    image_url: imageUrl || null,
    position: Number(formData.get("position")) || 0,
    active: formData.get("active") === "true",
  };

  const { error: dbErr } = await db.from("banners").update(payload).eq("id", id);
  if (dbErr) throw new Error(`Erro ao atualizar no banco: ${dbErr.message}`);

  revalidatePath("/admin/banners");
  revalidatePath("/");
  redirect("/admin/banners");
}

export async function deleteBanner(id: string) {
  const db = getSupabaseAdmin();
  await db.from("banners").delete().eq("id", id);
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function toggleBannerActive(id: string, current: boolean) {
  const db = getSupabaseAdmin();
  await db.from("banners").update({ active: !current }).eq("id", id);
  revalidatePath("/admin/banners");
  revalidatePath("/");
}
