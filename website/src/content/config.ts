import { defineCollection, z } from 'astro:content';

const insights = defineCollection({
  type: 'content',
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
          url: z.string().url(),
        })
      )
      .default([]),
  }),
});

export const collections = { insights };
