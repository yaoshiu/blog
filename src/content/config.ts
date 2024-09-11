import { defineCollection } from 'astro:content';
import postSchema from '@schemas/postSchema';

const posts = defineCollection({
  type: 'content',
  schema: postSchema,
});

export const collections = {
  posts,
};

export default collections;
