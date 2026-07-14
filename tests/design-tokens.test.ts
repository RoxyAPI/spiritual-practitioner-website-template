import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { PALETTES } from '@/lib/palettes';

/**
 * The palette blocks in globals.css are hand-written CSS, which means a stray `shadcn init`
 * (it rewrites the whole file) or a careless merge can drop them and the site still builds,
 * just wearing the wrong colours. This suite is the tripwire: it reads the stylesheet as text
 * and asserts every palette still declares every token in both light and dark.
 */
const css = readFileSync(fileURLToPath(new URL('../src/app/globals.css', import.meta.url)), 'utf8');

const PALETTES_IN_CSS = ['rosewater', 'eucalyptus', 'kiln', 'moonlit'] as const;

const TOKENS = [
  '--background',
  '--foreground',
  '--card',
  '--card-foreground',
  '--popover',
  '--popover-foreground',
  '--primary',
  '--primary-foreground',
  '--secondary',
  '--secondary-foreground',
  '--muted',
  '--muted-foreground',
  '--accent',
  '--accent-foreground',
  '--border',
  '--input',
  '--ring',
] as const;

const ROXY_TOKENS = [
  '--roxy-bg',
  // The surface token is the one that actually paints the card face. Without it the readings render white.
  '--roxy-surface',
  '--roxy-fg',
  '--roxy-muted',
  '--roxy-border',
  '--roxy-accent',
  '--roxy-accent-ink',
  '--roxy-ring',
  '--roxy-font-sans',
] as const;

/** Returns the declaration body of a CSS rule, or undefined when the selector is absent. */
function block(selector: string): string | undefined {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`${escaped}\\s*\\{([^}]*)\\}`).exec(css)?.[1];
}

describe('palettes', () => {
  for (const palette of PALETTES_IN_CSS) {
    for (const [mode, selector] of [
      ['light', `html[data-palette='${palette}']`],
      ['dark', `html[data-palette='${palette}'].dark`],
    ] as const) {
      it(`${palette} defines every token in ${mode}`, () => {
        const body = block(selector);
        expect(body, `missing selector: ${selector}`).toBeDefined();
        for (const token of TOKENS) {
          expect(body, `${selector} is missing ${token}`).toMatch(new RegExp(`${token}\\s*:`));
        }
      });
    }
  }

  it('falls back to a full palette at :root so an unset data-palette still renders', () => {
    const body = block(':root');
    expect(body).toBeDefined();
    for (const token of TOKENS) {
      expect(body, `:root is missing ${token}`).toMatch(new RegExp(`${token}\\s*:`));
    }
  });

  it('declares no palette colour in the bare .dark block, which every palette selector outranks', () => {
    const body = block('.dark') ?? '';
    expect(body).not.toMatch(/--background\s*:/);
    expect(body).not.toMatch(/--primary\s*:/);
  });
});

describe('roxy component theming', () => {
  it('maps every roxy token onto a palette token', () => {
    const body = block('html:root');
    expect(body, 'missing the html:root roxy mapping block').toBeDefined();
    for (const token of ROXY_TOKENS) {
      expect(body, `missing mapping for ${token}`).toMatch(new RegExp(`${token}\\s*:\\s*var\\(--`));
    }
  });
});

describe('the palette copy the social card renders from', () => {
  it('covers exactly the palettes the stylesheet defines', () => {
    expect(Object.keys(PALETTES).sort()).toEqual([...PALETTES_IN_CSS].sort());
  });

  it.each(
    PALETTES_IN_CSS,
  )('%s matches the light block in globals.css, so the card can never drift from the site', (name) => {
    const body = block(`html[data-palette='${name}']`) ?? '';

    for (const [token, hex] of Object.entries(PALETTES[name])) {
      const declared = new RegExp(`--${token}\\s*:\\s*(#[0-9A-Fa-f]{6})`).exec(body)?.[1];
      expect(declared?.toUpperCase(), `--${token} differs from src/lib/palettes.ts`).toBe(
        hex.toUpperCase(),
      );
    }
  });
});

describe('layout', () => {
  it('declares the site measure exactly once, so every full-width band lines its content up with every other', () => {
    const container = block('.site-container');
    expect(container, 'missing the .site-container class').toBeDefined();
    expect(container).toMatch(/max-w-\w+/);
    expect(container).toMatch(/mx-auto/);

    // Any component re-declaring the width is a second source of truth, and they drift.
    const strays = ['section', 'site-header', 'site-footer', 'announcement-bar']
      .map((name) => `../src/components/${name}.tsx`)
      .filter((file) =>
        readFileSync(fileURLToPath(new URL(file, import.meta.url)), 'utf8').includes('max-w-6xl'),
      );
    expect(strays, 'these re-declare the container width instead of using .site-container').toEqual(
      [],
    );
  });
});

describe('typography', () => {
  it('exposes the three font families as theme fonts', () => {
    const theme = block('@theme inline');
    expect(theme).toBeDefined();
    expect(theme).toMatch(/--font-sans:\s*var\(--font-sans-var\)/);
    expect(theme).toMatch(/--font-display:\s*var\(--font-display-var\)/);
    expect(theme).toMatch(/--font-script:\s*var\(--font-script-var\)/);
  });
});
