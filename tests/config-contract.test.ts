import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { siteConfig } from '@/config/site.config';
import { enabledReadings, READINGS } from '@/lib/readings';

/**
 * A fork edits `site.config.ts` and nothing else, so this suite is the contract that says the
 * edit is safe: the shapes every page depends on are present, and no reading can be switched on
 * without a page behind it. It runs before every push.
 */
const PALETTES = ['rosewater', 'eucalyptus', 'kiln', 'moonlit'];

describe('identity', () => {
  it('has the fields every page and every metadata surface reads', () => {
    expect(siteConfig.name.trim()).not.toBe('');
    expect(siteConfig.title.trim()).not.toBe('');
    expect(siteConfig.tagline.trim()).not.toBe('');
    expect(siteConfig.bio.short.trim()).not.toBe('');
    expect(siteConfig.bio.long.length).toBeGreaterThan(0);
  });

  it('points siteUrl at an absolute origin with no trailing slash, which the sitemap and canonicals build on', () => {
    expect(() => new URL(siteConfig.siteUrl)).not.toThrow();
    expect(siteConfig.siteUrl).toMatch(/^https?:\/\//);
    expect(siteConfig.siteUrl.endsWith('/')).toBe(false);
  });

  it('ships a portrait that actually exists at the configured path', () => {
    const path = fileURLToPath(new URL(`../public${siteConfig.photo.src}`, import.meta.url));
    expect(existsSync(path), `missing ${siteConfig.photo.src} in public/`).toBe(true);
    expect(siteConfig.photo.alt.trim()).not.toBe('');
  });

  it('uses a palette that the stylesheet defines', () => {
    expect(PALETTES).toContain(siteConfig.palette);
  });
});

describe('content', () => {
  it('has services with the fields the cards and the structured data need', () => {
    expect(siteConfig.services.length).toBeGreaterThan(0);
    for (const service of siteConfig.services) {
      expect(service.name.trim()).not.toBe('');
      expect(service.description.trim()).not.toBe('');
      expect(service.duration.trim()).not.toBe('');
      expect(service.price.trim()).not.toBe('');
    }
  });

  it('has FAQ entries, which both the page and the FAQ structured data depend on', () => {
    expect(siteConfig.faq.length).toBeGreaterThan(0);
    for (const entry of siteConfig.faq) {
      expect(entry.question.trim()).not.toBe('');
      expect(entry.answer.trim()).not.toBe('');
    }
  });

  it('gives every social link an absolute URL', () => {
    for (const social of siteConfig.socials) {
      expect(() => new URL(social.href), `bad social href: ${social.href}`).not.toThrow();
    }
  });

  it('uses a booking provider the booking page can render', () => {
    expect(['calcom', 'calendly']).toContain(siteConfig.booking.provider);
  });
});

describe('reading toggles', () => {
  it('gives every reading page a toggle, so nothing can ship unreachable or unremovable', () => {
    for (const reading of READINGS) {
      expect(siteConfig.readings, `no toggle for ${reading.key}`).toHaveProperty(reading.key);
    }
  });

  it('has a page behind every toggle that is switched on', () => {
    for (const reading of enabledReadings()) {
      const segment = reading.href.replace('/readings/', '');
      const page = fileURLToPath(
        new URL(`../src/app/readings/${segment}/page.tsx`, import.meta.url),
      );
      expect(existsSync(page), `${reading.key} is enabled but ${reading.href} has no page`).toBe(
        true,
      );
    }
  });

  it('keeps the Card of the Day toggle, which the home page reads', () => {
    expect(typeof siteConfig.readings.cardOfTheDay).toBe('boolean');
  });
});
