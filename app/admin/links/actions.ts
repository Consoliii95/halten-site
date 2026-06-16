"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "../../../lib/supabase";

async function uploadToStorage(file: File, bucket: string): Promise<string> {
  const db = getSupabaseAdmin();

  const { error: bucketErr } = await db.storage.createBucket(bucket, { public: true });
  if (bucketErr && !bucketErr.message.includes("already exists")) {
    console.error("[links/actions] Erro ao criar bucket:", bucketErr.message);
  }

  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadErr } = await db.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadErr) throw new Error(`Falha no upload do arquivo: ${uploadErr.message}`);

  return db.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

function optionalText(raw: FormDataEntryValue | null): string | null {
  const value = (raw as string | null)?.trim();
  return value ? value : null;
}

/** Destino: arquivo enviado tem prioridade; senão usa o link colado; senão mantém o existente. */
async function resolveUrl(formData: FormData): Promise<string | null> {
  const file = formData.get("dest_file");
  if (file instanceof File && file.size > 0) {
    return uploadToStorage(file, "links");
  }
  return optionalText(formData.get("url")) ?? optionalText(formData.get("url_existing"));
}

/** Ícone personalizado: usado apenas quando icon === 'custom'. */
async function resolveIconUrl(formData: FormData, icon: string): Promise<string | null> {
  if (icon !== "custom") return null;
  const file = formData.get("icon_file");
  if (file instanceof File && file.size > 0) {
    return uploadToStorage(file, "links");
  }
  return optionalText(formData.get("icon_url_existing"));
}

export async function createLink(formData: FormData) {
  const db = getSupabaseAdmin();
  const icon = (formData.get("icon") as string) || "link";
  const url = await resolveUrl(formData);
  const icon_url = await resolveIconUrl(formData, icon);

  // Nova posição = fim da lista
  const { count } = await db.from("links").select("*", { count: "exact", head: true });

  const payload = {
    title: (formData.get("title") as string) || "",
    subtitle: optionalText(formData.get("subtitle")),
    url,
    icon,
    icon_url,
    position: count ?? 0,
    active: formData.get("active") === "true",
  };

  const { error } = await db.from("links").insert(payload);
  if (error) throw new Error(`Erro ao salvar no banco: ${error.message}`);

  revalidatePath("/admin/links");
  revalidatePath("/links");
  redirect("/admin/links");
}

export async function updateLink(id: string, formData: FormData) {
  const db = getSupabaseAdmin();
  const icon = (formData.get("icon") as string) || "link";
  const url = await resolveUrl(formData);
  const icon_url = await resolveIconUrl(formData, icon);

  const payload = {
    title: (formData.get("title") as string) || "",
    subtitle: optionalText(formData.get("subtitle")),
    url,
    icon,
    icon_url,
    active: formData.get("active") === "true",
  };

  const { error } = await db.from("links").update(payload).eq("id", id);
  if (error) throw new Error(`Erro ao atualizar no banco: ${error.message}`);

  revalidatePath("/admin/links");
  revalidatePath("/links");
  redirect("/admin/links");
}

export async function deleteLink(id: string) {
  const db = getSupabaseAdmin();
  await db.from("links").delete().eq("id", id);
  revalidatePath("/admin/links");
  revalidatePath("/links");
}

export async function toggleLinkActive(id: string, current: boolean) {
  const db = getSupabaseAdmin();
  await db.from("links").update({ active: !current }).eq("id", id);
  revalidatePath("/admin/links");
  revalidatePath("/links");
}

/** Reordena por setas: troca a posição com o vizinho e renumera tudo (0..n). */
export async function moveLink(id: string, direction: "up" | "down") {
  const db = getSupabaseAdmin();
  const { data: rows } = await db
    .from("links")
    .select("id, position")
    .order("position", { ascending: true });

  if (!rows) return;

  const idx = rows.findIndex((r: { id: string }) => r.id === id);
  const swapWith = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapWith < 0 || swapWith >= rows.length) return;

  const order = rows.map((r: { id: string }) => r.id);
  [order[idx], order[swapWith]] = [order[swapWith], order[idx]];

  await Promise.all(
    order.map((rid, i) => db.from("links").update({ position: i }).eq("id", rid))
  );

  revalidatePath("/admin/links");
  revalidatePath("/links");
}
