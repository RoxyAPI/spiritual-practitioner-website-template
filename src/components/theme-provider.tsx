'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ComponentProps } from 'react';

/**
 * Light and dark are driven by next-themes, which writes the `.dark` class on `<html>` before
 * first paint. Rolling this by hand is what produces the white flash on load, so the provider
 * is not optional and never gets replaced with a `useEffect`.
 */
export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
