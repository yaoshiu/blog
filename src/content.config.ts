import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import postSchema from '@schemas/postSchema';

const posts = defineCollection({
  loader: glob({
    base: './src/content/posts',
    pattern: '**/[^_]*.{md,mdx}',
  }),
  schema: postSchema,
});

export const collections = {
  posts,
};

export default collections;
