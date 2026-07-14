/**
 * Testimonials run between sections as full-width pull-quotes rather than in a boxed carousel:
 * a quote a visitor reads on the way past is worth more than one they have to click through.
 */
export function PullQuote({
  quote,
  name,
  detail,
}: {
  quote: string;
  name: string;
  detail?: string;
}) {
  return (
    <figure className="mx-auto max-w-3xl py-6 text-center">
      <blockquote className="font-display text-2xl italic leading-relaxed sm:text-3xl">
        {quote}
      </blockquote>
      <figcaption className="mt-6 flex flex-col items-center gap-1">
        <span className="script text-primary">{name}</span>
        {detail ? <span className="text-sm text-muted-foreground">{detail}</span> : null}
      </figcaption>
    </figure>
  );
}
