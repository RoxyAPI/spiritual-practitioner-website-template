import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { getFrontmatter } from 'next-mdx-remote-client/utils';
import type { PostMeta } from '@/types';

/**
 * The blog is a folder of files. Adding a post means dropping an `.mdx` file into `content/blog/`, and the index, the sitemap, and the social card follow it: no database, no CMS, no admin login to forget the password to.
 *
 * Writing rules and the frontmatter schema: `docs/blog.md`.
 */

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

/** Every post, newest first. Frontmatter only, so listing never compiles MDX it is not going to render. */
export async function listPosts(): Promise<PostMeta[]> {
  const files = await readdir(BLOG_DIR).catch(() => []);

  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith('.mdx'))
      .map(async (file) => {
        const source = await readFile(path.join(BLOG_DIR, file), 'utf8');
        const { frontmatter } = getFrontmatter<Omit<PostMeta, 'slug'>>(source);
        return { slug: file.replace(/\.mdx$/, ''), ...frontmatter };
      }),
  );

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

/** The raw MDX for one post, or null when the slug does not exist. */
export async function readPost(slug: string): Promise<string | null> {
  // A slug comes from the URL, so it never gets to walk out of the content folder.
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;

  return readFile(path.join(BLOG_DIR, `${slug}.mdx`), 'utf8').catch(() => null);
}

/** Reading date, written the way a person would say it. */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
