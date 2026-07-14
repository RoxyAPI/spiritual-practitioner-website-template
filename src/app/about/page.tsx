import type { Metadata } from 'next';
import Image from 'next/image';
import { BookingCta } from '@/components/booking-cta';
import { JsonLd } from '@/components/json-ld';
import { siteConfig } from '@/config/site.config';
import { personJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'About',
  description: `${siteConfig.name}, ${siteConfig.title.toLowerCase()} in ${siteConfig.location ?? 'practice'}. How the readings work, what the training behind them is, and who they are for.`,
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="divide-y divide-border/60">
      <JsonLd data={personJsonLd()} />

      <section className="grid gap-12 py-16 sm:py-24 md:grid-cols-[1fr_1.3fr] md:gap-16">
        <div className="mx-auto w-full max-w-xs md:mx-0 md:max-w-none">
          <Image
            src={siteConfig.photo.src}
            alt={siteConfig.photo.alt}
            width={1200}
            height={1600}
            sizes="(max-width: 768px) 80vw, 400px"
            className="w-full rounded-3xl border border-border object-cover"
          />
        </div>

        <div>
          <p className="eyebrow text-primary">About</p>
          <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
            The chart does not decide. It clarifies.
          </h1>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted-foreground">
            {siteConfig.bio.long.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>

          {siteConfig.location ? (
            <p className="mt-8 text-sm text-muted-foreground">Based in {siteConfig.location}</p>
          ) : null}

          {siteConfig.socials.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-5">
              {siteConfig.socials.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    rel="me noopener noreferrer"
                    target="_blank"
                    className="text-sm underline underline-offset-4"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      {siteConfig.stats && siteConfig.stats.length > 0 ? (
        <section className="py-16 sm:py-24">
          <dl className="grid gap-10 text-center sm:grid-cols-3">
            {siteConfig.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-4xl">{stat.value}</span>
                  <span className="mt-2 block text-sm text-muted-foreground">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <section className="py-16 sm:py-24">
        <BookingCta line="If you have read this far, the question you came with is probably worth an hour." />
      </section>
    </div>
  );
}
