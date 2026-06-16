import Link from "next/link";

type ProductCardProps = {
  product: {
    title: string;
    category: string;
    excerpt: string;
    badge: string;
    imageUrl?: string;
    slug?: string;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-[20px] border border-[var(--line)] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(28,155,215,0.12)] hover:border-[var(--blue)]">
      <div className="bg-[var(--bg-section)] p-6">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-48 w-full object-contain"
          />
        ) : (
          <div className="flex h-48 items-center justify-center rounded-2xl bg-[var(--line)] text-sm text-[var(--ink-mid)]">
            Imagem do produto
          </div>
        )}
      </div>

      <div className="space-y-4 p-6">
        <span className="inline-flex rounded-full bg-[var(--blue-light)] px-3 py-1 text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--blue)]">
          {product.badge}
        </span>
        <div className="space-y-2">
          <h3 className="text-base font-semibold leading-snug text-[var(--ink)]">{product.title}</h3>
          <p className="text-sm leading-6 text-[var(--ink-mid)]">{product.excerpt}</p>
        </div>
        <div className="pt-1">
          {product.slug ? (
            <Link
              href={`/produtos/${product.slug}`}
              className="inline-flex w-full items-center justify-center rounded-full border border-[var(--blue)] px-5 py-3 text-sm font-semibold text-[var(--blue)] transition hover:bg-[var(--blue)] hover:text-white"
            >
              Ver detalhes
            </Link>
          ) : (
            <a
              href="https://wa.me/5545991517308"
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center rounded-full border border-[var(--blue)] px-5 py-3 text-sm font-semibold text-[var(--blue)] transition hover:bg-[var(--blue)] hover:text-white"
            >
              Solicitar orçamento
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
