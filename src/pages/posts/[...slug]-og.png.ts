import type { APIRoute } from 'astro';
import Og from '@components/react/Og';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map((entry) =>
  ({
    params: { slug: entry.slug },
    props: { entry }
  }));
}

export const GET: APIRoute = async ({ props }) => {
  return await Og(props.entry.data.title);
};
