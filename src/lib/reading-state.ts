/**
 * What a reading form gets back. Every reading action returns this shape, so the pages branch on
 * one union instead of each inventing its own loading and error handling.
 */
export type ReadingState<T> =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: T };

/** The starting state for every `useActionState` call. */
export const IDLE = { status: 'idle' } as const;
