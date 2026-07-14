import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import Link from 'next/link';

/**
 * How a post renders. Markdown elements map onto the same type scale as the rest of the site, so a
 * post never looks like it came from a different template. Add a component here to make it available
 * to every post; nothing else needs to change.
 */
export const mdxComponents: MDXComponents = {
  h2: (props) => <h2 className="mt-14 font-display text-3xl" {...props} />,
  h3: (props) => <h3 className="mt-10 font-display text-2xl" {...props} />,
  p: (props) => <p className="mt-6 leading-relaxed text-muted-foreground" {...props} />,
  ul: (props) => <ul className="mt-6 space-y-3 pl-5 text-muted-foreground [&>li]:list-disc" {...props} />,
  ol: (props) => (
    <ol className="mt-6 space-y-3 pl-5 text-muted-foreground [&>li]:list-decimal" {...props} />
  ),
  blockquote: (props) => (
    <blockquote className="mt-8 border-l-2 border-accent pl-6 font-display text-xl italic" {...props} />
  ),
  a: ({ href = '', ...props }) =>
    href.startsWith('/') ? (
      <Link href={href} className="text-foreground underline underline-offset-4" {...props} />
    ) : (
      <a
        href={href}
        rel="noopener noreferrer"
        target="_blank"
        className="text-foreground underline underline-offset-4"
        {...props}
      />
    ),
  img: ({ src = '', alt = '' }) => (
    <Image
      src={String(src)}
      alt={alt}
      width={1200}
      height={675}
      className="mt-10 w-full rounded-2xl border border-border"
    />
  ),
  hr: () => <hr className="mt-12 border-border" />,
};

/** Shown in place of a post that fails to compile, so one bad file never takes the page down. */
export function MdxError() {
  return (
    <p role="alert" className="rounded-xl border border-destructive/40 p-4 text-destructive">
      This post could not be rendered. Check its formatting and try again.
    </p>
  );
}
