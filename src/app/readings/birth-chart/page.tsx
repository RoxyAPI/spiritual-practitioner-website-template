import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ApiKeyMissing } from '@/components/api-key-missing';
import { BirthChartForm } from '@/components/readings/birth-chart-form';
import { ReadingLayout } from '@/components/reading-layout';
import { isEnabled } from '@/lib/readings';
import { hasApiKey } from '@/lib/roxy/client';

export const metadata: Metadata = {
  title: 'Free Birth Chart',
  description:
    'Draw your full natal chart free: planets, houses, and aspects, calculated from your birth date, time, and city. No signup, no email required.',
  alternates: { canonical: '/readings/birth-chart' },
};

export default function BirthChartPage() {
  if (!isEnabled('birthChart')) notFound();

  return (
    <ReadingLayout
      title="Your birth chart, drawn properly"
      lead="Enter the moment you were born and the chart is calculated from real ephemeris data, the same way it would be for a paid session. Nothing is stored."
      cta="A chart is a map, and maps are easier to read with someone who has walked the ground. Bring yours to a full session."
    >
      {hasApiKey ? <BirthChartForm /> : <ApiKeyMissing />}
    </ReadingLayout>
  );
}
