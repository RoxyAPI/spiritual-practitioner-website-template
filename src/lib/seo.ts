import type { FAQPage, ItemList, Person, ProfessionalService, WithContext } from 'schema-dts';
import { siteConfig } from '@/config/site.config';

/**
 * Structured data, built from the config so a fork never edits a schema by hand.
 *
 * @remarks Search engines and AI assistants read these blocks to work out who the practitioner is, what they offer, and what the site answers. Every builder is a pure function of `site.config.ts`.
 *
 * Each builder ends in `satisfies WithContext<T>`, where `T` comes from `schema-dts` (the Schema.org vocabulary as TypeScript types). That is the point: a misspelled property or a value of the wrong shape is a TYPE ERROR at build time, not a silently ignored block that Google drops months later. `tests/jsonld.test.ts` then asserts the output still carries the types listed in `docs/seo.md`.
 */

/** Absolute URL for a path. Structured data must never use a relative link. */
function url(path = ''): string {
  return `${siteConfig.siteUrl}${path}`;
}

/**
 * Prices in the config are display strings, so a fork can write them the way it says them out loud. Only a leading currency symbol we recognise becomes a machine-readable offer; anything else is left out rather than guessed at, because a wrong price in structured data is worse than no price.
 */
const CURRENCIES: Record<string, string> = { $: 'USD', '€': 'EUR', '£': 'GBP', '₹': 'INR' };

function offer(price: string) {
  const currency = CURRENCIES[price.trim().charAt(0)];
  const amount = price.replace(/[^0-9.]/g, '');
  if (!currency || !amount) return undefined;

  return { '@type': 'Offer', price: amount, priceCurrency: currency, url: url('/book') } as const;
}

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': url('#person'),
    name: siteConfig.name,
    jobTitle: siteConfig.title,
    description: siteConfig.bio.short,
    image: url(siteConfig.photo.src),
    url: url(),
    ...(siteConfig.location ? { address: siteConfig.location } : {}),
    ...(siteConfig.socials.length > 0
      ? { sameAs: siteConfig.socials.map((social) => social.href) }
      : {}),
  } satisfies WithContext<Person>;
}

export function professionalServiceJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': url('#practice'),
    name: siteConfig.name,
    description: siteConfig.tagline,
    url: url(),
    image: url(siteConfig.photo.src),
    // The practitioner IS the practice. `provider` belongs on a Service, not on a business node, so the link to the Person is `founder`, which is what a search engine actually reads here.
    founder: { '@id': url('#person') },
    ...(siteConfig.location ? { areaServed: siteConfig.location } : {}),
    ...(siteConfig.socials.length > 0
      ? { sameAs: siteConfig.socials.map((social) => social.href) }
      : {}),
  } satisfies WithContext<ProfessionalService>;
}

/** One `Service` per entry in the config, wrapped in a list so a single script tag carries them all. */
export function serviceListJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: siteConfig.services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: service.name,
        description: service.description,
        serviceType: siteConfig.title,
        provider: { '@id': url('#person') },
        url: url('/services'),
        ...(offer(service.price) ? { offers: offer(service.price) } : {}),
      },
    })),
  } satisfies WithContext<ItemList>;
}

export function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: siteConfig.faq.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  } satisfies WithContext<FAQPage>;
}
