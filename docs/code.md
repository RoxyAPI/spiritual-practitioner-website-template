# Code and Architecture

Stack: Next.js (App Router, Server Components first) + TypeScript strict + Tailwind v4 + shadcn/ui + `@roxyapi/sdk` + `@roxyapi/ui-react` + vitest. No database, no CMS, no auth. Content lives in `site.config.ts` and `content/blog/`.

## Directory layout

```
src/
  app/                    routes (Server Components; client islands only where needed)
    readings/             free reading pages (see readings.md)
    blog/                 MDX blog (see blog.md)
    api/cities/route.ts   server proxy for city autocomplete
    sitemap.ts robots.ts opengraph-image.tsx
  components/
    section.tsx           THE layout primitive: full-width band + shared container + rhythm
    ui/                   shadcn primitives (generated, do not hand edit)
    roxy/                 'use client' boundaries wrapping @roxyapi/ui-react
    ...                   navbar, footer, theme-toggle, booking-cta, api-key-missing
  config/site.config.ts   THE customization file (config.md)
  types/index.ts          EVERY type the site declares. Import as `@/types`, never redeclare
  lib/roxy/client.ts      SDK singleton, server only
  lib/roxy/guard.ts       unwrap/tryUnwrap error mapping
content/blog/*.mdx        blog posts (blog.md)
tests/                    vitest suites + stubs/server-only.ts
```

## The RoxyAPI boundary (only path to the API)

```ts
// src/lib/roxy/client.ts
import 'server-only';
import { createRoxy } from '@roxyapi/sdk';

const key = process.env.ROXYAPI_KEY;
export const roxy = createRoxy(key ?? '');
export const hasApiKey = Boolean(key);
```

- `import 'server-only'` makes any client-side import a build error. The key cannot reach the browser.
- `guard.ts` exports `unwrap()` (returns typed `data`, throws a mapped `Error`) and `tryUnwrap()` (returns `{ data } | { error }` for JSX branching). It switches on the stable SDK `error.code` values (`validation_error`, `api_key_required`, `invalid_api_key`, `subscription_not_found`, `subscription_inactive`, `rate_limit_exceeded`, `not_found`) and maps each to a visitor-friendly message.
- Every server action checks `hasApiKey` first; pages render `ApiKeyMissing` when false (see [readings.md](./readings.md)).
- Never call `fetch` against the API directly. Never instantiate a second client.

## Type safety

- Zero `as any`, zero `as unknown as`, zero hand-written interfaces that duplicate SDK types. The SDK ships full request and response types; let inference flow through server actions (`Awaited<ReturnType<typeof action>>` on the client side).
- Verify field names against the SDK types or the live OpenAPI spec, never guess. Wrong field names are runtime crashes.
- `tsc --noEmit` must pass with zero errors at all times.

## Build rules

- **The build must succeed with no env vars set.** CI has no secrets. All API calls happen at request time (or behind the daily cache), never at build time. The one exception is intentionally static content: blog pages are SSG from local files.
- Server Components by default. `'use client'` only for forms, the theme toggle, the mobile menu, embeds, and the `components/roxy/` wrappers (web components need the client).
- No dead code, no unused deps. Prefer editing an existing component over adding a parallel one.

## Tests (vitest)

| Suite | Guards |
|---|---|
| `tests/guard.test.ts` | error code -> message mapping; missing key behavior |
| `tests/config-contract.test.ts` | `site.config.ts` satisfies its schema; every enabled reading maps to an existing route; `siteUrl` is absolute; required fields non-empty |
| `tests/design-tokens.test.ts` | every palette selector and required CSS variable exists in `globals.css` (see [design.md](./design.md)) |
| `tests/jsonld.test.ts` | JSON-LD builders emit the schema types listed in [seo.md](./seo.md) |
| `tests/spec-drift.test.ts` | network test, weekly schedule only: every endpoint in [readings.md](./readings.md) still exists in the live OpenAPI spec |

`tests/stubs/server-only.ts` (a no-op `export {}`) is aliased in `vitest.config.ts` so `server-only` modules import under vitest. Required; do not remove.

## Scripts

| Script | Runs |
|---|---|
| `dev` / `build` / `start` | Next.js |
| `format` | Biome, writes |
| `check` | Biome with fixes: formatting + import order |
| `check:ci` | Biome in verify mode, no writes. What CI runs |
| `lint` | ESLint: the Next.js and React rules |
| `typecheck` | `tsc --noEmit` |
| `test` | `vitest run` (excludes `spec-drift`) |
| `test:drift` | the spec drift suite (scheduled workflow only) |
| `verify` | the whole gate, in order. Run before pushing |
| `prepare` | `lefthook install` |

**Two tools, one job each.** Biome formats and orders imports. ESLint owns the Next.js and React rules Biome does not cover (hooks, images, accessibility). The Biome linter is switched off in `biome.json` so the two never argue about the same line.

**The order is fixed and cheapest-first**: format, lint, types, tests, build. The same order runs on commit and on push (`lefthook.yml`) and in CI (`.github/workflows/ci.yml`). A two-minute build should never be the thing that tells you about a missing semicolon.
