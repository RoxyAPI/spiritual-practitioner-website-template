'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';

/** Submit button that knows when its own form is in flight. A spinner, never a shimmer. */
export function SubmitButton({ children }: { children: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" className="eyebrow" disabled={pending}>
      {pending ? (
        <>
          <span
            className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden
          />
          Reading
        </>
      ) : (
        children
      )}
    </Button>
  );
}

/** One place for a failed reading to speak, so no page invents its own error styling. */
export function ReadingError({ message }: { message: string }) {
  return (
    <p role="alert" className="rounded-xl border border-destructive/40 bg-card p-4 text-sm text-destructive">
      {message}
    </p>
  );
}

/** The panel a finished reading lands in. Keeps every reading the same width and rhythm. */
export function ReadingResult({ children }: { children: React.ReactNode }) {
  return <div className="mt-12 rounded-2xl border border-border bg-card p-4 sm:p-8">{children}</div>;
}
