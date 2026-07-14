import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site.config';
import { listPosts } from '@/lib/blog';
import { enabledReadings } from '@/lib/readings';

/**
 * The sitemap is generated, never hand-listed. A reading switched off in the config drops out of it,
 * a new blog post appears in it, and neither needs anyone to remember. That is the point.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => `${siteConfig.siteUrl}${path}`;
  const posts = await listPosts();

  const pages = [
    { path: '', priority: 1 },
    { path: '/about', priority: 0.8 },
    { path: '/services', priority: 0.9 },
    { path: '/book', priority: 0.9 },
    { path: '/faq', priority: 0.7 },
    { path: '/contact', priority: 0.6 },
    { path: '/blog', priority: 0.7 },
    ...(siteConfig.testimonials.length > 0 ? [{ path: '/testimonials', priority: 0.6 }] : []),
    ...(enabledReadings().length > 0 ? [{ path: '/readings', priority: 0.9 }] : []),
  ];

  return [
    ...pages.map((page) => ({
      url: url(page.path),
      changeFrequency: 'monthly' as const,
      priority: page.priority,
    })),
    ...enabledReadings().map((reading) => ({
      url: url(reading.href),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...posts.map((post) => ({
      url: url(`/blog/${post.slug}`),
      lastModified: new Date(post.date),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ];
}
