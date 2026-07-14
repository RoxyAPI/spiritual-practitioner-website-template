# Blog (file-based MDX, no database)

Posts are files in `content/blog/`. Adding a post = dropping a file. No CMS, no admin, no build config for the author.

## Pipeline

- Package: `next-mdx-remote-client` v2 (`/rsc` entry). It is the maintained successor to the archived next-mdx-remote; requires React 19 and Node 20.9+, MDX v3.
- Post route (`/blog/[slug]`): async Server Component reads the file, renders `<MDXRemote source={...} options={{ parseFrontmatter: true }} components={mdxComponents} />`. Wire the `onError` component so one bad file shows a friendly error instead of crashing the page.
- Index (`/blog`): list frontmatter with `getFrontmatter` from `next-mdx-remote-client/utils` (no compile needed for listing).
- SSG: `generateStaticParams` from `fs.readdir('content/blog')`. Slug = filename.
- Never render MDX from untrusted sources; this pipeline is for files in this repo only.

## Frontmatter schema

```yaml
---
title: What Your Birth Chart Actually Tells You
description: A plain guide to the big three, houses, and what a reading covers.
date: 2026-07-01
image: /blog/birth-chart-guide.jpg   # optional, overrides the OG card
---
```

`title` + `description` + `date` are required; the index sorts by `date` descending. Metadata mapping: [seo.md](./seo.md).

## Writing rules (for seed posts and author guidance)

- Plain markdown only: headings, paragraphs, lists, links, images. Avoid raw `<` and `{` characters in prose; MDX treats them as code and the build will fail on a stray one.
- Each post answers ONE question a potential client searches, states the answer in the first paragraph, and links to at least one reading page and one service ([seo.md](./seo.md)).
- Voice: warm, concrete, no hype openers ("Unlock", "Discover", "Transform"), no medical or crisis claims. Readings inform; they do not diagnose.
- Three seed posts ship with the template so the blog renders populated: one birth chart explainer, one "what to expect in a reading" post, one seasonal/timing post. Forks replace them.

## Adding a post (README-facing steps)

1. Copy any file in `content/blog/`.
2. Rename it (the filename becomes the URL), edit the frontmatter, write.
3. Commit. The index, sitemap, and social card update automatically.
