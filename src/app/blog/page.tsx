import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { BookingCta } from '@/components/booking-cta';
import { PageHeader } from '@/components/page-header';
import { siteConfig } from '@/config/site.config';
import { formatDate, listPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Writing',
  description: `Plain writing on birth charts, tarot, and what a reading can and cannot do, by ${siteConfig.name}. No hype, no horoscope filler.`,
  alternates: { canonical: '/blog' },
};

export default async function BlogPage() {
  const posts = await listPosts();

  return (
    <div className="divide-y divide-border/60">
      <PageHeader
        eyebrow="Writing"
        title="Notes between sessions"
        lead="The questions that come up often enough to be worth writing down properly, answered here rather than repeated in every reading."
      />

      <section className="py-16 sm:py-24">
        {posts.length === 0 ? (
          <p className="text-muted-foreground">The first post is on its way.</p>
        ) : (
          <ul className="divide-y divide-border">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-3 py-10">
                  <time dateTime={post.date} className="eyebrow text-muted-foreground">
                    {formatDate(post.date)}
                  </time>
                  <h2 className="font-display text-2xl transition-colors group-hover:text-primary sm:text-3xl">
                    {post.title}
                  </h2>
                  <p className="max-w-2xl text-muted-foreground">{post.description}</p>
                  <span className="mt-2 inline-flex items-center gap-2 text-sm text-primary">
                    Read this
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="py-16 sm:py-24">
        <BookingCta line="Reading about it only goes so far. The chart in front of you is where it gets specific." />
      </section>
    </div>
  );
}
