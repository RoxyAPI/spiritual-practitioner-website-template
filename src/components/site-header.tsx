'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { siteConfig } from '@/config/site.config';
import { enabledReadings } from '@/lib/readings';

/** The reading hub only appears when at least one reading is switched on. */
function navLinks() {
  return [
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    ...(enabledReadings().length > 0 ? [{ href: '/readings', label: 'Free Readings' }] : []),
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = navLinks();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="site-container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="font-display text-xl tracking-tight">
          {siteConfig.name}
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={`text-sm transition-colors hover:text-foreground ${
                isActive(link.href) ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button asChild size="sm" className="eyebrow hidden md:inline-flex">
            <Link href="/book">Book a Reading</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="size-5" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col gap-0">
              <SheetTitle className="px-6 pt-6 font-display text-xl">{siteConfig.name}</SheetTitle>
              <nav aria-label="Mobile" className="flex flex-col gap-1 px-4 py-6">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    className={`rounded-lg px-2 py-3 text-base transition-colors hover:bg-muted ${
                      isActive(link.href) ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto border-t border-border p-6">
                <Button asChild className="eyebrow w-full" onClick={() => setOpen(false)}>
                  <Link href="/book">Book a Reading</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
