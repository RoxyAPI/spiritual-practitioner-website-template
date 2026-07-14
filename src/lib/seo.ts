import { siteConfig } from '@/config/site.config';

/**
 * Structured data, built from the config so a fork never edits a schema by hand.
 *
 * @remarks Search engines and AI assistants read these blocks to understand who the practitioner is, what they offer, and what the site answers. Every builder is a pure function of `site.config.ts`, and `tests/jsonld.test.ts` asserts each one still emits the types documented in `docs/seo.md`.
 */
type JsonLd = Record<string, unknown>;

/** Absolute URL for a path, since structured data must not use relative links. */
function url(path = ''): string {
  return `${siteConfig.siteUrl}${path}`;
}

/**
 * Prices in the config are display strings, so a fork can write them the way it says them out loud. Only a leading currency symbol we recognise becomes a machine-readable offer; anything else stays out of the structured data rather than being guessed at.
 */
const CURRENCIES: Record<string, string> = { $: 'USD', '€': 'EUR', '£': 'GBP', '₹': 'INR' };

function offer(price: string): JsonLd | undefined {
  const currency = CURRENCIES[price.trim().charAt(0)];
  const amount = price.replace(/[^0-9.]/g, '');
  if (!currency || !amount) return undefined;
  return { '@type': 'Offer', price: amount, priceCurrency: currency, url: url('/book') };
}

export function personJsonLd(): JsonLd {
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
  };
}

export function professionalServiceJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': url('#practice'),
    name: siteConfig.name,
    description: siteConfig.tagline,
    url: url(),
    image: url(siteConfig.photo.src),
    provider: { '@id': url('#person') },
    ...(siteConfig.location ? { areaServed: siteConfig.location } : {}),
    ...(siteConfig.socials.length > 0
      ? { sameAs: siteConfig.socials.map((social) => social.href) }
      : {}),
  };
}

/** One `Service` per entry in the config, wrapped in a list so a single script tag carries them all. */
export function serviceListJsonLd(): JsonLd {
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
  };
}

export function faqJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: siteConfig.faq.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  };
}
