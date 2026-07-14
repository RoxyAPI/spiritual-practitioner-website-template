'use client';

import { MapPin } from 'lucide-react';
import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { City } from '@/types';

/**
 * Birth city picker. Selecting a city fills the hidden coordinate and timezone fields the chart
 * endpoints need, so the visitor never sees a number they would have to look up.
 *
 * @remarks The timezone sent on is the IANA name from the city record rather than a fixed offset, because that is what stays correct across a daylight saving boundary in the year somebody was born.
 *
 * @param prefix - Field name prefix, so two of these can sit on one form (the compatibility reading uses `person1` and `person2`).
 */
export function CitySearch({
  label = 'Birth city',
  prefix = '',
  required = true,
}: {
  label?: string;
  prefix?: string;
  required?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState<City[]>([]);
  const [selected, setSelected] = useState<City | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const field = (name: string) => (prefix ? `${prefix}.${name}` : name);
  const id = `${prefix || 'birth'}-city`;

  function onChange(value: string) {
    setQuery(value);
    setSelected(null);

    if (debounce.current) clearTimeout(debounce.current);
    if (value.trim().length < 2) {
      setMatches([]);
      return;
    }

    debounce.current = setTimeout(async () => {
      const response = await fetch(`/api/cities?q=${encodeURIComponent(value)}`).catch(() => null);
      const body = (await response?.json().catch(() => null)) as { cities?: City[] } | null;
      setMatches(body?.cities ?? []);
    }, 250);
  }

  function choose(city: City) {
    setSelected(city);
    setQuery(labelFor(city));
    setMatches([]);
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <MapPin
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          id={id}
          value={query}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Start typing a city"
          autoComplete="off"
          aria-describedby={`${id}-hint`}
          className="pl-9"
        />

        {matches.length > 0 ? (
          <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
            {matches.map((city) => (
              <li key={`${city.city}-${city.latitude}-${city.longitude}`}>
                <button
                  type="button"
                  onClick={() => choose(city)}
                  className="block w-full px-4 py-3 text-left text-sm hover:bg-muted"
                >
                  {labelFor(city)}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <p id={`${id}-hint`} className="text-xs text-muted-foreground">
        {selected
          ? `Using ${labelFor(selected)}`
          : 'Pick your city from the list so the timezone is right.'}
      </p>

      {/* The values the chart endpoints actually receive. Empty until a city is picked, which is what makes the field required. */}
      <input
        type="hidden"
        name={field('latitude')}
        value={selected?.latitude ?? ''}
        required={required}
      />
      <input type="hidden" name={field('longitude')} value={selected?.longitude ?? ''} />
      <input type="hidden" name={field('timezone')} value={selected?.timezone ?? ''} />
    </div>
  );
}

function labelFor(city: City): string {
  return [city.city, city.province, city.country].filter(Boolean).join(', ');
}
