import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BookingCta } from '@/components/booking-cta';
import { PageHeader } from '@/components/page-header';
import { Section } from '@/components/section';
import { siteConfig } from '@/config/site.config';

export const metadata: Metadata = {
  title: 'Testimonials',
  description: `What people say after a session with ${siteConfig.name}. Unedited words from clients who came with a real question.`,
  alternates: { canonical: '/testimonials' },
};

export default function TestimonialsPage() {
  // The only page that can be genuinely empty. With no testimonials in the config it does not exist.
  if (siteConfig.testimonials.length === 0) notFound();

  return (
    <div className="divide-y divide-border/60">
      <PageHeader
        eyebrow="In their words"
        title="What people say afterwards"
        lead="Every quote below is from someone who booked, sat down, and let the session go where it needed to."
      />

      <Section>
        <ul className="grid gap-6 md:grid-cols-2">
          {siteConfig.testimonials.map((testimonial) => (
            <li
              key={testimonial.quote.slice(0, 40)}
              className="flex flex-col rounded-2xl border border-border bg-card p-8 sm:p-10"
            >
              <blockquote className="flex-1 font-display text-xl italic leading-relaxed">
                {testimonial.quote}
              </blockquote>
              <p className="mt-8 border-t border-border pt-6">
                <span className="script block text-primary">{testimonial.name}</span>
                {testimonial.detail ? (
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {testimonial.detail}
                  </span>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <BookingCta line="The next one of these could be about your reading." />
      </Section>
    </div>
  );
}
