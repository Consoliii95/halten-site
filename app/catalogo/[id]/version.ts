import { createHash } from "crypto";

/**
 * Versão do arquivo, derivada da URL no Storage — que muda a cada upload,
 * porque o caminho leva timestamp.
 *
 * Vai como `?v=` na URL do PDF: assim que o catálogo é trocado, o navegador
 * vê uma URL diferente e baixa o arquivo novo, em vez de servir o antigo do
 * próprio cache.
 */
export function fileVersion(url: string): string {
  return createHash("sha1").update(url).digest("hex").slice(0, 12);
}
