# site.config.ts (the one file a practitioner edits)

`src/config/site.config.ts` is the single customization surface. Editing it plus replacing one photo rebrands the entire site: pages, navigation, SEO, structured data, social cards, booking. No component edits needed for a standard fork.

The config is a typed object. `tests/config-contract.test.ts` fails the build when it drifts from this schema ([code.md](./code.md)).

## Schema

| Field | Type | Notes |
|---|---|---|
| `name` | `string` | Practitioner display name. Drives titles, JSON-LD Person, OG card, footer. |
| `title` | `string` | Profession line, e.g. `Astrologer and Tarot Reader`. Hero subline + default title suffix. |
| `tagline` | `string` | One sentence value promise. Hero + default meta description. 140 to 160 chars. |
| `siteUrl` | `string` | Absolute deployed URL, no trailing slash. Single source for sitemap, robots, canonical, JSON-LD, OG ([seo.md](./seo.md)). |
| `photo` | `{ src, alt }` | The practitioner portrait, `/portrait.jpg` in `public/`. Exact dimensions and replacement steps: [design.md](./design.md). |
| `bio` | `{ short, long[] }` | `short` = one paragraph for the home intro. `long` = paragraph array for the About page. |
| `email` | `string?` | Shown on the contact page when set. |
| `location` | `string?` | City and country only, shown in footer and About. Never a street address. |
| `socials` | `{ label, href }[]` | Rendered in footer and About; feeds JSON-LD `sameAs`. |
| `services` | `{ name, description, duration, price, paymentLink? }[]` | The offer list. `price` is a display string (`$120`). `paymentLink` is the practitioner payment URL shown after booking info ([integrations.md](./integrations.md)). Each entry emits a JSON-LD `Service`. |
| `testimonials` | `{ quote, name, detail? }[]` | `detail` = optional context line (`Reading client, 2026`). Empty array hides the section and page. |
| `stats` | `{ value, label }[]?` | Trust strip (`10 years reading`, `4000+ sessions`). Renders on Home + About only when set. |
| `announcement` | `string?` | One-line dismissible bar above the header. Omit to hide. |
| `newsletter` | `{ label, href }?` | Link-out to the practitioner hosted signup page (any provider). No embed, no integration. |
| `faq` | `{ question, answer }[]` | FAQ page + JSON-LD `FAQPage`. |
| `booking` | `{ provider, url }` | `provider: 'calcom' \| 'calendly'`. `url` = the public booking link. Renders the matching embed on `/book` ([integrations.md](./integrations.md)). Ships empty: an empty `url` renders a setup card, never a broken embed, so the page is presentable before the fork has a scheduling account. |
| `contact` | `{ web3formsKey }` | Web3Forms access key. It is a publishable key, safe in client code and in this file ([integrations.md](./integrations.md)). Ships as the placeholder `YOUR_WEB3FORMS_ACCESS_KEY`; the form renders but tells the visitor it is not connected until a real key replaces it. |
| `palette` | `PaletteKey` | One of the prebuilt palette keys defined in [design.md](./design.md). Sets the `data-palette` attribute on `<html>`. |
| `readings` | `Record<ReadingKey, boolean>` | On/off per free reading + `cardOfTheDay` for the home widget. Keys and behavior: [readings.md](./readings.md). |

## Field -> surface map

| Field | Consumed by |
|---|---|
| `name`, `title`, `tagline` | Home hero, root metadata, OG image, JSON-LD, footer |
| `photo` | Home hero, About, JSON-LD Person |
| `bio.short` / `bio.long` | Home / About |
| `services` | Services page, home services teaser, JSON-LD Service list |
| `testimonials` | Pull-quotes on Home + `/testimonials` |
| `stats`, `announcement`, `newsletter` | Home (strip, bar, closing band); `stats` also on About |
| `faq` | `/faq` + FAQPage JSON-LD |
| `booking` | `/book` embed + every booking CTA target |
| `contact.web3formsKey` | `/contact` form |
| `palette` | Root layout `data-palette` |
| `readings` | Reading routes, nav, footer, home grid, sitemap ([readings.md](./readings.md) toggle contract) |
| `siteUrl` | sitemap, robots, canonicals, OG, JSON-LD |

## Rules

- Seed values ship as a complete believable example practice so every surface renders on first clone. Forks overwrite, never delete fields.
- Display strings only; no markup in config values.
- The only secret in the project is `ROXYAPI_KEY` in `.env.local`. Nothing secret ever goes in this file.
- Adding a config field: extend the schema type, wire the consumer, update this table, extend the contract test. All four or nothing.
