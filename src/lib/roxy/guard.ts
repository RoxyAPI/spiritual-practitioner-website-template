import 'server-only';
import { hasApiKey } from './client';

/** Shown when `ROXYAPI_KEY` is unset. Pages render the `ApiKeyMissing` component instead of throwing this, but `unwrap` falls back to it for any call that reaches the API without a key. */
export const NO_KEY =
  'ROXYAPI_KEY is not set. Add it to .env.local and restart the dev server. Get a key at roxyapi.com/pricing.';

/**
 * The envelope every `@roxyapi/sdk` method resolves to. `data` is the typed response on success and `error` is the typed API error on failure; the two are mutually exclusive. The error always carries a stable `code`.
 */
interface SdkResult<T> {
  data?: T;
  error?: { error?: string; code?: string } | undefined;
}

/**
 * Maps the stable error code from the API onto a message a visitor can act on, without leaking anything about how the site is built. Unknown codes fall through to the message the API sent.
 */
function messageForCode(code: string | undefined, fallback: string | undefined): string {
  switch (code) {
    case 'validation_error':
      return 'Those birth details were not accepted. Check the date, the time, and the city, then try again.';
    case 'api_key_required':
    case 'invalid_api_key':
      return NO_KEY;
    case 'subscription_not_found':
    case 'subscription_inactive':
      return 'The reading service is not active on this site. The site owner can renew at roxyapi.com/account.';
    case 'rate_limit_exceeded':
      return 'The free readings have hit their limit for this month. Please try again later, or book a session.';
    case 'not_found':
      return 'That reading is not available.';
    default:
      return fallback ?? 'The reading could not be calculated. Please try again.';
  }
}

/**
 * Awaits one SDK call and returns its typed `data`, throwing a clear `Error` on failure. Every Server Action calls this instead of repeating the same missing-key and error checks.
 *
 * @example
 * ```ts
 * const chart = await unwrap(roxy.astrology.generateNatalChart({ body }));
 * ```
 *
 * @param call - The unawaited promise from any `roxy.*` method.
 * @returns The unwrapped response `data`.
 * @throws {Error} {@link NO_KEY} when no key is configured, or a message mapped from the API error code.
 */
export async function unwrap<T>(call: Promise<SdkResult<T>>): Promise<T> {
  if (!hasApiKey) throw new Error(NO_KEY);
  const { data, error } = await call;
  if (error) throw new Error(messageForCode(error.code, error.error));
  return data as T;
}

/**
 * Non-throwing variant of {@link unwrap} for Server Components, which return a discriminated result so the page can branch in JSX. Constructing JSX inside a try/catch is an anti-pattern, because render errors escape it.
 *
 * @example
 * ```tsx
 * const result = await tryUnwrap(roxy.tarot.getDailyCard({ body: {} }));
 * return 'error' in result ? null : <CardOfTheDay data={result.data} />;
 * ```
 */
export async function tryUnwrap<T>(
  call: Promise<SdkResult<T>>,
): Promise<{ data: T } | { error: string }> {
  try {
    return { data: await unwrap(call) };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'The reading could not be calculated.' };
  }
}
