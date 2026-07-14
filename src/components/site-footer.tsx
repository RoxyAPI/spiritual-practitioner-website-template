import Link from 'next/link';
import { siteConfig } from '@/config/site.config';
import { enabledReadings } from '@/lib/readings';

const PAGES = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/faq', label: 'Questions' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
  { href: '/book', label: 'Book a Reading' },
];

export function SiteFooter() {
  const readings = enabledReadings();

  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="space-y-4">
            <p className="font-display text-xl">{siteConfig.name}</p>
            <p className="max-w-xs text-sm text-muted-foreground">{siteConfig.title}</p>
            {siteConfig.location ? (
              <p className="text-sm text-muted-foreground">{siteConfig.location}</p>
            ) : null}
            <ul className="flex flex-wrap gap-4 pt-2">
              {siteConfig.socials.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    rel="me noopener noreferrer"
                    target="_blank"
                    className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow text-muted-foreground">Explore</p>
            <ul className="mt-4 space-y-3">
              {PAGES.map((page) => (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {readings.length > 0 ? (
            <nav aria-label="Free readings">
              <p className="eyebrow text-muted-foreground">Free Readings</p>
              <ul className="mt-4 space-y-3">
                {readings.map((reading) => (
                  <li key={reading.key}>
                    <Link
                      href={reading.href}
                      className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      {reading.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            Copyright {new Date().getFullYear()} {siteConfig.name}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {siteConfig.newsletter ? (
              <a
                href={siteConfig.newsletter.href}
                rel="noopener noreferrer"
                target="_blank"
                className="underline-offset-4 hover:text-foreground hover:underline"
              >
                {siteConfig.newsletter.label}
              </a>
            ) : null}
            {/* Credit link. The licence does not require it, so remove this line if you prefer. */}
            <p>
              Readings powered by{' '}
              <a
                href="https://roxyapi.com"
                rel="noopener noreferrer"
                target="_blank"
                className="underline-offset-4 hover:text-foreground hover:underline"
              >
                RoxyAPI
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
