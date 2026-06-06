import { render, type CollectionEntry } from 'astro:content';
import dayjs from 'dayjs';
import { postSlug } from './posts';

export default async function postData({
  entry,
  site,
}: {
  entry: CollectionEntry<'posts'>;
  site?: URL;
}) {
  const { remarkPluginFrontmatter } = await render(entry);
  const slug = postSlug(entry);
  const lastModified = dayjs(remarkPluginFrontmatter.lastModified);
  const dateModified = lastModified.isValid()
    ? lastModified.toISOString()
    : entry.data.published.toISOString();

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: entry.data.title,
    image: new URL(`/posts/${slug}/og.png`, site),
    datePublished: entry.data.published,
    dateModified,
    license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    description: entry.data.description,
    articleBody: entry.body ?? '',
    wordCount: remarkPluginFrontmatter.words,
    keywords: entry.data.tags,
    author: {
      '@type': 'Person',
      name: 'Fay Ash',
      url: site,
    },
  };
}
