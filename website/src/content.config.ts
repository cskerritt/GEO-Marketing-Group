import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const insights = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Chris Skerritt'),
    tags: z.array(z.string()).default([]),
    industry: z.enum(['law', 'cpa', 'consulting', 'financial-advisors', 'ae', 'general']).default('general'),
    draft: z.boolean().default(false),
    citations: z
      .array(
        z.object({
          label: z.string(),
          url: z.url(),
        })
      )
      .default([]),
  }),
});

export const collections = { insights };
