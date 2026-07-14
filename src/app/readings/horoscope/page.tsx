import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ApiKeyMissing } from '@/components/api-key-missing';
import { ReadingLayout } from '@/components/reading-layout';
import { HoroscopeForm } from '@/components/readings/horoscope-form';
import { isEnabled } from '@/lib/readings';
import { hasApiKey } from '@/lib/roxy/client';

export const metadata: Metadata = {
  title: 'Daily Horoscope',
  description:
    'Read your daily horoscope for any sun sign, written fresh each day from the current sky rather than recycled from last year. Free, no signup.',
  alternates: { canonical: '/readings/horoscope' },
};

export default function HoroscopePage() {
  if (!isEnabled('horoscope')) notFound();

  return (
    <ReadingLayout
      title="Your horoscope for today"
      lead="A sun sign horoscope is the weather report, not the map. It is a fine place to start, and a poor place to stop."
      cta="If today keeps repeating itself, the answer is in the birth chart, not the horoscope."
    >
      {hasApiKey ? <HoroscopeForm /> : <ApiKeyMissing />}
    </ReadingLayout>
  );
}
