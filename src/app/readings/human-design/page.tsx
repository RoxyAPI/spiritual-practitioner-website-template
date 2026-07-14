import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ApiKeyMissing } from '@/components/api-key-missing';
import { ReadingLayout } from '@/components/reading-layout';
import { HumanDesignForm } from '@/components/readings/human-design-form';
import { isEnabled } from '@/lib/readings';
import { hasApiKey } from '@/lib/roxy/client';

export const metadata: Metadata = {
  title: 'Free Human Design Chart',
  description:
    'Get your human design type, strategy, and authority free, then open the full bodygraph with its defined centers, channels, and gates.',
  alternates: { canonical: '/readings/human-design' },
};

export default function HumanDesignPage() {
  if (!isEnabled('humanDesign')) notFound();

  return (
    <ReadingLayout
      title="Your type, then your whole bodygraph"
      lead="Start with the four words most people come for: type, strategy, authority, profile. Open the full chart when you want the detail underneath them."
      cta="Knowing your type is the first hour of the work. The rest of it is learning to live like it."
    >
      {hasApiKey ? <HumanDesignForm /> : <ApiKeyMissing />}
    </ReadingLayout>
  );
}
