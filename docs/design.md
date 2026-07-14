# Design System

The design is the product. Every choice below was researched against real practitioner brands and current wellness-brand design guidance (July 2026), not invented. Change values only with a better source.

House direction: **expressive minimalism**. Light cream base, one textural system (grain + a single soft wash), editorial serif display, one script accent used sparingly, generous whitespace, price-transparent cards, hand-finished details. Never the AI-template look: no purple family, no two-stop diagonal gradients, no neon, no glow, no emoji headings, no hover scale.

## Palettes

Four prebuilt palettes, selected by `config.palette` ([config.md](./config.md)) which sets `data-palette` on `<html>`. Dark mode = the `.dark` class from next-themes; each palette defines both. Tokens map 1:1 to the shadcn CSS variables in `globals.css` (`--background`, `--card`, `--foreground`, `--muted-foreground`, `--primary`, `--primary-foreground`, `--accent`, `--border`, `--ring` follows `--primary`). `tests/design-tokens.test.ts` asserts every selector and variable exists ([code.md](./code.md)).

Contrast: every foreground/background pair is WCAG AAA, and every primary and muted pair is AA or better. The binding constraint is muted text on the CARD surface, not on the page background: the card is the darker of the two, so a muted value that passes on the background can still fail inside a card. Check muted against card whenever a value changes, and run the accessibility pass (`docs/code.md`) rather than trusting the eye.

### `rosewater` (default). Romantic, tender, warm.

| Token | Light | Dark |
|---|---|---|
| background | `#FBF6F3` | `#231619` |
| card | `#F5E8E0` | `#2E1E22` |
| foreground | `#3E2A2C` | `#F2E4DF` |
| muted-foreground | `#7E625F` | `#B39698` |
| primary | `#914955` | `#D9A2A6` |
| primary-foreground | `#FDF4F1` | `#33191E` |
| accent | `#B89D62` | `#CDB37C` |
| border | `#EAD9D2` | `#402C31` |

### `eucalyptus`. Grounded, restorative, quietly confident.

| Token | Light | Dark |
|---|---|---|
| background | `#F8F7F2` | `#191E19` |
| card | `#EDEFE6` | `#232A23` |
| foreground | `#22281F` | `#E9EDE3` |
| muted-foreground | `#666D63` | `#9FA89B` |
| primary | `#4C7060` | `#9CC0AC` |
| primary-foreground | `#F4F7F1` | `#16241C` |
| accent | `#A18267` | `#C2A87E` |
| border | `#DCE0D3` | `#313A31` |

### `kiln`. Terracotta and clay, rooted in craft.

| Token | Light | Dark |
|---|---|---|
| background | `#FAF4EA` | `#211710` |
| card | `#EFE6D6` | `#2C2016` |
| foreground | `#322820` | `#F2E7D9` |
| muted-foreground | `#74634F` | `#B49D87` |
| primary | `#A44A24` | `#D98D5F` |
| primary-foreground | `#FDF3EA` | `#2E1608` |
| accent | `#CBA378` | `#D8B98C` |
| border | `#E6D8C2` | `#3D2E20` |

### `moonlit`. Ink and gold, candlelit night sky (celestial without purple).

| Token | Light | Dark |
|---|---|---|
| background | `#FAF6EC` | `#0B1826` |
| card | `#F1EADB` | `#142331` |
| foreground | `#14232E` | `#EFE7D3` |
| muted-foreground | `#5C6A76` | `#92A4B2` |
| primary | `#254B5A` | `#C9A96B` |
| primary-foreground | `#F6F2E6` | `#16222E` |
| accent | `#B89D62` | `#99BAD7` |
| border | `#E4DBC6` | `#24384A` |

Selector shape in `globals.css`: `html[data-palette='kiln'] { ... }` and `html[data-palette='kiln'].dark { ... }`. All four palettes ship; unused ones cost nothing.

### Switching palette

One word in `site.config.ts`. Nothing else, ever:

```ts
palette: 'moonlit',
```

Every page, every reading component, and the social card follow it, in light and in dark.

