import type { Metadata } from 'next';
import { BookingCta } from '@/components/booking-cta';
import { FaqAccordion } from '@/components/faq-accordion';
import { JsonLd } from '@/components/json-ld';
import { PageHeader } from '@/components/page-header';
import { siteConfig } from '@/config/site.config';
import { faqJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Questions',
  description: `What to bring to a reading, which session to choose, what actually happens in one, and what a chart cannot tell you. Answered plainly by ${siteConfig.name}.`,
  alternates: { canonical: '/faq' },
};

export default function FaqPage() {
  return (
    <div className="divide-y divide-border/60">
      <JsonLd data={faqJsonLd()} />

      <PageHeader
        eyebrow="Questions"
        title="Everything people ask before booking"
        lead="If your question is not here, write to me. I would rather answer it than have you guess."
      />

      <section className="py-16 sm:py-24">
        <div className="max-w-3xl">
          {/* The accordion renders each question as an h3, so without this the page would jump from h1 to h3. */}
          <h2 className="sr-only">Questions and answers</h2>
          <FaqAccordion items={siteConfig.faq} />
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <BookingCta line="Answered? Then the only thing left is to pick a time." />
      </section>
    </div>
  );
}
