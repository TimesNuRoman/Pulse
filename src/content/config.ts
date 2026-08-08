// R257: Astro content collection for the /changelog page.
// One MD file per release. Body is grouped under ### New / ### Improved
// / ### Fixed / ### Security. Order: New → Improved → Fixed → Security
// (omit empty groups). See /workspace/.tasks/changelog.md for the
// authoring spec.
import { defineCollection, z } from 'astro:content';

const changelog = defineCollection({
  type: 'content',
  schema: z.object({
    version: z.string(),
    date: z.coerce.date(),
    platforms: z
      .array(z.enum(['windows', 'android', 'web', 'pro']))
      .nonempty(),
    title: z.string(),
    summary: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { changelog };
