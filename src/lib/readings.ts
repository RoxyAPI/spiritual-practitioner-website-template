import { siteConfig, type ReadingKey, type ReadingToggleKey } from '@/config/site.config';

/**
 * One free reading page. The registry below is the single source of truth for which readings exist: the navigation, the mobile menu, the footer, the home page grid, and the sitemap all derive from it, so a reading is never listed in one place and missing from another.
 *
 * Turning a reading off in `site.config.ts` removes it from all of them and makes its route 404. Adding one means adding an entry here, a route folder, and a toggle key. Contract: `docs/readings.md`.
 */
export interface Reading {
  key: ReadingKey;
  href: string;
  /** Page heading and card title. */
  title: string;
  /** One line, used on the cards and in the reading grid. */
  blurb: string;
}

export const READINGS: readonly Reading[] = [
  {
    key: 'birthChart',
    href: '/readings/birth-chart',
    title: 'Free Birth Chart',
    blurb: 'Your planets, houses, and aspects, drawn as a full natal wheel.',
  },
  {
    key: 'horoscope',
    href: '/readings/horoscope',
    title: 'Daily Horoscope',
    blurb: 'A fresh reading for your sun sign, written new each day.',
  },
  {
    key: 'compatibility',
    href: '/readings/compatibility',
    title: 'Compatibility Score',
    blurb: 'Two charts, side by side, scored across the things that actually strain a relationship.',
  },
  {
    key: 'lifePath',
    href: '/readings/life-path',
    title: 'Life Path Number',
    blurb: 'The number your birth date reduces to, and what it asks of you.',
  },
  {
    key: 'tarot',
    href: '/readings/tarot',
    title: 'Three Card Tarot',
    blurb: 'Past, present, and where it is heading. Ask one real question.',
  },
  {
    key: 'humanDesign',
    href: '/readings/human-design',
    title: 'Human Design Chart',
    blurb: 'Your type, strategy, and authority, then the full bodygraph.',
  },
] as const;

/** The readings a visitor can actually reach, in registry order. */
export function enabledReadings(): Reading[] {
  return READINGS.filter((reading) => siteConfig.readings[reading.key]);
}

/** Guard for a reading page and for the sitemap. A reading switched off must not be reachable. */
export function isEnabled(key: ReadingToggleKey): boolean {
  return siteConfig.readings[key] === true;
}
