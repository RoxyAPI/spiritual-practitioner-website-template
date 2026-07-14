import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ApiKeyMissing } from '@/components/api-key-missing';
import { ReadingLayout } from '@/components/reading-layout';
import { LifePathForm } from '@/components/readings/life-path-form';
import { isEnabled } from '@/lib/readings';
import { hasApiKey } from '@/lib/roxy/client';

export const metadata: Metadata = {
  title: 'Life Path Number Calculator',
  description:
    'Calculate your life path number from your birth date and read what it means, free. The number your date reduces to, and the theme it keeps handing you.',
  alternates: { canonical: '/readings/life-path' },
};

export default function LifePathPage() {
  if (!isEnabled('lifePath')) notFound();

  return (
    <ReadingLayout
      title="Your life path number"
      lead="One number, pulled from the date you were born, describing the lesson that keeps coming back around until you take it."
      cta="Numbers name the theme. A reading tells you what to do about it this year."
    >
      {hasApiKey ? <LifePathForm /> : <ApiKeyMissing />}
    </ReadingLayout>
  );
}
