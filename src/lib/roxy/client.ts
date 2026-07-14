import 'server-only';
import { createRoxy } from '@roxyapi/sdk';

/**
 * The only RoxyAPI client in the project. One key covers every reading on the site, so there is no base URL to configure and no generated schema to keep in sync: `createRoxy` sets the base URL and injects the auth header on every request.
 *
 * @remarks The `server-only` import turns any accidental client-side import into a build error, so the key cannot reach the browser. Read {@link hasApiKey} at the page boundary, or wrap the call in `unwrap` from `./guard`.
 */
const key = process.env.ROXYAPI_KEY;

export const roxy = createRoxy(key ?? '');

/** True when `ROXYAPI_KEY` is set. Reading pages render `ApiKeyMissing` when this is false instead of showing a form that cannot work. */
export const hasApiKey = Boolean(key);
