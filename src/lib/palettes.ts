import type { PaletteKey } from '@/types';

/**
 * The light values of each palette, for the one place that cannot read a CSS variable: the social card, which is rendered as an image on the server.
 *
 * @remarks These are a copy of the light blocks in `globals.css`, and a copy is a liability, so `tests/design-tokens.test.ts` parses the stylesheet and fails if the two ever disagree. Change a colour in one place and the test tells you about the other.
 */
export const PALETTES: Record<
  PaletteKey,
  {
    background: string;
    foreground: string;
    primary: string;
    accent: string;
    card: string;
    border: string;
  }
> = {
  rosewater: {
    background: '#FBF6F3',
    foreground: '#3E2A2C',
    primary: '#914955',
    accent: '#B89D62',
    card: '#F5E8E0',
    border: '#EAD9D2',
  },
  eucalyptus: {
    background: '#F8F7F2',
    foreground: '#22281F',
    primary: '#4C7060',
    accent: '#A18267',
    card: '#EDEFE6',
    border: '#DCE0D3',
  },
  kiln: {
    background: '#FAF4EA',
    foreground: '#322820',
    primary: '#A44A24',
    accent: '#CBA378',
    card: '#EFE6D6',
    border: '#E6D8C2',
  },
  moonlit: {
    background: '#FAF6EC',
    foreground: '#14232E',
    primary: '#254B5A',
    accent: '#B89D62',
    card: '#F1EADB',
    border: '#E4DBC6',
  },
};
