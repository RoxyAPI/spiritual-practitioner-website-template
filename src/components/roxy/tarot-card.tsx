'use client';

/**
 * Client boundary for the one Roxy component a Server Component renders directly. The components mount Custom Elements, which need the DOM, so a page that fetches on the server hands the data across this boundary rather than importing the component itself.
 */
export { RoxyTarotCard } from '@roxyapi/ui-react';
