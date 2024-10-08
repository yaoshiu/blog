import { z } from 'astro:content';

export const postSchema = z.object({
  title: z.string(),
  published: z.date(),
  description: z.string(),
  tags: z.array(z.string()),
});

export default postSchema;
