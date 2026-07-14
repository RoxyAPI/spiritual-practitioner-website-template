import type { Metadata } from 'next';
import { BookingCta } from '@/components/booking-cta';
import { FaqAccordion } from '@/components/faq-accordion';
import { PageHeader } from '@/components/page-header';
import { serviceListJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/json-ld';
import { siteConfig } from '@/config/site.config';

export const metadata: Metadata = {
  title: 'Sessions and Prices',
  description: `Birth chart readings, tarot sessions, and year ahead forecasts with ${siteConfig.name}. Session lengths, prices, and what happens in each one, stated plainly.`,
  alternates: { canonical: '/services' },
};

export default function ServicesPage() {
  return (
    <div className="divide-y divide-border/60">
      <JsonLd data={serviceListJsonLd()} />

      <PageHeader
        eyebrow="Sessions"
        title="Every session, and what it costs"
        lead="Prices are here rather than behind an enquiry form, because you should be able to decide in private whether this is for you."
      />

      <section className="py-16 sm:py-24">
        <ul className="space-y-6">
          {siteConfig.services.map((service) => (
            <li
              key={service.name}
              className="grid gap-6 rounded-2xl border border-border bg-card p-8 sm:p-10 md:grid-cols-[1.6fr_1fr]"
            >
              <div>
                <h2 className="font-display text-2xl">{service.name}</h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">{service.description}</p>
              </div>

              <div className="flex flex-col items-start justify-between gap-6 border-border md:items-end md:border-l md:pl-10">
                <div className="md:text-right">
                  <p className="font-display text-3xl">{service.price}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{service.duration}</p>
                </div>
                {service.paymentLink ? (
                  <a
                    href={service.paymentLink}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="text-sm underline underline-offset-4"
                  >
                    Pay for this session
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="py-16 sm:py-24">
        <div className="grid gap-10 md:grid-cols-[1fr_1.6fr] md:gap-16">
          <div>
            <p className="eyebrow text-primary">Before you book</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">The questions people ask first</h2>
          </div>
          <FaqAccordion items={siteConfig.faq} />
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <BookingCta
          heading="Pick the session that fits the question"
          line="Still unsure which one? Write to me and describe the situation. I will tell you which reading fits, or whether none of them do."
        />
      </section>
    </div>
  );
}
