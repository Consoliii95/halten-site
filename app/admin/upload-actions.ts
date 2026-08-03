"use server";

import { getSupabaseAdmin } from "../../lib/supabase";
import { createSupabaseServerClient } from "../../lib/supabase-server";

/** Buckets que o painel pode alimentar via upload direto. */
const ALLOWED_BUCKETS = ["links", "banners", "products"] as const;
export type UploadBucket = (typeof ALLOWED_BUCKETS)[number];

export type UploadTicket = {
  /** URL assinada (válida por 2h) para o navegador dar PUT com o arquivo. */
  signedUrl: string;
  /** URL pública final do arquivo — é ela que vai para o banco. */
  publicUrl: string;
};

/**
 * Gera uma URL assinada para o navegador enviar o arquivo direto ao
 * Supabase Storage, sem passar pelo servidor Next.
 *
 * Motivo: a Vercel corta qualquer requisição com corpo acima de 4.5 MB
 * (HTTP 413) antes dela chegar na aplicação, e esse teto é da plataforma —
 * `serverActions.bodySizeLimit` não o afeta. Enviando direto ao Storage,
 * a Server Action recebe apenas a URL final.
 */
export async function createUploadTicket(
  bucket: UploadBucket,
  fileName: string
): Promise<UploadTicket> {
  if (!ALLOWED_BUCKETS.includes(bucket)) {
    throw new Error(`Bucket não permitido: ${bucket}`);
  }

  // A rota já é protegida pelo proxy, mas este ticket dá permissão de
  // escrita no Storage — vale confirmar a sessão aqui também.
  const auth = await createSupabaseServerClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user) throw new Error("Sessão expirada — faça login novamente.");

  const db = getSupabaseAdmin();

  const { error: bucketErr } = await db.storage.createBucket(bucket, { public: true });
  if (bucketErr && !bucketErr.message.includes("already exists")) {
    console.error("[upload-actions] Erro ao criar bucket:", bucketErr.message);
  }

  const rawExt = fileName.split(".").pop() ?? "";
  const ext = /^[a-z0-9]{1,8}$/i.test(rawExt) ? rawExt.toLowerCase() : "bin";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await db.storage.from(bucket).createSignedUploadUrl(path);
  if (error) throw new Error(`Não foi possível iniciar o upload: ${error.message}`);

  return {
    signedUrl: data.signedUrl,
    publicUrl: db.storage.from(bucket).getPublicUrl(path).data.publicUrl,
  };
}
