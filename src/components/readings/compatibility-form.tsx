'use client';

import { RoxyCompatibilityCard } from '@roxyapi/ui-react';
import { useActionState } from 'react';
import { CitySearch } from '@/components/city-search';
import { ReadingError, ReadingResult, SubmitButton } from '@/components/readings/parts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { compatibilityAction } from '@/app/readings/actions';
import { IDLE } from '@/lib/reading-state';

const PEOPLE = [
  { prefix: 'person1', heading: 'You' },
  { prefix: 'person2', heading: 'Them' },
] as const;

export function CompatibilityForm() {
  const [state, action] = useActionState(compatibilityAction, IDLE);

  return (
    <div>
      <form action={action} className="grid max-w-4xl gap-10">
        <div className="grid gap-10 md:grid-cols-2">
          {PEOPLE.map((person) => (
            <fieldset key={person.prefix} className="space-y-6">
              <legend className="eyebrow text-primary">{person.heading}</legend>

              <div className="space-y-2">
                <Label htmlFor={`${person.prefix}-date`}>Birth date</Label>
                <Input id={`${person.prefix}-date`} name={`${person.prefix}.date`} type="date" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${person.prefix}-time`}>Birth time</Label>
                <Input id={`${person.prefix}-time`} name={`${person.prefix}.time`} type="time" required />
              </div>

              <CitySearch prefix={person.prefix} />
            </fieldset>
          ))}
        </div>

        {state.status === 'error' ? <ReadingError message={state.message} /> : null}

        <div>
          <SubmitButton>Score us</SubmitButton>
        </div>
      </form>

      {state.status === 'ready' ? (
        <ReadingResult>
          <RoxyCompatibilityCard data={state.data} mode="astrology" />
        </ReadingResult>
      ) : null}
    </div>
  );
}
