import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { BookingCta } from '@/components/booking-cta';
import { CardOfTheDay } from '@/components/card-of-the-day';
import { JsonLd } from '@/components/json-ld';
import { PullQuote } from '@/components/pull-quote';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site.config';
import { enabledReadings } from '@/lib/readings';
import { personJsonLd, professionalServiceJsonLd } from '@/lib/seo';

/**
 * The home page is rebuilt on a timer rather than on every request, which is what keeps the Card of
 * the Day to a handful of API calls a day no matter how much traffic the site gets. Everything else
 * on the page is static content from the config.
 */
export const revalidate = 3600;

export default function HomePage() {
  const readings = enabledReadings();
  const [firstQuote, secondQuote] = siteConfig.testimonials;
  const services = siteConfig.services.slice(0, 3);

  return (
    <div className="divide-y divide-border/60">
      <JsonLd data={personJsonLd()} />
      <JsonLd data={professionalServiceJsonLd()} />

      <section className="wash grid items-center gap-12 py-16 sm:py-24 md:grid-cols-2 md:gap-16">
        <div>
          <p className="eyebrow text-primary">{siteConfig.title}</p>
          <h1 className="mt-5 font-display text-4xl leading-[1.15] sm:text-5xl">
            {siteConfig.tagline}
            <HandUnderline />
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">{siteConfig.bio.short}</p>
          <div className="mt-9 flex flex-wrap items-center gap-6">
            <Button asChild size="lg" className="eyebrow">
              <Link href="/book">Book a Reading</Link>
            </Button>
            {readings.length > 0 ? (
              <Link
                href="/readings"
                className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Try a free reading
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            ) : null}
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm md:max-w-none">
          <Image
            src={siteConfig.photo.src}
            alt={siteConfig.photo.alt}
            width={1200}
            height={1600}
            sizes="(max-width: 768px) 90vw, 480px"
            priority
            className="w-full rounded-3xl border border-border object-cover"
          />
        </div>
      </section>

      <section className="grid gap-10 py-16 sm:py-24 md:grid-cols-[1fr_1.4fr] md:gap-16">
        <h2 className="font-display text-3xl leading-tight sm:text-4xl">
          What a reading is, and what it is not
        </h2>
        <div className="space-y-5 text-lg text-muted-foreground">
          <p>
            A reading is not a verdict handed down from the sky. It is an hour with someone who has
            studied the pattern you are standing inside, and who will say the true thing plainly.
          </p>
          <p>{siteConfig.bio.long[0]}</p>
          <p>
            <Link href="/about" className="text-foreground underline underline-offset-4">
              More about how I work
            </Link>
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-primary">Sessions</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">Ways we can work together</h2>
          </div>
          <Link
            href="/services"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            All sessions and prices
          </Link>
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <li key={service.name} className="flex flex-col rounded-2xl border border-border bg-card p-8">
              <h3 className="font-display text-xl">{service.name}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
              <p className="mt-6 flex items-baseline justify-between border-t border-border pt-5">
                <span className="text-sm text-muted-foreground">{service.duration}</span>
                <span className="font-display text-2xl">{service.price}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      {firstQuote ? (
        <section className="py-16 sm:py-24">
          <PullQuote {...firstQuote} />
        </section>
      ) : null}

      <CardOfTheDay />

      {readings.length > 0 ? (
        <section className="wash py-16 sm:py-24">
          <p className="eyebrow text-primary">Free Readings</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl sm:text-4xl">
            Start with something real, before you spend anything
          </h2>
          <p className="mt-5 max-w-xl text-muted-foreground">
            Every reading below is calculated properly, from your own birth details. No signup, no
            email wall.
          </p>

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {readings.map((reading) => (
              <li key={reading.key}>
                <Link
                  href={reading.href}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-8 transition-colors hover:border-primary/50"
                >
                  <h3 className="font-display text-xl">{reading.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {reading.blurb}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm text-primary">
                    Open the reading
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {secondQuote ? (
        <section className="py-16 sm:py-24">
          <PullQuote {...secondQuote} />
        </section>
      ) : null}

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
        <BookingCta
          heading="Bring me the question you cannot answer alone"
          line="Sessions are on video, recorded for you, and there is no upsell waiting at the end of them."
        />
      </section>
    </div>
  );
}

/** A hand-drawn stroke under the headline. The one flourish on the page. */
function HandUnderline() {
  return (
    <svg
      viewBox="0 0 300 12"
      fill="none"
      aria-hidden
      className="mt-3 h-3 w-56 text-accent"
      preserveAspectRatio="none"
    >
      <path
        d="M2 8.5C48 3.5 104 2.5 150 4.5c46 2 100 3.5 148 1"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
