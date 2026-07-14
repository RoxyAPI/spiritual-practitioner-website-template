'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

/**
 * Both icons render and CSS picks the one to show, so the markup is identical on the server and the
 * client. The usual mounted flag is what causes a hydration mismatch here, and it is not needed:
 * `resolvedTheme` is only read inside the click handler, which never runs during render.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Switch between light and dark"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <Moon className="size-4 dark:hidden" aria-hidden />
      <Sun className="hidden size-4 dark:block" aria-hidden />
    </Button>
  );
}