### Adding a palette (all five steps, or the build fails)

1. `globals.css`: add BOTH blocks, `html[data-palette='<name>']` and `html[data-palette='<name>'].dark`, each declaring every token listed above.
2. `src/types/index.ts`: add the name to the `PaletteKey` union.
3. `src/lib/palettes.ts`: add the LIGHT values to `PALETTES`. This is the copy the social card renders from, since an image cannot read a CSS variable.
4. `tests/design-tokens.test.ts`: add the name to `PALETTES_IN_CSS`. The suite then holds steps 1 and 3 to each other and fails if they ever disagree.
5. Contrast-check muted text against the CARD colour (the darker surface, and the one that fails first), then run the accessibility pass in [code.md](./code.md).

Skipping step 3 or 4 does not break the site, which is exactly why they are listed: the social card would quietly keep the old colours.

## Typography (Google Fonts via next/font, loaded as CSS variables)

| Role | Font | Rules |
|---|---|---|
| Display serif | **Fraunces** (variable, optical size axis) | h1/h2/h3, weights 300 to 600, large sizes. The high-personality editorial serif this niche pays for, free. |
| Script accent | **Parisienne** | The ONLY places it may appear: eyebrow words, one hero flourish word, pull-quote attributions. Minimum 24px. NEVER body, buttons, nav, forms, or labels. Script everywhere is both illegible and the fastest way to look cheap. |
| Body sans | **Jost** | Body, UI, forms. Weights 300/400/500. Observed in production on a leading astrology site. |

Wire-up: three `next/font/google` loaders with `variable: '--font-display' / '--font-script' / '--font-sans'`, classes on `<html>`, mapped in `globals.css` via Tailwind v4 `@theme inline` (`--font-sans: var(--font-sans-var)` etc.). Pattern: https://nextjs.org/docs/app/api-reference/components/font

Do NOT substitute **Inter** (the default of every AI-generated template) or **Playfair Display** (the most template-saturated luxury serif). Sanctioned alternates if a fork asks: Cormorant Garamond or Marcellus (display, Cormorant only at 500+ weight and 20px+), Pinyon Script (script, 28px+), Figtree (body).

Eyebrow and button treatment (the classic feminine-editorial formula): uppercase, 12 to 13px, letter-spacing around 0.2em, medium weight, muted or primary color. Eyebrows above section headings; buttons share the treatment.

## Background treatment (grain, not gradients)

- Base: the palette `background` across the whole body. No per-section background colors.
- Texture: a single fixed inline SVG turbulence (noise) overlay across the page at 2 to 4 percent opacity. This is what makes it feel printed, not rendered.
- Wash: at most ONE large soft radial wash per major section, using the palette card or accent tint at 20 to 30 percent alpha, bleeding from a corner. Apply it with `<Section wash="start">` or `wash="end"`, never by hand: the wash must paint on the full-width band, not on the container, or it stops short of the screen edge.
- NEVER: two-stop diagonal linear gradients, purple-to-anything, animated gradient meshes.

Hand-finished accents (small doses): a hand-drawn SVG underline stroke beneath the hero headline; star or moon glyphs as list markers on service and FAQ lists; 16 to 24px radius on photos and cards. No sticker collages, no parallax, no scroll-triggered reveals.

## Layout

**Full-bleed band, contained content.** Every horizontal band on the page (the announcement bar, the header, each `Section`, the footer) spans the full viewport so its background can reach the screen edge, and puts its content inside the shared container. That is what lets a washed section bleed edge to edge while its text still lines up with the wordmark above it and the footer columns below it.

