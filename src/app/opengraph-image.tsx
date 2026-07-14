import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site.config';
import { PALETTES } from '@/lib/palettes';

export const alt = `${siteConfig.name}, ${siteConfig.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * The social card, drawn from the config and the active palette. A fork that changes its name and
 * its palette gets a rebranded card with no image editor and no design file, which is the only way
 * a template can ship one that stays correct.
 */
export default function OpengraphImage() {
  const palette = PALETTES[siteConfig.palette];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: palette.background,
          color: palette.foreground,
          padding: '80px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: palette.primary,
            }}
          >
            {siteConfig.title}
          </div>
          <div style={{ marginTop: 28, fontSize: 52, lineHeight: 1.25, maxWidth: 940 }}>
            {siteConfig.tagline}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 44, color: palette.primary }}>{siteConfig.name}</div>
          <div
            style={{
              width: 120,
              height: 6,
              background: palette.accent,
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
