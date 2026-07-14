/**
 * The one file a practitioner edits.
 *
 * @remarks Everything on the site reads from here: pages, navigation, metadata, structured data, the social card, and the booking links. Replace the values below with your own, swap `public/portrait.jpg` for your photo, and the site is yours. No component edits needed.
 *
 * The only secret this project uses is `ROXYAPI_KEY` in `.env.local`. Nothing secret belongs in this file, which is why the Web3Forms access key (publishable by design) is allowed to live here.
 *
 * Full field reference: `docs/config.md`.
 */

/** Prebuilt colour palettes. Token tables and contrast notes: `docs/design.md`. */
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

export interface SiteConfig {
  /** Practitioner display name. Titles, structured data, social card, footer. */
  name: string;
  /** Profession line, for example "Astrologer and Tarot Reader". */
  title: string;
  /** One sentence promise. Hero headline and default meta description. Aim for 140 to 160 characters. */
  tagline: string;
  /** Absolute deployed URL, no trailing slash. Sitemap, robots, canonicals, and social cards all derive from it. */
  siteUrl: string;
  /** The portrait in `public/`. Replace the file, keep the dimensions (1200x1600). */
  photo: { src: string; alt: string };
  /** `short` runs on the home page, `long` is the About page, one string per paragraph. */
  bio: { short: string; long: string[] };
  /** Shown on the contact page when set. */
  email?: string;
  /** City and country only. Never a street address. */
  location?: string;
  /** Footer and About links. Also becomes `sameAs` in the structured data. */
  socials: { label: string; href: string }[];
  /** The offer. `price` is a display string. `paymentLink` is your own payment page, if you take payment outside the booking flow. */
  services: {
    name: string;
    description: string;
    duration: string;
    price: string;
    paymentLink?: string;
  }[];
  /** Interleaved through the home page as pull-quotes. An empty array hides the section and the page. */
  testimonials: { quote: string; name: string; detail?: string }[];
  /** Optional trust strip on the home and About pages. */
  stats?: { value: string; label: string }[];
  /** Optional dismissible line above the header. */
  announcement?: string;
  /** Optional link out to a signup page you host anywhere. No embed, no integration. */
  newsletter?: { label: string; href: string };
  /** FAQ page and FAQ structured data. Answer the objections that come up before a booking. */
  faq: { question: string; answer: string }[];
  /** Your public scheduling link. Leave `url` empty until you have one: the booking page then shows a setup card instead of a broken embed. Providers: `docs/integrations.md`. */
  booking: { provider: 'calcom' | 'calendly'; url: string };
  /** Web3Forms access key. It is publishable by design and routes mail to one inbox. */
  contact: { web3formsKey: string };
  /** One of the prebuilt palettes. Sets `data-palette` on the document. */
  palette: PaletteKey;
  /** Turn each free reading on or off. Off means the page 404s and the link disappears everywhere. */
  readings: Record<ReadingToggleKey, boolean>;
}

