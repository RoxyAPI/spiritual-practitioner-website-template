/** The heading block every inner page opens with. Keeps the type scale and rhythm identical across pages. */
export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  // Full width on the outside so the section rule spans the page, constrained on the inside so the
  // measure stays readable. A header that is itself narrow drags the divider in with it.
  return (
    <header className="py-16 sm:py-24">
      <div className="max-w-2xl">
        <p className="eyebrow text-primary">{eyebrow}</p>
        <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">{title}</h1>
        {lead ? <p className="mt-6 text-lg text-muted-foreground">{lead}</p> : null}
      </div>
    </header>
  );
}
