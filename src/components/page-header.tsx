import { Section } from '@/components/section';

/**
 * The heading block every inner page opens with. Full width on the outside (so the rule below it
 * spans the page), constrained on the inside (so the measure stays readable).
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <Section>
      <header className="max-w-2xl">
        <p className="eyebrow text-primary">{eyebrow}</p>
        <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">{title}</h1>
        {lead ? <p className="mt-6 text-lg text-muted-foreground">{lead}</p> : null}
      </header>
    </Section>
  );
}
