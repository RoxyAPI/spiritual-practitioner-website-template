import Link from 'next/link';
import { RoxyTarotCard } from '@/components/roxy/tarot-card';
import { Section } from '@/components/section';
import { isEnabled } from '@/lib/readings';
import { hasApiKey, roxy } from '@/lib/roxy/client';
import { tryUnwrap } from '@/lib/roxy/guard';

/**
 * The daily card, drawn once for the whole site rather than once per visitor.
 *
 * @remarks The home page revalidates on a timer (see its `revalidate` export), so this call is made on a schedule and served from the cache in between. A thousand visitors and one visitor cost the same. Never move this fetch into a per-visitor path.
 *
 * The widget disappears rather than breaking when the key is missing or the call fails, because a home page that renders is worth more than a card that insists on being there.
 */
export async function CardOfTheDay() {
  if (!isEnabled('cardOfTheDay') || !hasApiKey) return null;

  const result = await tryUnwrap(roxy.tarot.getDailyCard({ body: {} }));
  if ('error' in result) return null;

  return (
    <Section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-primary">Card of the day</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">The card for today</h2>
          <p className="mt-5 max-w-xl text-muted-foreground">
            One card, drawn fresh each day, the same for every visitor. Take it as a question to
            carry around rather than an answer to obey.
          </p>
        </div>
        <Link href="/readings/tarot" className="text-sm underline underline-offset-4">
          Pull three cards on your own question
        </Link>
      </div>

      {/* The card carries a long reading, so it gets the full width rather than a narrow column that would stretch it down the page. */}
      <div className="mt-12 rounded-2xl border border-border bg-card p-4 sm:p-8">
        <RoxyTarotCard data={result.data} />
      </div>
    </Section>
  );
}
