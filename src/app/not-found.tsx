import Link from 'next/link';
import { Section } from '@/components/section';
import { Button } from '@/components/ui/button';
import { enabledReadings } from '@/lib/readings';

export default function NotFound() {
  const readings = enabledReadings();

  return (
    <Section containerClassName="flex flex-col items-center py-32 text-center sm:py-48">
      <p className="eyebrow text-primary">Page not found</p>
      <h1 className="mt-4 max-w-lg font-display text-4xl leading-tight sm:text-5xl">
        This one is not in the chart
      </h1>
      <p className="mt-6 max-w-md text-muted-foreground">
        The page you were looking for does not exist, or it has moved. Everything else on this site
        is still where you left it.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Button asChild size="lg" className="eyebrow">
          <Link href="/">Back to the start</Link>
        </Button>
        {readings.length > 0 ? (
          <Button asChild size="lg" variant="outline" className="eyebrow">
            <Link href="/readings">Try a free reading</Link>
          </Button>
        ) : null}
      </div>
    </Section>
  );
}