export const siteConfig: SiteConfig = {
  name: 'Elena Voss',
  title: 'Astrologer and Tarot Reader',
  tagline:
    'Readings that turn a hard season into a clear next step, grounded in your birth chart and read with you, never at you.',
  siteUrl: 'https://spiritual-practitioner-website-template.vercel.app',

  photo: {
    src: '/portrait.jpg',
    alt: 'Elena Voss, astrologer and tarot reader',
  },

  bio: {
    short:
      'You are not looking for a prediction. You are looking for language for what you already sense. I read birth charts and tarot for people in the middle of a decision, and I stay with the practical question underneath the symbols.',
    long: [
      'Most people arrive at a reading holding one question they have not been able to say out loud. A job that looks right and feels wrong. A relationship that keeps repeating one argument. A move they cannot decide is brave or reckless. The chart does not answer that question for you. It gives you the shape of it, and once you can see the shape, the decision usually stops feeling impossible.',
      'I have been reading charts for twelve years, and tarot for longer than that. My training is traditional: Hellenistic technique for the natal work, Marseille and Waite for the cards. My approach is plain. I will not tell you that a transit is doing something to you. I will show you what season you are in, what it tends to ask of people, and what you can actually do with it.',
      'I read for people in fourteen countries, in English, over video. Sessions are recorded so you can come back to them, because nobody remembers a reading properly while they are inside it. If you are unsure which session fits, write to me and describe the question. I will tell you honestly if a reading is the wrong tool for it.',
    ],
  },

  email: 'hello@example.com',
  location: 'Lisbon, Portugal',

  socials: [
    { label: 'Instagram', href: 'https://instagram.com/' },
    { label: 'YouTube', href: 'https://youtube.com/' },
    { label: 'Substack', href: 'https://substack.com/' },
  ],

  services: [
    {
      name: 'Birth Chart Reading',
      description:
        'The full natal chart, read from the ground up. Where your strengths sit, what keeps repeating, and what the next two years are shaped like. Best for a first session, or a reset.',
      duration: '75 minutes',
      price: '$180',
    },
    {
      name: 'Tarot Session',
      description:
        'One question, opened properly. We lay the cards on the decision you are actually facing and stay with it until the next step is concrete rather than comforting.',
      duration: '45 minutes',
      price: '$95',
    },
    {
      name: 'Year Ahead Forecast',
      description:
        'Your solar return and the transits that carry it, mapped month by month, with the two or three windows that matter marked clearly. Best booked near your birthday.',
      duration: '90 minutes',
      price: '$240',
    },
  ],

  testimonials: [
    {
      quote:
        'I came in expecting to be told what would happen. Instead I left able to explain, for the first time, why I had been stuck in the same year three times over.',
      name: 'Marta R.',
      detail: 'Birth chart reading',
    },
    {
      quote:
        'Elena is exact and she is kind, in that order. She did not soften the part I needed to hear, and she did not leave me alone with it either.',
      name: 'Jonah B.',
      detail: 'Year ahead forecast',
    },
    {
      quote:
        'I have had readings that felt like a performance. This felt like a conversation with someone who had done the homework on me.',
      name: 'Priya N.',
      detail: 'Tarot session',
    },
  ],

  stats: [
    { value: '12 years', label: 'Reading professionally' },
    { value: '2,400+', label: 'Sessions given' },
    { value: '14', label: 'Countries' },
  ],

  announcement: 'Booking is open for August. Two chart reading slots left.',

  newsletter: {
    label: 'A letter each new moon',
    href: 'https://substack.com/',
  },

  faq: [
    {
      question: 'What do I need to bring to a reading?',
      answer:
        'Your birth date, birth time, and birth city. The time matters more than people expect: it sets the houses, which is most of what makes a chart yours rather than generic. Look for it on your birth certificate or ask a parent. If it is truly unavailable, say so when you book and we will work with what we have.',
    },
    {
      question: 'Which session should I choose?',
      answer:
        'If we have never worked together, start with the birth chart reading. It is the foundation everything else stands on. Choose the tarot session when you have one specific decision in front of you, and the year ahead forecast when the question is about timing rather than meaning.',
    },
    {
      question: 'What actually happens in the session?',
      answer:
        'We meet on video for the booked time. I have already read your chart before we start, so we spend the session in conversation rather than in silence while I work. You can interrupt, disagree, and ask me to slow down at any point. You get the recording afterwards.',
    },
    {
      question: 'Is this going to predict my future?',
      answer:
        'No, and be careful of anyone who says otherwise. A chart describes conditions and tendencies, the way a forecast describes weather. It tells you what season you are in and what that season tends to ask of people. What you do inside it stays yours.',
    },
    {
      question: 'Can you tell me about my health, my legal case, or my finances?',
      answer:
        'No. Readings are for reflection, not for medical, legal, or financial advice, and I will always say so rather than guess. If a question needs a doctor, a lawyer, or an accountant, that is who it needs.',
    },
    {
      question: 'What if I need to reschedule?',
      answer:
        'Move the booking yourself using the link in your confirmation email, any time up to 24 hours before we meet. Inside 24 hours, write to me and we will find another slot. Life happens and I would rather you came to the session when you can be present for it.',
    },
  ],

  booking: {
    provider: 'calcom',
    url: '',
  },

  contact: {
    web3formsKey: 'YOUR_WEB3FORMS_ACCESS_KEY',
  },

  palette: 'rosewater',

  readings: {
    birthChart: true,
    horoscope: true,
    compatibility: true,
    lifePath: true,
    tarot: true,
    humanDesign: true,
    cardOfTheDay: true,
  },
};
