import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import Og from '@components/react/Og';
import { postSlug } from '@lib/posts';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map((entry) => ({
    params: { slug: postSlug(entry) },
    props: { entry },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  return await Og({ title: props.entry.data.title });
};
