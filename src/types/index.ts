import type { SearchCitiesResponse } from '@roxyapi/ui-react';

/**
 * Every type the site declares, in one place, imported everywhere as `@/types`.
 *
 * @remarks Types live here and nowhere else. A type declared next to the first file that happened to need it is a type the next person redeclares slightly differently, and two shapes for one thing is how a form starts sending a field the API does not read. Values (the config object, the reading registry, the helpers) stay in their own modules; only the shapes live here.
 *
 * Response types from the API are NOT redeclared here: they are re-exported from `@roxyapi/ui-react`, which generates them from the live spec. A hand-written interface for an API response keeps compiling after the spec changes and renders nothing.
 */

/** Prebuilt colour palettes. Token tables: `docs/design.md`. */
export type PaletteKey = 'rosewater' | 'eucalyptus' | 'kiln' | 'moonlit';

/** A free reading that has its own page. The Card of the Day is a home page widget, not a page, so it is toggled separately. */
export type ReadingKey =
  | 'birthChart'
  | 'horoscope'
  | 'compatibility'
  | 'lifePath'
  | 'tarot'
  | 'humanDesign';

/** Every switch under `readings`: the six reading pages plus the home page Card of the Day. */
export type ReadingToggleKey = ReadingKey | 'cardOfTheDay';

/** The practitioner portrait. Replace the file, keep the dimensions (1200x1600). */
export interface Photo {
  src: string;
  alt: string;
}

/** `short` runs on the home page; `long` is the About page, one string per paragraph. */
export interface Bio {
  short: string;
  long: string[];
}

export interface SocialLink {
  label: string;
  href: string;
}

/** One session on offer. `price` is a display string; `paymentLink` is the practitioner own payment page. */
export interface Service {
  name: string;
  description: string;
  duration: string;
  price: string;
  paymentLink?: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  /** Optional context line, for example "Birth chart reading". */
  detail?: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface FaqEntry {
  question: string;
  answer: string;
}

/** Leave `url` empty until there is a real scheduling link: the booking page then shows a setup card rather than a broken embed. */
export interface BookingConfig {
  provider: 'calcom' | 'calendly';
  url: string;
}

/** The Web3Forms access key is publishable by design, which is why it lives in the config and not in an environment variable. */
export interface ContactConfig {
  web3formsKey: string;
}

/** The one file a practitioner edits. Field-by-field reference: `docs/config.md`. */
export interface SiteConfig {
  name: string;
  title: string;
  tagline: string;
  /** Absolute deployed URL, no trailing slash. Sitemap, robots, canonicals, and social cards derive from it. */
  siteUrl: string;
  photo: Photo;
  bio: Bio;
  email?: string;
  /** City and country only. Never a street address. */
  location?: string;
  socials: SocialLink[];
  services: Service[];
  testimonials: Testimonial[];
  stats?: Stat[];
  announcement?: string;
  newsletter?: SocialLink;
  faq: FaqEntry[];
  booking: BookingConfig;
  contact: ContactConfig;
  palette: PaletteKey;
  readings: Record<ReadingToggleKey, boolean>;
}

/** One free reading page. The registry in `lib/readings.ts` is the single source of truth for which readings exist. */
export interface Reading {
  key: ReadingKey;
  href: string;
  /** Page heading and card title. */
  title: string;
  /** One line, used on the cards and in the reading grid. */
  blurb: string;
}

/** What a reading form gets back. Every reading action returns this shape, so the pages branch on one union. */
export type ReadingState<T> =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: T };

/** One city from the location search, taken from the response type rather than redeclared, so it cannot drift from the API. */
export type City = NonNullable<SearchCitiesResponse['cities']>[number];

/** Frontmatter of a blog post, plus the slug taken from its filename. */
export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  /** ISO date. The index sorts on it, newest first. */
  date: string;
  /** Optional social card override. */
  image?: string;
}
