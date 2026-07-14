import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookingCta } from '@/components/booking-cta';
import { PageHeader } from '@/components/page-header';
import { Section } from '@/components/section';
import { enabledReadings } from '@/lib/readings';

export const metadata: Metadata = {
  title: 'Free Readings',
  description:
    'Free birth chart, daily horoscope, compatibility score, life path number, tarot spread, and human design chart. Real calculations, no signup, no email wall.',
  alternates: { canonical: '/readings' },
};

export default function ReadingsPage() {
  const readings = enabledReadings();

  // With every reading switched off there is no hub to show.
  if (readings.length === 0) notFound();

  return (
    <div className="divide-y divide-border/60">
      <PageHeader
        eyebrow="Free Readings"
        title="Take something real away for free"
        lead="Each reading below is calculated from your own birth details, not pulled from a list of generic answers. No signup, no email wall, nothing stored."
      />

      <Section>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {readings.map((reading) => (
            <li key={reading.key}>
              <Link
                href={reading.href}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-8 transition-colors hover:border-primary/50"
              >
                <h2 className="font-display text-xl">{reading.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {reading.blurb}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm text-primary">
                  Open the reading
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <BookingCta line="A free reading tells you what the sky is doing. A session tells you what to do about it." />
      </Section>
    </div>
  );
}
