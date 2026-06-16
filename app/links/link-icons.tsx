import { FileText, Globe, Download, Smartphone, Link2 } from "lucide-react";

export type LinkIconKey =
  | "link"
  | "whatsapp"
  | "appstore"
  | "googleplay"
  | "catalogo"
  | "download"
  | "site"
  | "app"
  | "custom";

/** Opções exibidas no seletor de ícone do admin (ordem do grid). */
export const LINK_ICON_OPTIONS: { key: LinkIconKey; label: string }[] = [
  { key: "link", label: "Link" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "appstore", label: "App Store" },
  { key: "googleplay", label: "Google Play" },
  { key: "catalogo", label: "Catálogo / PDF" },
  { key: "download", label: "Download" },
  { key: "site", label: "Site" },
  { key: "app", label: "Aplicativo" },
  { key: "custom", label: "Personalizado" },
];

type Props = {
  icon?: string | null;
  iconUrl?: string | null;
  size?: number;
  color?: string;
};

/** Renderiza o ícone de um link (preset lucide, SVG de loja, ou imagem personalizada). */
export function LinkIcon({ icon, iconUrl, size = 22, color = "#0a1628" }: Props) {
  if (icon === "custom" && iconUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={iconUrl} alt="" width={size} height={size} style={{ objectFit: "contain", borderRadius: 6 }} />;
  }

  switch (icon) {
    case "appstore":
      // eslint-disable-next-line @next/next/no-img-element
      return <img src="/apple-black-logo.svg" alt="" width={size} height={size} style={{ objectFit: "contain" }} />;
    case "googleplay":
      // eslint-disable-next-line @next/next/no-img-element
      return <img src="/google-play-store-icon.svg" alt="" width={size} height={size} style={{ objectFit: "contain" }} />;
    case "whatsapp":
      // eslint-disable-next-line @next/next/no-img-element
      return <img src="/Whatsapp.svg" alt="" width={size} height={size} style={{ objectFit: "contain" }} />;
    case "catalogo":
      return <FileText size={size} color={color} />;
    case "site":
      return <Globe size={size} color={color} />;
    case "download":
      return <Download size={size} color={color} />;
    case "app":
      return <Smartphone size={size} color={color} />;
    default:
      return <Link2 size={size} color={color} />;
  }
}
