import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * `client.ts` reads the key once at module load, so every case here re-imports the module with a
 * fresh registry. Without the reset, the first import would pin `hasApiKey` for the whole file.
 */
const KEY = 'ROXYAPI_KEY';

async function loadGuard(key: string | undefined) {
  vi.resetModules();
  if (key === undefined) delete process.env[KEY];
  else process.env[KEY] = key;
  return import('@/lib/roxy/guard');
}

const original = process.env[KEY];

beforeEach(() => {
  delete process.env[KEY];
});

afterEach(() => {
  if (original === undefined) delete process.env[KEY];
  else process.env[KEY] = original;
});

describe('unwrap', () => {
  it('returns data when the call succeeds', async () => {
    const { unwrap } = await loadGuard('sk_test_key');
    await expect(unwrap(Promise.resolve({ data: { sign: 'leo' } }))).resolves.toEqual({ sign: 'leo' });
  });

  it('refuses to call the API at all when no key is configured', async () => {
    const { unwrap, NO_KEY } = await loadGuard(undefined);
    const call = vi.fn(async () => ({ data: { sign: 'leo' } }));
    await expect(unwrap(call())).rejects.toThrow(NO_KEY);
  });

  it.each([
    ['validation_error', /birth details/i],
    ['invalid_api_key', /ROXYAPI_KEY/],
    ['subscription_inactive', /not active/i],
    ['rate_limit_exceeded', /limit/i],
    ['not_found', /not available/i],
  ])('maps %s onto a message a visitor can act on', async (code, expected) => {
    const { unwrap } = await loadGuard('sk_test_key');
    await expect(unwrap(Promise.resolve({ error: { code, error: 'raw' } }))).rejects.toThrow(expected);
  });

  it('falls back to the message the API sent for an unknown code', async () => {
    const { unwrap } = await loadGuard('sk_test_key');
    await expect(
      unwrap(Promise.resolve({ error: { code: 'teapot', error: 'Something specific went wrong' } })),
    ).rejects.toThrow('Something specific went wrong');
  });

  it('never leaks how the site is built into a visitor-facing message', async () => {
    const { unwrap } = await loadGuard('sk_test_key');
    await expect(unwrap(Promise.resolve({ error: { code: 'validation_error' } }))).rejects.not.toThrow(
      /stack|node_modules|sdk/i,
    );
  });
});

describe('tryUnwrap', () => {
  it('returns the data branch on success', async () => {
    const { tryUnwrap } = await loadGuard('sk_test_key');
    await expect(tryUnwrap(Promise.resolve({ data: 1 }))).resolves.toEqual({ data: 1 });
  });

  it('returns the error branch instead of throwing, so a Server Component can branch in JSX', async () => {
    const { tryUnwrap } = await loadGuard('sk_test_key');
    await expect(tryUnwrap(Promise.resolve({ error: { code: 'not_found' } }))).resolves.toEqual({
      error: 'That reading is not available.',
    });
  });
});
