import { describe, expect, it } from 'vitest';

/**
 * Upstream drift alarm. Every endpoint this site calls is checked against the live public OpenAPI
 * spec, so a renamed operation or a removed path surfaces here rather than as a broken reading on
 * somebody else's website.
 *
 * @remarks It needs the network, so it is excluded from `npm test` and from the pull request checks: a green build must never depend on a third party being up. It runs on a weekly schedule (`.github/workflows/spec-drift.yml`) and can be run by hand with `npm run test:drift`. No API key required, the spec is public.
 */
const SPEC = (domain: string) => `https://roxyapi.com/api/v2/${domain}/openapi.json`;

/** Every call in `src/app/readings/actions.ts`, `src/app/api/cities/route.ts`, and `src/components/card-of-the-day.tsx`. */
const ENDPOINTS = [
  {
    domain: 'astrology',
    method: 'post',
    path: '/astrology/natal-chart',
    operationId: 'generateNatalChart',
  },
  {
    domain: 'astrology',
    method: 'get',
    path: '/astrology/horoscope/{sign}/daily',
    operationId: 'getDailyHoroscope',
  },
  {
    domain: 'astrology',
    method: 'post',
    path: '/astrology/compatibility-score',
    operationId: 'calculateCompatibility',
  },
  {
    domain: 'numerology',
    method: 'post',
    path: '/numerology/life-path',
    operationId: 'calculateLifePath',
  },
  {
    domain: 'tarot',
    method: 'post',
    path: '/tarot/spreads/three-card',
    operationId: 'castThreeCard',
  },
  { domain: 'tarot', method: 'post', path: '/tarot/daily', operationId: 'getDailyCard' },
  {
    domain: 'human-design',
    method: 'post',
    path: '/human-design/type',
    operationId: 'calculateType',
  },
  {
    domain: 'human-design',
    method: 'post',
    path: '/human-design/bodygraph',
    operationId: 'generateBodygraph',
  },
  { domain: 'location', method: 'get', path: '/location/search', operationId: 'searchCities' },
] as const;

type Spec = { paths?: Record<string, Record<string, { operationId?: string }>> };

/** A per-domain spec states its paths relative to the domain, so `/tarot/daily` is keyed as `/daily` inside the tarot spec. The endpoints above keep the full path because that is what the docs and the request logs show. */
function specKey(domain: string, path: string): string {
  return path.slice(`/${domain}`.length);
}

const specs = new Map<string, Promise<Spec>>();

function loadSpec(domain: string): Promise<Spec> {
  const cached = specs.get(domain);
  if (cached) return cached;

  const request = fetch(SPEC(domain)).then((response) => {
    if (!response.ok) throw new Error(`${SPEC(domain)} returned ${response.status}`);
    return response.json() as Promise<Spec>;
  });

  specs.set(domain, request);
  return request;
}

describe('the endpoints this site calls still exist upstream', { timeout: 30_000 }, () => {
  for (const endpoint of ENDPOINTS) {
    it(`${endpoint.method.toUpperCase()} ${endpoint.path}`, async () => {
      const spec = await loadSpec(endpoint.domain);
      const operation = spec.paths?.[specKey(endpoint.domain, endpoint.path)]?.[endpoint.method];

      expect(operation, `${endpoint.path} is gone from the ${endpoint.domain} spec`).toBeDefined();
      expect(operation?.operationId, 'the SDK method name follows this operationId').toBe(
        endpoint.operationId,
      );
    });
  }
});
