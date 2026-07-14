import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ApiKeyMissing } from '@/components/api-key-missing';
import { ReadingLayout } from '@/components/reading-layout';
import { CompatibilityForm } from '@/components/readings/compatibility-form';
import { isEnabled } from '@/lib/readings';
import { hasApiKey } from '@/lib/roxy/client';

export const metadata: Metadata = {
  title: 'Free Compatibility Score',
  description:
    'Compare two birth charts and get a compatibility score with the category breakdown behind it. Free, calculated from both birth moments, no signup.',
  alternates: { canonical: '/readings/compatibility' },
};

export default function CompatibilityPage() {
  if (!isEnabled('compatibility')) notFound();

  return (
    <ReadingLayout
      title="Two charts, honestly compared"
      lead="A score is a headline. What matters is the breakdown underneath it: where you meet easily, and where the work is."
      cta="A number cannot tell you what to do with a relationship. An hour with both charts open can."
    >
      {hasApiKey ? <CompatibilityForm /> : <ApiKeyMissing />}
    </ReadingLayout>
  );
}
