import type { ReactNode } from 'react';
import { BookingCta } from '@/components/booking-cta';
import { PageHeader } from '@/components/page-header';

/**
 * The frame every free reading sits in. The booking call to action closes each one because the
 * reading is the appetizer and the session is the product: a visitor who just got something real
 * for free is the likeliest person on the site to book.
 */
export function ReadingLayout({
  title,
  lead,
  cta,
  children,
}: {
  title: string;
  lead: string;
  cta: string;
  children: ReactNode;
}) {
  return (
    <div className="divide-y divide-border/60">
      <PageHeader eyebrow="Free Reading" title={title} lead={lead} />

      <section className="py-16 sm:py-24">{children}</section>

      <section className="py-16 sm:py-24">
        <BookingCta line={cta} />
      </section>
    </div>
  );
}
