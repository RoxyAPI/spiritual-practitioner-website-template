# Agents Guide

This is an MIT licensed RoxyAPI Template: a complete website for a spiritual practitioner (astrology, tarot, numerology, human design), built with Next.js 16, Tailwind v4, and shadcn/ui. It ships six free readings computed live by [RoxyAPI](https://roxyapi.com), a booking page, a services page, a file based blog, and SEO that generates itself from one config file. There is no database, no CMS, and no backend to run. You are most likely a coding agent helping a practitioner make this site their own. More Templates to fork: https://roxyapi.com/starters

## Canonical RoxyAPI references (use these, do not guess)

Prefer these live sources over memory for any RoxyAPI path, field, SDK method, or limit. They are always current.

- **Docs MCP (no API key):** connect `https://roxyapi.com/mcp/docs` (Streamable HTTP, one tool `search_docs`). Ask it for any endpoint, field, auth detail, or integration step instead of hardcoding a path. `{ "mcpServers": { "roxy-docs": { "type": "http", "url": "https://roxyapi.com/mcp/docs" } } }`
- **Agent playbook:** `https://roxyapi.com/AGENTS.md`, implementation rules for building on RoxyAPI.
- **Discovery context:** `https://roxyapi.com/llms.txt` (concise) and `https://roxyapi.com/llms-full.txt` (deep).
- **Live OpenAPI spec:** `https://roxyapi.com/api/v2/openapi.json`, the source of truth for every field and example. Never invent a response field.
- **Component reference:** `node_modules/@roxyapi/ui-react/AGENTS.md` maps every endpoint to the component that renders it. Response types are exported from the same package; never redeclare one.
- **Live playground:** `https://roxyapi.com/api-reference`. **Sitemap:** `https://roxyapi.com/sitemap.txt`.

## Setup

- Get an API key at https://roxyapi.com/pricing
- Copy `env.example` to `.env.local` and set `ROXYAPI_KEY`. That is the only secret in the project.
- `npm install`, then `npm run dev`, then open http://localhost:3000
- `npm test` runs the drift guards. `npm run typecheck` and `npm run lint` must both pass; they run on commit and on every pull request.

## The task router

The specification lives in `docs/`. Read the file that owns the concern before changing anything, and update it in the same change.

| If you are asked to... | Read |
|---|---|
| Change the name, bio, prices, services, FAQ, booking link, testimonials | `docs/config.md` |
| Change colours, fonts, spacing, the portrait | `docs/design.md` |
| Add, remove, or restructure a page | `docs/pages.md` |
| Add, remove, or change a free reading | `docs/readings.md` |
| Understand the architecture, the API boundary, or the tests | `docs/code.md` |
| Touch metadata, structured data, the sitemap, or the social card | `docs/seo.md` |
| Change the booking provider, the contact form, or payments | `docs/integrations.md` |
| Write or restructure a blog post | `docs/blog.md` |

## How the readings work

- The form is a client component. It posts to a Server Action in `src/app/readings/actions.ts`, which calls RoxyAPI through `src/lib/roxy/client.ts` and returns typed data to a `@roxyapi/ui-react` component.
- `src/lib/roxy/client.ts` imports `server-only`. The key cannot reach the browser, and any import of it from a client component is a build error rather than a leak.
- `src/lib/roxy/guard.ts` maps every API error code to a message a visitor can act on. Use `unwrap` or `tryUnwrap`; never call `fetch` against the API directly and never create a second client.
- Response types come from `@roxyapi/ui-react`. A local interface for an API response is the one thing guaranteed to rot.

## Rule: location first, charts second

Every chart needs a correct timezone, and most need coordinates. Never ask a visitor to type either. The city picker (`src/components/city-search.tsx`) calls `/api/cities`, which proxies the location search on the server, and the selected city carries the coordinates and the IANA timezone into the reading. Send the IANA name, not a fixed offset: it is the form that stays correct across a daylight saving boundary in the year somebody was born.

## Rule: the build must work with no key

CI has no secrets, and a fork should be able to deploy before it has bought anything. Every API call happens when a visitor asks for a reading, never at build time. Reading pages render an `ApiKeyMissing` state when the key is absent. Do not introduce a build step that needs the key.

## What the tests guard

`npm test` is four drift guards, not a coverage exercise. Keep them passing and keep them honest.

- `config-contract` : the config still satisfies its schema, and every reading switched on has a page behind it.
- `design-tokens` : every palette still declares every token in light and dark, and the palette copy the social card uses still matches the stylesheet.
- `jsonld` : the structured data still emits the types search engines are being told to expect.
- `guard` : each API error code still maps to a message, and a missing key never reaches the network.

`npm run test:drift` is separate and hits the network: it checks that every endpoint this site calls still exists in the live OpenAPI spec. It runs on a weekly schedule, not on pull requests, because a green build must never depend on a third party being reachable.

## House style

- No apostrophes, no em dashes, and no double hyphens in any prose that a visitor or a reader of this repository will see.
- Server Components by default. `'use client'` only for forms, the theme toggle, the mobile menu, the embeds, and the reading components.
- Reuse before you add. Check `src/lib/` and `src/components/` before writing a helper or a component that probably already exists.
- No `as any`, no hand written interfaces for API responses, no dead code.
