"use client";

import { createUploadTicket, type UploadBucket } from "./upload-actions";

/**
 * Envia o arquivo do navegador direto para o Supabase Storage e devolve a
 * URL pública. Sem limite de tamanho da Vercel — o arquivo não passa pelo
 * servidor Next (ver `createUploadTicket`).
 *
 * Usa XHR em vez de fetch porque só ele reporta progresso de upload.
 */
export async function uploadDirect(
  file: File,
  bucket: UploadBucket,
  onProgress?: (percent: number) => void
): Promise<string> {
  const { signedUrl, publicUrl } = await createUploadTicket(bucket, file.name);

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", signedUrl);
    xhr.setRequestHeader("content-type", file.type || "application/octet-stream");
    xhr.setRequestHeader("cache-control", "max-age=3600");

    xhr.upload.onprogress = (e) => {
      if (onProgress && e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Falha no envio do arquivo (HTTP ${xhr.status}).`));
    };
    xhr.onerror = () => reject(new Error("Falha de rede durante o envio do arquivo."));
    xhr.onabort = () => reject(new Error("Envio do arquivo cancelado."));

    xhr.send(file);
  });

  return publicUrl;
}
