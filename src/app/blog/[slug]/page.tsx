import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { getFrontmatter } from 'next-mdx-remote-client/utils';
import { BookingCta } from '@/components/booking-cta';
import { MdxError, mdxComponents } from '@/components/mdx-components';
import { Section } from '@/components/section';
import { formatDate, listPosts, readPost } from '@/lib/blog';
import type { PostMeta } from '@/types';

/** Every post is a file that exists at build time, so every post is a static page. */
export async function generateStaticParams() {
  const posts = await listPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const source = await readPost(slug);
  if (!source) return {};

  const { frontmatter } = getFrontmatter<Omit<PostMeta, 'slug'>>(source);

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: 'article',
      title: frontmatter.title,
      description: frontmatter.description,
      publishedTime: frontmatter.date,
      ...(frontmatter.image ? { images: [frontmatter.image] } : {}),
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const source = await readPost(slug);
  if (!source) notFound();

  const { frontmatter } = getFrontmatter<Omit<PostMeta, 'slug'>>(source);

  return (
    <div className="divide-y divide-border/60">
      <Section>
        <article>
          <header>
            <time dateTime={frontmatter.date} className="eyebrow text-primary">
              {formatDate(frontmatter.date)}
            </time>
            <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
              {frontmatter.title}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">{frontmatter.description}</p>
          </header>

          <div className="mt-12">
            <MDXRemote
              source={source}
              options={{ parseFrontmatter: true }}
              components={mdxComponents}
              onError={MdxError}
            />
          </div>

          <footer className="mt-16 border-t border-border pt-8">
            <Link href="/blog" className="text-sm underline underline-offset-4">
              Back to all writing
            </Link>
          </footer>
        </article>
      </Section>

      <Section>
        <BookingCta line="If this landed close to something you are living through, bring it to a session." />
      </Section>
    </div>
  );
}
