import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { postSlug } from '@lib/posts';

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    return new Response('Site not found', { status: 404 });
  }

  const posts = await getCollection('posts');

  return rss({
    title: 'Fay Ash',
    description: '',
    site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.published,
      description: post.data.description,
      link: `/posts/${postSlug(post)}`,
    })),
  });
};
