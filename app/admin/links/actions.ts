"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "../../../lib/supabase";

function optionalText(raw: FormDataEntryValue | null): string | null {
  const value = (raw as string | null)?.trim();
  return value ? value : null;
}

/**
 * Arquivos (PDF do catálogo, ícone) sobem do navegador direto para o Storage
 * antes do submit — ver `LinkForm` e `upload-client`. Aqui só chegam URLs,
 * que é o que mantém a requisição abaixo do limite de 4.5 MB da Vercel.
 */

/** Ícone personalizado: usado apenas quando icon === 'custom'. */
function resolveIconUrl(formData: FormData, icon: string): string | null {
  if (icon !== "custom") return null;
  return optionalText(formData.get("icon_url"));
}

export async function createLink(formData: FormData) {
  const db = getSupabaseAdmin();
  const icon = (formData.get("icon") as string) || "link";
  const url = optionalText(formData.get("url"));
  const icon_url = resolveIconUrl(formData, icon);

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
  const url = optionalText(formData.get("url"));
  const icon_url = resolveIconUrl(formData, icon);

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
