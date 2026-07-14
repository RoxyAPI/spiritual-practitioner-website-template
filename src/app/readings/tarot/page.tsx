import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ApiKeyMissing } from '@/components/api-key-missing';
import { TarotForm } from '@/components/readings/tarot-form';
import { ReadingLayout } from '@/components/reading-layout';
import { isEnabled } from '@/lib/readings';
import { hasApiKey } from '@/lib/roxy/client';

export const metadata: Metadata = {
  title: 'Free Three Card Tarot Reading',
  description:
    'Pull a free three card tarot spread: past, present, and where it is heading, with the reading for each position. Ask one real question.',
  alternates: { canonical: '/readings/tarot' },
};

export default function TarotPage() {
  if (!isEnabled('tarot')) notFound();

  return (
    <ReadingLayout
      title="Three cards, one question"
      lead="Past, present, and the direction of travel. Ask about something you are genuinely inside of, and read the cards as description rather than instruction."
      cta="A spread opens the question. A session is where we sit with the answer and decide what you are actually going to do."
    >
      {hasApiKey ? <TarotForm /> : <ApiKeyMissing />}
    </ReadingLayout>
  );
}
