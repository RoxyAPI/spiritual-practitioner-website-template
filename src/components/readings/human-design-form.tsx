'use client';

import { RoxyBodygraph, RoxyHdTypeCard } from '@roxyapi/ui-react';
import { useActionState, useState } from 'react';
import { CitySearch } from '@/components/city-search';
import { ReadingError, ReadingResult, SubmitButton } from '@/components/readings/parts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { humanDesignBodygraphAction, humanDesignTypeAction } from '@/app/readings/actions';
import { IDLE } from '@/lib/reading-state';

/**
 * Two steps on purpose. The type card is one question answered instantly, which is what most people
 * came for; the full bodygraph is a second request, made only when the visitor asks for it. That
 * keeps the first result fast and the second one wanted.
 */
export function HumanDesignForm() {
  const [type, typeAction] = useActionState(humanDesignTypeAction, IDLE);
  const [bodygraph, bodygraphAction] = useActionState(humanDesignBodygraphAction, IDLE);
  const [birth, setBirth] = useState<Record<string, string> | null>(null);

  return (
    <div>
      <form
        action={(form) => {
          // Kept so the bodygraph step can resubmit the same birth data without asking for it twice.
          setBirth(Object.fromEntries([...form.entries()].map(([key, value]) => [key, String(value)])));
          typeAction(form);
        }}
        className="grid max-w-2xl gap-6"
      >
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

        <CitySearch label="Birth city" />

        {type.status === 'error' ? <ReadingError message={type.message} /> : null}

        <div>
          <SubmitButton>Find my type</SubmitButton>
        </div>
      </form>

      {type.status === 'ready' ? (
        <ReadingResult>
          <RoxyHdTypeCard data={type.data} />

          {bodygraph.status === 'ready' ? (
            <div className="mt-8 border-t border-border pt-8">
              <RoxyBodygraph data={bodygraph.data} />
            </div>
          ) : (
            <form action={bodygraphAction} className="mt-8 border-t border-border pt-8 text-center">
              {birth
                ? Object.entries(birth).map(([key, value]) => (
                    <input key={key} type="hidden" name={key} value={value} />
                  ))
                : null}

              {bodygraph.status === 'error' ? (
                <div className="mb-6">
                  <ReadingError message={bodygraph.message} />
                </div>
              ) : null}

              <Button type="submit" variant="outline" size="lg" className="eyebrow">
                Reveal your full chart
              </Button>
            </form>
          )}
        </ReadingResult>
      ) : null}
    </div>
  );
}
