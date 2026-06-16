import { SectionHeader } from "./section-header";

export function ContactSection() {
  return (
    <section id="contato" className="bg-[var(--bg)] px-6 py-20 text-[var(--ink)] sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1280px] rounded-[32px] bg-[var(--bg-white)] p-10 shadow-[0_18px_48px_rgba(15,25,35,0.06)]">
        <SectionHeader badge="Contato" title="Fale com" subtitle="a equipe" />
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-6 rounded-[24px] bg-[var(--blue-light)] border-l-4 border-[var(--blue)] p-8 text-[var(--ink-mid)]">
            <p className="text-base leading-7" style={{ fontFamily: "var(--font-mono)" }}>
              Quer orçar um produto ou tirar dúvidas técnicas? Nossa equipe comercial está pronta para atender sua empresa rapidamente.
            </p>
            <div className="space-y-3 text-sm">
              <p className="font-semibold text-[var(--ink)]">contato@halten.ind.br</p>
              <p>Telefone: (45) 3197-2130</p>
              <p>WhatsApp: (45) 99151-7308</p>
              <p>R. Alba Vieira, 653 — Cataratas, Cascavel/PR — 85818-630</p>
            </div>
          </div>

          <form className="space-y-4 rounded-[24px] border border-[var(--line)] bg-[var(--bg-white)] p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="w-full rounded-3xl border border-[var(--line)] bg-[var(--bg-section)] px-4 py-4 text-sm text-[var(--ink)] outline-none" placeholder="Nome" />
              <input className="w-full rounded-3xl border border-[var(--line)] bg-[var(--bg-section)] px-4 py-4 text-sm text-[var(--ink)] outline-none" placeholder="E-mail" />
            </div>
            <textarea className="w-full rounded-3xl border border-[var(--line)] bg-[var(--bg-section)] px-4 py-4 text-sm text-[var(--ink)] outline-none" rows={5} placeholder="Mensagem" />
            <button type="submit" className="inline-flex rounded-full bg-[var(--blue)] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[var(--blue-deep)]">
              Enviar mensagem
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
