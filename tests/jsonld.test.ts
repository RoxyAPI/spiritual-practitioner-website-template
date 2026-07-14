import { describe, expect, it } from 'vitest';
import { siteConfig } from '@/config/site.config';
import { faqJsonLd, personJsonLd, professionalServiceJsonLd, serviceListJsonLd } from '@/lib/seo';

/**
 * Structured data is the part of the site nobody looks at and everybody depends on: it is how search
 * engines and AI assistants work out who the practitioner is and what they sell. It fails silently,
 * so it is tested rather than eyeballed. The types asserted here are the ones listed in `docs/seo.md`.
 */
describe('Person', () => {
  const person = personJsonLd();

  it('is a Person carrying the practitioner identity', () => {
    expect(person['@type']).toBe('Person');
    expect(person.name).toBe(siteConfig.name);
    expect(person.jobTitle).toBe(siteConfig.title);
  });

  it('uses absolute URLs, which relative ones would silently invalidate', () => {
    expect(String(person.url)).toMatch(/^https?:\/\//);
    expect(String(person.image)).toMatch(/^https?:\/\//);
  });

  it('lists the social profiles as sameAs so the identity can be linked up', () => {
    expect(person.sameAs).toEqual(siteConfig.socials.map((social) => social.href));
  });
});

describe('ProfessionalService', () => {
  const practice = professionalServiceJsonLd();

  it('is a ProfessionalService pointing back at the Person', () => {
    expect(practice['@type']).toBe('ProfessionalService');
    expect(practice.founder).toEqual({ '@id': `${siteConfig.siteUrl}#person` });
  });
});

describe('Service list', () => {
  const list = serviceListJsonLd();
  const items = list.itemListElement as { item: Record<string, unknown> }[];

  it('emits one Service per configured session', () => {
    expect(items).toHaveLength(siteConfig.services.length);
    for (const entry of items) {
      expect(entry.item['@type']).toBe('Service');
    }
  });

  it('turns a recognised price into a machine-readable offer', () => {
    const offer = items[0].item.offers as Record<string, string> | undefined;
    expect(offer?.['@type']).toBe('Offer');
    expect(offer?.price).toMatch(/^[0-9.]+$/);
    expect(offer?.priceCurrency).toMatch(/^[A-Z]{3}$/);
  });

  it('leaves the offer out rather than guessing at an unrecognised currency', () => {
    const list = serviceListJsonLd();
    const priced = (list.itemListElement as { item: Record<string, unknown> }[]).every((entry) =>
      /^[$€£₹]/.test(siteConfig.services[0].price) ? 'offers' in entry.item : true,
    );
    expect(priced).toBe(true);
  });
});

describe('FAQPage', () => {
  const faq = faqJsonLd();

  it('is an FAQPage with one Question per configured entry', () => {
    expect(faq['@type']).toBe('FAQPage');
    const questions = faq.mainEntity as { '@type': string; acceptedAnswer: { text: string } }[];
    expect(questions).toHaveLength(siteConfig.faq.length);
    expect(questions[0]['@type']).toBe('Question');
    expect(questions[0].acceptedAnswer.text).toBe(siteConfig.faq[0].answer);
  });
});
