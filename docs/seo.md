# SEO

Every SEO surface derives from `site.config.ts` ([config.md](./config.md)). The practitioner edits one file; titles, descriptions, structured data, sitemap, and social cards all update. Never hardcode a name, URL, or service in any SEO surface.

## Metadata (Next.js Metadata API)

- Root layout: `title.template = "%s | {config.name}"`, `title.default = "{config.name}, {config.title}"`, `description` from config tagline, `metadataBase = new URL(config.siteUrl)`.
- Every page exports `metadata` (static pages) or `generateMetadata` (blog posts, readings). Descriptions are unique per page, 140 to 160 chars, written around what a visitor searches (see per-page table in [pages.md](./pages.md)).
- Reading pages target the phrases people actually type: free birth chart, daily horoscope, free tarot reading, life path calculator, human design chart. Keep titles literal, not clever.
- `alternates.canonical` on every page.

## Structured data (JSON-LD)

Builders live in `src/lib/seo.ts`, pure functions from config, injected as `<script type="application/ld+json">` by the page that owns them:

| Type | Source fields | Injected on |
|---|---|---|
| `Person` | name, title, photo, socials, siteUrl | `/`, `/about` |
| `ProfessionalService` | name, siteUrl, description, socials | `/` |
| `Service` (one per entry) | services array (name, description, price) | `/services` |
| `FAQPage` | faq array | `/faq` |

`tests/jsonld.test.ts` asserts all four builders emit their `@type` and required fields ([code.md](./code.md)). Validate rendered pages with the Google Rich Results Test after deploy.

## Sitemap and robots

- `app/sitemap.ts`: static pages + enabled readings (toggle-aware, see [readings.md](./readings.md)) + every blog post. URLs built from `config.siteUrl`.
- `app/robots.ts`: allow all, point at the sitemap.
- Both are native App Router conventions, no extra package.

## Social cards

`app/opengraph-image.tsx` renders the OG image at request time from config name + title + palette colors, so a fork rebrands its social card automatically with zero image editing. Blog posts may override with a frontmatter `image` ([blog.md](./blog.md)).

## Blog SEO

Frontmatter (`title`, `description`, `date`, `image`) maps straight to metadata; `generateMetadata` in the post route does the mapping. Post URLs are `/blog/{slug}` from the filename. Writing guidance: [blog.md](./blog.md).

## Rules

- One `h1` per page. Headings describe content, not vibes.
- Every image has meaningful `alt` text; the practitioner photo alt comes from config.
- No keyword stuffing. Each page targets one intent and answers it in the first paragraph.
- Internal links: every reading links to related services; every blog post links to at least one reading or service page.
