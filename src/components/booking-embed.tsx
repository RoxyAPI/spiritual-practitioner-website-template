'use client';

import Cal from '@calcom/embed-react';
import { useEffect } from 'react';

/**
 * The scheduler embed. Both providers embed for free; which one renders is set by `booking.provider` in the config, and the practitioner keeps their own account and their own bookings. Comparison and setup: `docs/integrations.md`.
 *
 * @remarks Custom Elements and third party widget scripts both need the DOM, so this is a client component.
 */
export function BookingEmbed({
  provider,
  url,
}: {
  provider: 'calcom' | 'calendly';
  url: string;
}) {
  if (provider === 'calendly') return <CalendlyEmbed url={url} />;

  // Cal.com takes the `username/event-type` part of the link, not the whole URL.
  const calLink = url.replace(/^https?:\/\/(app\.)?cal\.com\//, '').replace(/^\/+|\/+$/g, '');

  return (
    <Cal
      calLink={calLink}
      className="overflow-hidden rounded-2xl border border-border"
      style={{ width: '100%', height: '100%', minHeight: '640px' }}
      config={{ layout: 'month_view' }}
    />
  );
}

/** Calendly ships a plain script and a target div rather than a React package. */
function CalendlyEmbed({ url }: { url: string }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return (
    <div
      className="calendly-inline-widget overflow-hidden rounded-2xl border border-border"
      data-url={url}
      style={{ minWidth: '320px', height: '700px' }}
    />
  );
}
