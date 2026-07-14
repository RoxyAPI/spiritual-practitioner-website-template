import type { Metadata } from 'next';
import { Fraunces, Jost, Parisienne } from 'next/font/google';
import { AnnouncementBar } from '@/components/announcement-bar';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { ThemeProvider } from '@/components/theme-provider';
import { siteConfig } from '@/config/site.config';
import './globals.css';

/** Editorial display serif. Headings only. */
const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display-var',
  display: 'swap',
});

/** Script accent. Eyebrows, one hero flourish, pull-quote attributions. Never body, buttons, or nav. */
const script = Parisienne({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-script-var',
  display: 'swap',
});

/** Body and UI. */
const sans = Jost({
  subsets: ['latin'],
  variable: '--font-sans-var',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.name}, ${siteConfig.title}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.tagline,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    url: siteConfig.siteUrl,
    title: `${siteConfig.name}, ${siteConfig.title}`,
    description: siteConfig.tagline,
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-palette={siteConfig.palette}
      suppressHydrationWarning
      className={`${display.variable} ${script.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AnnouncementBar />
          <SiteHeader />
          {/* The one container in the project. Pages never add their own width wrapper. */}
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
