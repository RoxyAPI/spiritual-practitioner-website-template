# Pages and Navigation

Route inventory, per-page anatomy, and the conversion structure. The page sequence follows researched service-business patterns: hero transformation promise, empathy, method, proof, one repeated primary action. Roughly 80 percent of visitors are browsing, 15 percent evaluating, 5 percent ready to book, so pages serve all three and never plaster booking buttons on every block. **One primary CTA per section, always the same action: book.**

Every page is a stack of `<Section>` elements and nothing else: the Section owns the full-width band, the container, and the rhythm, so a page never sets a width or a padding. Layout rule and the reason for it: [design.md](./design.md).

## Route table

| Route | Page | Config fields | Notes |
|---|---|---|---|
| `/` | Home | name, title, tagline, photo, bio.short, services, testimonials, readings, stats, announcement | Anatomy below |
| `/about` | About | photo, bio.long, stats, socials, location | Trust page |
| `/services` | Services | services, faq | Offer cards + FAQ + book CTA |
| `/book` | Book | booking | Scheduler embed ([integrations.md](./integrations.md)) |
| `/readings` | Free Readings hub | readings | Grid of enabled readings |
| `/readings/*` | Individual readings | readings | [readings.md](./readings.md) |
| `/blog`, `/blog/[slug]` | Blog | blog files | [blog.md](./blog.md) |
| `/testimonials` | Testimonials | testimonials | Hidden when array empty |
| `/faq` | FAQ | faq | Accordion + FAQPage JSON-LD |
| `/contact` | Contact | contact, email, socials | Form ([integrations.md](./integrations.md)) |
| `not-found` | 404 | name | Branded, links home + readings |

Per-page metadata and JSON-LD ownership: [seo.md](./seo.md). Empty-content rule: a section whose config array is empty disappears; a page whose content is entirely empty 404s and leaves nav and sitemap (testimonials is the only page this can affect).

## Home anatomy (order matters; target 800 to 1200 words of real copy)

1. Optional announcement bar (`config.announcement`, dismissible, above header).
2. **Hero**: portrait right, text left on desktop, stacked on mobile. Eyebrow (`config.title`), h1 = transformation promise (`config.tagline`, outcome language, not service names), one short line from `bio.short`, primary button "Book a Reading" to `/book`, text link "Try a free reading" to `/readings`. Hand-drawn underline accent on the h1 ([design.md](./design.md)).
3. **Intro / method**: 2 or 3 short paragraphs from `bio.short` addressing the visitor problem first, method second.
4. **Services teaser**: up to 3 service cards (name, one line, duration, price, link to `/services`). Price is always visible; the researched top of this niche shows prices plainly.
5. **Pull-quote testimonial** (first entry): full-width, interleaved, not boxed away.
6. **Card of the Day**: the cached daily tarot widget ([readings.md](./readings.md)) with a link to `/readings`.
7. **Free readings grid**: enabled readings as cards, each one line + arrow link.
8. **Second pull-quote testimonial** (second entry, when present).
9. **Stats strip** (`config.stats`, optional): 3 or 4 numbers (years reading, sessions given). Renders only when set.
10. **Closing CTA band**: one sentence + "Book a Reading" button + optional newsletter link (`config.newsletter`).

## About anatomy

Portrait, story paragraphs (`bio.long`), credentials and training woven into the copy, stats strip, socials row, closing booking CTA. Client-first framing: the first paragraph is about who the visitor is, not the practitioner resume.

## Services anatomy

One card per `config.services` entry: name, description, duration, price, optional payment link note. Below the cards: FAQ accordion (from `config.faq`, the "what happens in a reading / which one should I choose" objections) directly above the final booking CTA, so doubts are answered at the decision point.

## Book anatomy

Short expectation-setting intro (what to prepare: birth date, time, place), then the scheduler embed, then a quiet fallback link to `/contact` for questions. Nothing else competes with the embed.

## Header and footer

- **Header**: wordmark (`config.name`, display serif) left; nav: About, Services, Free Readings, Blog, Contact; "Book a Reading" as a filled button, visually distinct, far right; theme toggle. Mobile: sheet menu with the same items, book button pinned at the bottom of the sheet. Active link styled via `usePathname`.
- **Footer**: three columns. (1) name + one-line bio + socials; (2) page links; (3) enabled reading links. Bottom row: copyright with `config.name`, newsletter link when set, small "Readings powered by [RoxyAPI](https://roxyapi.com)" credit (MIT, forks may remove it).

Nav and footer reading links derive from the toggle helper ([readings.md](./readings.md)); nothing is hardcoded.
