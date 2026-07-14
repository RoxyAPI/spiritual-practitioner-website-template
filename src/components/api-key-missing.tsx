import { KeyRound } from 'lucide-react';

/**
 * Shown on a reading page when `ROXYAPI_KEY` is unset. A missing key is a setup step, not a bug, so
 * the page says so plainly instead of rendering a form that cannot work or an error a visitor
 * cannot act on. The site still builds and every other page still works.
 */
export function ApiKeyMissing() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-border bg-card p-10 text-center">
      <KeyRound className="mx-auto size-6 text-primary" aria-hidden />
      <h2 className="mt-5 font-display text-2xl">The readings are not connected yet</h2>
      <p className="mt-4 text-muted-foreground">
        Add a RoxyAPI key to <code className="text-foreground">.env.local</code> as{' '}
        <code className="text-foreground">ROXYAPI_KEY</code> and restart the server. One key covers
        every reading on this site.
      </p>
      <a
        href="https://roxyapi.com/pricing"
        rel="noopener noreferrer"
        target="_blank"
        className="mt-8 inline-block text-sm underline underline-offset-4"
      >
        Get a key
      </a>
    </div>
  );
}