- The measure is declared ONCE, as `.site-container` in `globals.css` (`mx-auto w-full max-w-6xl px-4 sm:px-6`). Nothing else may declare a page width. `tests/design-tokens.test.ts` fails if a component re-declares it.
- `src/components/section.tsx` is the only layout primitive a page composes: it owns the full-width band, the optional wash, the container, and the vertical rhythm (`py-16 sm:py-24`). A page never sets a width, a gutter, or a section padding.
- **Every page uses the same container, including a blog post.** No page gets its own width. If a block needs to be narrower, constrain that block inside the section (`max-w-2xl` on the element), never the container around it.
- Never put the container in the root layout. A container there caps every background at its edge, so a washed section renders as a floating band with gutters instead of reaching the screen.
- Rhythm: `py-16 sm:py-24` per section (the Section applies it); `space-y-6` inside. When in doubt, add space.
- Hierarchy through type scale and weight, never through colored boxes.
- Cards: palette `card` surface, 1px `border`, radius `rounded-2xl`, no shadow stack, no hover transform.
- Buttons: primary = `primary` background with `primary-foreground` text; secondary = outline on `border`. Uppercase treatment above.
- Testimonials render as full-width pull-quotes interleaved between sections (Fraunces italic, script attribution), never a carousel.
- Spinner for loading, never colored shimmer skeletons.
- Icons: lucide only, only where they carry meaning.

## Imagery

- Practitioner portrait: `public/portrait.jpg`, **3:4 portrait, 1200x1600px** (displays at up to 600px wide, crisp on retina). `next/image` with `sizes` set. Alt text from `config.photo.alt`.
- The shipped placeholder is an abstract figure drawn in the palette, not a stock photograph of a real person. That keeps the template free of a licence to track and free of any suggestion that a real face endorses the practice. A fork overwrites `public/portrait.jpg` with its own photo at the same 1200x1600 dimensions and changes nothing else.
- Blog images live in `public/blog/`, 16:9, under 200KB.
- No decorative stock photo grids. The portrait, the readings, and the type do the talking.

## Roxy component theming

`@roxyapi/ui-react` components read `--roxy-*` tokens (full list: `node_modules/@roxyapi/ui-react/README.md`). Map them once in `globals.css` so readings inherit the active palette automatically:

```css
html:root {
  --roxy-bg: var(--card);
  --roxy-surface: var(--card);
  --roxy-fg: var(--foreground);
  --roxy-muted: var(--muted-foreground);
  --roxy-border: var(--border);
  --roxy-accent: var(--primary);
  --roxy-accent-ink: var(--primary);
  --roxy-ring: var(--ring);
  --roxy-font-sans: var(--font-sans-var);
  --roxy-radius-md: var(--radius);
}
```

Three rules the token names hide.

- `--roxy-surface` is the token that paints the card face and the chart plate. Map it or every reading renders as a white rectangle sitting in the middle of the palette, which is the one bug that makes the components look pasted in.
- `--roxy-accent-ink` is an accent shade that has to stay legible ON the page (chart strokes, active labels), so it maps to `--primary`, never to `--primary-foreground`.
- The selector is `html:root`, not `:root`, so the mapping outranks the library defaults in dark mode as well as in light.

`tests/design-tokens.test.ts` asserts each of these is present. If a future version reads a token that is not in the map, it will show up as a component that ignores the palette: open the element, list the `--roxy-*` variables its stylesheet reads, and map the missing one.

## Dark mode

`next-themes` with `attribute="class"`, `defaultTheme="system"`, `disableTransitionOnChange`. Never a hand-rolled theme provider (white flash). The toggle sits in the header. Every palette was built with a real dark variant; do not generate dark values by inverting.

## Decision log

| Decision | Why |
|---|---|
| No custom cursor (wand, sparkle) | Accessibility cost, and it reads as a gimmick. |
| No purple/violet/indigo family | The single strongest generic-AI-template tell in this niche. |
| Grain + one wash instead of gradients | Printed-paper tactility reads hand-made; gradient meshes read generated. |
| Fraunces + Parisienne + Jost | Free equivalents of what top practitioner brands actually pay for; Jost observed in production in this exact niche. |
| No Inter, no Playfair Display | Both are template-saturation casualties. |
| Light mode default | Every researched palette source and practitioner site leads light and airy. |
| Never re-run `shadcn init` | It rewrites `globals.css` and destroys the palette blocks. Add components with `shadcn add` only; the design-tokens test is the tripwire. |
