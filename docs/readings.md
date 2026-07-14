# Free Readings (interactive pages)

The free reading pages are the interactive heart of the site. Each one computes a real reading with [RoxyAPI](https://roxyapi.com) and ends in a booking CTA. Public label is always **Free Readings**, never "tools".

Data flow, identical for every reading: client form (minimal inputs) -> Server Action -> `unwrap(roxy.<domain>.<method>(...))` -> typed data -> controlled `@roxyapi/ui-react` component. The API key never leaves the server. Client and guard contract: [code.md](./code.md). Component theming: [design.md](./design.md) plus `node_modules/@roxyapi/ui-react/README.md`.

`@roxyapi/ui-react` is self-contained: it carries its own response types and needs no companion UI package. Install it alone.

## Reading catalog

Every method, path, and field below comes from the live OpenAPI spec (`https://roxyapi.com/api/v2/{domain}/openapi.json`). Re-verify there before changing any call. `*` = required.

| Reading | Route | Endpoint | SDK call | Component | Form inputs |
|---|---|---|---|---|---|
| Birth Chart | `/readings/birth-chart` | `POST /astrology/natal-chart` | `roxy.astrology.generateNatalChart` | `RoxyNatalChart` | `date*`, `time*`, city picker -> `latitude*`, `longitude*`, `timezone*` |
| Daily Horoscope | `/readings/horoscope` | `GET /astrology/horoscope/{sign}/daily` | `roxy.astrology.getDailyHoroscope` | `RoxyHoroscopeCard` (`period="daily"`) | `sign*` (select) |
| Compatibility | `/readings/compatibility` | `POST /astrology/compatibility-score` | `roxy.astrology.calculateCompatibility` | `RoxyCompatibilityCard` (`mode="astrology"`) | `person1*`, `person2*` birth data objects (subfields from SDK types at build) |
| Life Path Number | `/readings/life-path` | `POST /numerology/life-path` | `roxy.numerology.calculateLifePath` | `RoxyNumerologyCard` (`type="life-path"`) | `year*`, `month*`, `day*` |
| Tarot Spread | `/readings/tarot` | `POST /tarot/spreads/three-card` | `roxy.tarot.castThreeCard` | `RoxyTarotSpread` (`spread="three-card"`) | `question` (optional) |
| Human Design | `/readings/human-design` | `POST /human-design/type`, then `POST /human-design/bodygraph` | `roxy.humanDesign.calculateType`, `roxy.humanDesign.generateBodygraph` | `RoxyHdTypeCard`, then `RoxyBodygraph` | `date*`, `time*`, city picker -> `timezone*` (coordinates optional here, and sent anyway) |

Human Design page pattern: show the type card first (instant, low friction), then a "Reveal your full chart" button that fetches the bodygraph. Two calls only when the visitor asks for depth.

## Card of the Day (home page)

`POST /tarot/daily` via `roxy.tarot.getDailyCard` rendered with `RoxyTarotCard` in a Server Component on `/`. The home page revalidates on a timer (`export const revalidate` in `src/app/page.tsx`), so the widget costs a handful of requests a day no matter how much traffic the site gets. Never fetch it per visitor.

## Location first, charts second

Never ask a visitor to type coordinates, and never ask them to name their birth timezone. The Birth Chart, Compatibility, and Human Design forms use a city autocomplete backed by `GET /location/search?q=` (`roxy.location.searchCities`), proxied through a server route so the key stays server side. Selecting a city fills `latitude`, `longitude`, and `timezone`.

Send the IANA name (`Europe/Lisbon`) that the city record returns, not a fixed offset: it is the form that stays correct across a daylight saving boundary in the year somebody was born. Human Design needs no coordinates but still needs that timezone, which is why it asks for the city too. Life Path needs neither and asks for the date alone.

## Toggle contract

Each reading has an on/off switch in `site.config.ts` ([config.md](./config.md)). A reading switched off must:

1. Return 404 from its route (guard at the top of the page).
2. Disappear from the header nav, the mobile menu, the footer, and the home page reading grid.
3. Drop out of `sitemap.ts` ([seo.md](./seo.md)).

All four read the same config helper. Never hardcode a reading list in a component.

## No key, no crash

When `ROXYAPI_KEY` is unset, every reading page renders the branded `ApiKeyMissing` state (get a key at [roxyapi.com/pricing](https://roxyapi.com/pricing), add it to `.env.local`, restart) instead of a broken form. The build must succeed with no env vars set. Rule detail: [code.md](./code.md).

## Conversion rule

Every rendered reading is followed by a booking CTA block: one line connecting the free result to a full session, one button to `/book`. The reading is the appetizer; the session is the product.

## Requests and quota

One reading = one API request against the site owner key (the Card of the Day adds one per day). Per visitor submissions are never cached; daily widgets always are.

## Add or remove a reading

1. Add or remove the toggle key in `site.config.ts` ([config.md](./config.md) owns the schema).
2. Add or remove the route folder under `src/app/readings/`.
3. Pick the endpoint and component pair from the live spec and the component table in `node_modules/@roxyapi/ui-react/AGENTS.md`, which maps every `Roxy*` component to the endpoints it renders.

Nav, footer, sitemap, and the home grid follow the toggle automatically. Nothing else to touch.
