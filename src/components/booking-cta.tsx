import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * The one action every page drives at. It closes each free reading and each long page, so a visitor
 * never has to hunt for the way to book. One primary action per section, always this one.
 */
export function BookingCta({
  heading = 'Ready to go deeper?',
  line,
}: {
  heading?: string;
  line: string;
}) {
  return (
    <section className="wash wash-end rounded-2xl border border-border bg-card px-6 py-14 text-center sm:px-12">
      <h2 className="font-display text-3xl sm:text-4xl">{heading}</h2>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{line}</p>
      <Button asChild size="lg" className="eyebrow mt-8">
        <Link href="/book">Book a Reading</Link>
      </Button>
    </section>
  );
}
