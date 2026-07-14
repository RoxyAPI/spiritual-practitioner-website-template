/**
 * The one file a practitioner edits.
 *
 * @remarks Everything on the site reads from here: pages, navigation, metadata, structured data, the social card, and the booking links. Replace the values below with your own, swap `public/portrait.jpg` for your photo, and the site is yours. No component edits needed.
 *
 * The only secret this project uses is `ROXYAPI_KEY` in `.env.local`. Nothing secret belongs in this file, which is why the Web3Forms access key (publishable by design) is allowed to live here.
 *
 * Full field reference: `docs/config.md`.
 */

import type { SiteConfig } from '@/types';

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

  /**
   * Your scheduling link. `provider` is `'calcom'` or `'calendly'`; both embed for free.
   *
   * @remarks `url` ships empty on purpose. While it is empty the booking page shows a short setup card instead of a broken embed, so the site is presentable before you have a scheduling account. Paste the public link (for example `https://cal.com/your-name/reading`) and the scheduler appears. Comparison of the two providers: `docs/integrations.md`.
   */
  booking: {
    provider: 'calcom',
    url: '',
  },

  /**
   * Web3Forms access key, which is what makes the contact form work with no backend.
   *
   * @remarks Get one free at web3forms.com; it is emailed to you in a minute. This key is publishable by design (it only routes mail to one inbox), which is why it lives here rather than in an environment variable, and why deploying this site needs exactly one secret. Until you replace the placeholder the form renders but tells the visitor it is not connected.
   */
  contact: {
    web3formsKey: 'YOUR_WEB3FORMS_ACCESS_KEY',
  },

  /**
   * The colour palette. Change this one word and every page, every reading component, and the social card change with it.
   *
   * Four are built in, each with a light and a dark variant, all contrast checked:
   *
   * - `'rosewater'` (default): blush and deep rose with champagne gold. Romantic, tender, warm.
   * - `'eucalyptus'`: soft sage and green with a warm clay accent. Grounded, restorative, calm.
   * - `'kiln'`: terracotta and clay on warm cream. Earthy, handmade, rooted in craft.
   * - `'moonlit'`: deep ink blue and gold. Celestial and candlelit, without a hint of purple.
   *
   * @remarks Editing a colour, or adding a fifth palette, is a bigger job than editing this line: the tokens live in `globals.css` and a test holds them to the contrast rules. Full token tables and that procedure: `docs/design.md`.
   *
   * @example Switch the whole site to the night palette.
   * ```ts
   * palette: 'moonlit',
   * ```
   */
  palette: 'rosewater',

  /**
   * Which free readings the site offers. Every one is on by default.
   *
   * @remarks Switch one to `false` and its page returns 404 and its link disappears from the header, the mobile menu, the footer, the home page grid, and the sitemap. There is nothing else to clean up. `cardOfTheDay` is not a page: it is the daily tarot card on the home page. What each reading asks the visitor for: `docs/readings.md`.
   */
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
