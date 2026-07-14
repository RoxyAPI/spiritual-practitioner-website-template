/** Injects one structured-data block. Builders live in `src/lib/seo.ts`; which page owns which type is listed in `docs/seo.md`. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // The payload is built from the config, never from visitor input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
