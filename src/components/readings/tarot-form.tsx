'use client';

import { RoxyTarotSpread } from '@roxyapi/ui-react';
import { useActionState } from 'react';
import { tarotAction } from '@/app/readings/actions';
import { ReadingError, ReadingResult, SubmitButton } from '@/components/readings/parts';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { IDLE } from '@/lib/reading-state';

export function TarotForm() {
  const [state, action] = useActionState(tarotAction, IDLE);

  return (
    <div>
      <form action={action} className="grid max-w-xl gap-6">
        <div className="space-y-2">
          <Label htmlFor="question">Your question</Label>
          <Textarea
            id="question"
            name="question"
            rows={3}
            placeholder="Ask about a situation you are actually inside of, not a yes or no."
          />
          <p className="text-xs text-muted-foreground">
            Optional, but the cards land better when the question is specific.
          </p>
        </div>

        {state.status === 'error' ? <ReadingError message={state.message} /> : null}

        <div>
          <SubmitButton>Draw three cards</SubmitButton>
        </div>
      </form>

      {state.status === 'ready' ? (
        <ReadingResult>
          <RoxyTarotSpread data={state.data} spread="three-card" />
        </ReadingResult>
      ) : null}
    </div>
  );
}
