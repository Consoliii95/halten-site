import { LinkForm } from "../LinkForm";
import { createLink } from "../actions";

export default function NewLinkPage() {
  return (
    <div style={{ padding: "var(--admin-pad)", maxWidth: 800 }}>
      <h1 className="font-sans" style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", marginBottom: 28 }}>
        Novo Link
      </h1>
      <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--line)", padding: 28, boxShadow: "0 2px 12px rgba(15,25,35,0.04)" }}>
        <LinkForm action={createLink} isNew />
      </div>
    </div>
  );
}
