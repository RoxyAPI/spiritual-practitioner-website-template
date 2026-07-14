'use client';

import { X } from 'lucide-react';
import { useState } from 'react';
import { siteConfig } from '@/config/site.config';

/** Renders only when `announcement` is set in the config. Dismissal lasts for the visit. */
export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (!siteConfig.announcement || dismissed) return null;

  // A section with a label, not a bare div: it sits outside the header and the main content, and
  // page content that belongs to no landmark is content a screen reader cannot navigate to.
  return (
    <section aria-label="Announcement" className="bg-primary text-primary-foreground">
      <div className="site-container flex items-center gap-4 py-2">
        <p className="flex-1 text-center text-sm">{siteConfig.announcement}</p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="rounded-full p-1 opacity-80 transition-opacity hover:opacity-100"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
    </section>
  );
}
