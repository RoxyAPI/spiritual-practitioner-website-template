import { NextResponse } from 'next/server';
import { roxy } from '@/lib/roxy/client';
import { tryUnwrap } from '@/lib/roxy/guard';

/**
 * City autocomplete, proxied so the API key stays on the server.
 *
 * @remarks Nobody should be asked to type latitude and longitude into a birth chart form. The visitor types a city, this route returns the matches, and the selected city carries the coordinates and the timezone that every chart calculation needs. Rule: `docs/readings.md`, location first.
 */
export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('q')?.trim();
  if (!query || query.length < 2) return NextResponse.json({ cities: [] });

  const result = await tryUnwrap(roxy.location.searchCities({ query: { q: query, limit: 6 } }));
  if ('error' in result) return NextResponse.json({ cities: [] });

  return NextResponse.json({ cities: result.data.cities });
}
