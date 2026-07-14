'use server';

import type {
  CalculateCompatibilityResponse,
  CalculateLifePathResponse,
  CalculateTypeResponse,
  CastThreeCardResponse,
  GenerateBodygraphResponse,
  GetDailyHoroscopeResponse,
  NatalChartResponse,
} from '@roxyapi/ui-react';
import { roxy } from '@/lib/roxy/client';
import { tryUnwrap } from '@/lib/roxy/guard';
import type { ReadingState } from '@/types';

/**
 * Every free reading runs through here: the form posts, the server calls RoxyAPI with the site key, and the typed response goes back to a component that renders it. The key never reaches the browser, which is the whole reason these are Server Actions and not client fetches.
 *
 * Endpoints, components, and the inputs each one needs: `docs/readings.md`. Response types come from the component package, so a spec change surfaces as a type error rather than a blank card.
 */

/** Turns the guard result into the state the forms consume. Nothing here throws, so a failed reading renders a message instead of an error page. */
async function toState<T>(call: Promise<{ data?: T; error?: { error?: string; code?: string } }>) {
  const result = await tryUnwrap(call);
  return 'error' in result
    ? ({ status: 'error', message: result.error } as const)
    : ({ status: 'ready', data: result.data } as const);
}

const invalid = (message: string) => ({ status: 'error', message }) as const;

function text(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function coords(form: FormData, prefix = '') {
  const field = (name: string) => (prefix ? `${prefix}.${name}` : name);
  const latitude = Number(text(form, field('latitude')));
  const longitude = Number(text(form, field('longitude')));
  const timezone = text(form, field('timezone'));
  const complete = Number.isFinite(latitude) && Number.isFinite(longitude) && timezone !== '';
  return { latitude, longitude, timezone, complete };
}

/** The API wants a full clock time; the browser time input gives minutes only. */
function clock(value: string): string {
  return /^\d{2}:\d{2}$/.test(value) ? `${value}:00` : value;
}

const SIGNS = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces',
] as const;

type Sign = (typeof SIGNS)[number];

function isSign(value: string): value is Sign {
  return (SIGNS as readonly string[]).includes(value);
}

export async function birthChartAction(
  _previous: ReadingState<NatalChartResponse>,
  form: FormData,
): Promise<ReadingState<NatalChartResponse>> {
  const date = text(form, 'date');
  const time = text(form, 'time');
  const place = coords(form);

  if (!date || !time) return invalid('Add your birth date and birth time.');
  if (!place.complete) return invalid('Pick your birth city from the list.');

  return toState(
    roxy.astrology.generateNatalChart({
      body: {
        date,
        time: clock(time),
        latitude: place.latitude,
        longitude: place.longitude,
        timezone: place.timezone,
      },
    }),
  );
}

export async function horoscopeAction(
  _previous: ReadingState<GetDailyHoroscopeResponse>,
  form: FormData,
): Promise<ReadingState<GetDailyHoroscopeResponse>> {
  const sign = text(form, 'sign').toLowerCase();
  if (!isSign(sign)) return invalid('Choose your sun sign.');

  return toState(roxy.astrology.getDailyHoroscope({ path: { sign } }));
}

export async function compatibilityAction(
  _previous: ReadingState<CalculateCompatibilityResponse>,
  form: FormData,
): Promise<ReadingState<CalculateCompatibilityResponse>> {
  const people = (['person1', 'person2'] as const).map((prefix) => ({
    date: text(form, `${prefix}.date`),
    time: text(form, `${prefix}.time`),
    place: coords(form, prefix),
  }));

  if (people.some((person) => !person.date || !person.time)) {
    return invalid('Add a birth date and birth time for both people.');
  }
  if (people.some((person) => !person.place.complete)) {
    return invalid('Pick a birth city for both people.');
  }

  const [person1, person2] = people.map((person) => ({
    date: person.date,
    time: clock(person.time),
    latitude: person.place.latitude,
    longitude: person.place.longitude,
    timezone: person.place.timezone,
  }));

  return toState(roxy.astrology.calculateCompatibility({ body: { person1, person2 } }));
}

export async function lifePathAction(
  _previous: ReadingState<CalculateLifePathResponse>,
  form: FormData,
): Promise<ReadingState<CalculateLifePathResponse>> {
  const date = text(form, 'date');
  const [year, month, day] = date.split('-').map(Number);

  if (!year || !month || !day) return invalid('Add your birth date.');

  return toState(roxy.numerology.calculateLifePath({ body: { year, month, day } }));
}

export async function tarotAction(
  _previous: ReadingState<CastThreeCardResponse>,
  form: FormData,
): Promise<ReadingState<CastThreeCardResponse>> {
  const question = text(form, 'question');

  return toState(roxy.tarot.castThreeCard({ body: question ? { question } : {} }));
}

/** Human Design birth data. The type card and the bodygraph read the same three fields. */
function humanDesignBody(form: FormData) {
  const date = text(form, 'date');
  const time = text(form, 'time');
  const place = coords(form);

  if (!date || !time) return invalid('Add your birth date and birth time.');
  if (!place.complete) return invalid('Pick your birth city from the list.');

  return {
    date,
    time: clock(time),
    timezone: place.timezone,
    latitude: place.latitude,
    longitude: place.longitude,
  };
}

export async function humanDesignTypeAction(
  _previous: ReadingState<CalculateTypeResponse>,
  form: FormData,
): Promise<ReadingState<CalculateTypeResponse>> {
  const body = humanDesignBody(form);
  if ('status' in body) return body;

  return toState(roxy.humanDesign.calculateType({ body }));
}

export async function humanDesignBodygraphAction(
  _previous: ReadingState<GenerateBodygraphResponse>,
  form: FormData,
): Promise<ReadingState<GenerateBodygraphResponse>> {
  const body = humanDesignBody(form);
  if ('status' in body) return body;

  return toState(roxy.humanDesign.generateBodygraph({ body }));
}
