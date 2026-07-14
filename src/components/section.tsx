import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

/**
 * The one layout primitive. A section is full width, so whatever it paints behind itself (the soft wash, a border, anything a later palette adds) runs edge to edge exactly like the header and the footer do. The container INSIDE it owns the width, the gutters, and the vertical rhythm.
 *
 * @remarks That split is the entire point. Because the container lives here and not in the root layout, a page never sets a width or a padding, and the content of every section lines up with the wordmark in the header and the columns in the footer no matter what its background is doing. A container in the root layout instead would cap every background at its edge, so a washed section would stop short of the viewport and read as a floating band.
 *
 * @example A hero whose wash bleeds to the screen edge while its content stays on the grid.
 * ```tsx
 * <Section wash="start" containerClassName="grid items-center gap-12 md:grid-cols-2">
 *   <div>...</div>
 *   <Image ... />
 * </Section>
 * ```
 */
export function Section({
  wash,
  className,
  containerClassName,
  children,
  ...props
}: ComponentProps<'section'> & {
  /** A single soft radial wash bleeding from a corner. Never stack two: `docs/design.md`. */
  wash?: 'start' | 'end';
  /** Overrides on the inner container, for a narrower measure (`max-w-3xl`) or to make it the grid itself. */
  containerClassName?: string;
}) {
  return (
    <section
      className={cn('relative', wash && 'wash', wash === 'end' && 'wash-end', className)}
      {...props}
    >
      <div className={cn('site-container py-16 sm:py-24', containerClassName)}>{children}</div>
    </section>
  );
}
