import type { CollectionEntry } from 'astro:content';

export function postSlug(entry: CollectionEntry<'posts'>) {
  return entry.id
    .replace(/\/index(?:\.(?:md|mdx))?$/, '')
    .replace(/\.(?:md|mdx)$/, '');
}
