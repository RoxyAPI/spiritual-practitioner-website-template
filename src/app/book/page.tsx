import type { Metadata } from 'next';
import Link from 'next/link';
import { BookingEmbed } from '@/components/booking-embed';
import { PageHeader } from '@/components/page-header';
import { Section } from '@/components/section';
import { siteConfig } from '@/config/site.config';

export const metadata: Metadata = {
  title: 'Book a Reading',
  description: `Pick a time with ${siteConfig.name}. Bring your birth date, birth time, and birth city, and the question you actually came with.`,
  alternates: { canonical: '/book' },
};

export default function BookPage() {
  const { provider, url } = siteConfig.booking;

  return (
    <div className="divide-y divide-border/60">
      <PageHeader
        eyebrow="Booking"
        title="Choose a time"
        lead="Have your birth date, birth time, and birth city ready. The birth time matters more than people expect, so it is worth the ten minutes it takes to find it."
      />

      <Section>
        {url ? <BookingEmbed provider={provider} url={url} /> : <BookingSetupNotice />}

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Not sure which session to book?{' '}
          <Link href="/contact" className="underline underline-offset-4">
            Send me the question first
          </Link>
          .
        </p>
      </Section>
    </div>
  );
}

/**
 * Shown until a fork sets `booking.url`. A template that shipped a real scheduling link would send
 * strangers to somebody else's calendar, and one that shipped a fake link would render a broken
 * embed, so the honest default is this card.
 */
function BookingSetupNotice() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-border bg-card p-10 text-center">
      <h2 className="font-display text-2xl">The booking link is not connected yet</h2>
      <p className="mt-4 text-muted-foreground">
        Add your public scheduling link to <code className="text-foreground">booking.url</code> in{' '}
        <code className="text-foreground">src/config/site.config.ts</code> and the scheduler appears
        here. Both supported providers embed for free.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
        <a
          href="https://cal.com"
          rel="noopener noreferrer"
          target="_blank"
          className="underline underline-offset-4"
        >
          Cal.com
        </a>
        <a
          href="https://calendly.com"
          rel="noopener noreferrer"
          target="_blank"
          className="underline underline-offset-4"
        >
          Calendly
        </a>
      </div>
    </div>
  );
}
