'use client';

import { RoxyHoroscopeCard } from '@roxyapi/ui-react';
import { useActionState } from 'react';
import { horoscopeAction } from '@/app/readings/actions';
import { ReadingError, ReadingResult, SubmitButton } from '@/components/readings/parts';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IDLE } from '@/lib/reading-state';

const SIGNS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

export function HoroscopeForm() {
  const [state, action] = useActionState(horoscopeAction, IDLE);

  return (
    <div>
      <form action={action} className="grid max-w-md gap-6">
        <div className="space-y-2">
          <Label htmlFor="sign">Your sun sign</Label>
          <Select name="sign" defaultValue="aries">
            <SelectTrigger id="sign" className="w-full">
              <SelectValue placeholder="Choose a sign" />
            </SelectTrigger>
            <SelectContent>
              {SIGNS.map((sign) => (
                <SelectItem key={sign} value={sign.toLowerCase()}>
                  {sign}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {state.status === 'error' ? <ReadingError message={state.message} /> : null}

        <div>
          <SubmitButton>Read today</SubmitButton>
        </div>
      </form>

      {state.status === 'ready' ? (
        <ReadingResult>
          <RoxyHoroscopeCard data={state.data} period="daily" />
        </ReadingResult>
      ) : null}
    </div>
  );
}
