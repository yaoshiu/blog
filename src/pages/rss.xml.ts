import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    return new Response('Site not found', { status: 404 });
  }

  const posts = await getCollection('posts');

  return rss({
    title: 'Fay Ash',
    description: '',
    site,
    items: posts.map(({ data: { title, published, description }, slug }) => ({
      title,
      pubDate: published,
      description,
      link: `/posts/${slug}`,
    })),
  });
};
