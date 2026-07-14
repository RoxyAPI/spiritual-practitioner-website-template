'use client';

import { RoxyNatalChart } from '@roxyapi/ui-react';
import { useActionState } from 'react';
import { birthChartAction } from '@/app/readings/actions';
import { CitySearch } from '@/components/city-search';
import { ReadingError, ReadingResult, SubmitButton } from '@/components/readings/parts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IDLE } from '@/lib/reading-state';

export function BirthChartForm() {
  const [state, action] = useActionState(birthChartAction, IDLE);

  return (
    <div>
      <form action={action} className="grid max-w-2xl gap-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date">Birth date</Label>
            <Input id="date" name="date" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Birth time</Label>
            <Input id="time" name="time" type="time" required />
          </div>
        </div>

        <CitySearch />

        {state.status === 'error' ? <ReadingError message={state.message} /> : null}

        <div>
          <SubmitButton>Draw my chart</SubmitButton>
        </div>
      </form>

      {state.status === 'ready' ? (
        <ReadingResult>
          <RoxyNatalChart data={state.data} />
        </ReadingResult>
      ) : null}
    </div>
  );
}
