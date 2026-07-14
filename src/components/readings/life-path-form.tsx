'use client';

import { RoxyNumerologyCard } from '@roxyapi/ui-react';
import { useActionState } from 'react';
import { lifePathAction } from '@/app/readings/actions';
import { ReadingError, ReadingResult, SubmitButton } from '@/components/readings/parts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IDLE } from '@/lib/reading-state';

export function LifePathForm() {
  const [state, action] = useActionState(lifePathAction, IDLE);

  return (
    <div>
      <form action={action} className="grid max-w-md gap-6">
        <div className="space-y-2">
          <Label htmlFor="date">Birth date</Label>
          <Input id="date" name="date" type="date" required />
          <p className="text-xs text-muted-foreground">
            The life path number comes from the date alone. No birth time needed.
          </p>
        </div>

        {state.status === 'error' ? <ReadingError message={state.message} /> : null}

        <div>
          <SubmitButton>Find my number</SubmitButton>
        </div>
      </form>

      {state.status === 'ready' ? (
        <ReadingResult>
          <RoxyNumerologyCard data={state.data} type="life-path" />
        </ReadingResult>
      ) : null}
    </div>
  );
}
