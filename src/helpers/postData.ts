import type { CollectionEntry } from "astro:content";
import dayjs from "dayjs";

export default async function postData({ entry, site }: { entry: CollectionEntry<'posts'>, site?: URL }) {
  const { remarkPluginFrontmatter } = await entry.render();
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": entry.data.title,
    "image": new URL(`/posts/${entry.slug}/og.png`, site),
    "datePublished": entry.data.published,
    "dateModified": dayjs(remarkPluginFrontmatter.updated).toISOString(),
    "license": "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    "description": entry.data.description,
    "articleBody": entry.body,
    "wordCount": remarkPluginFrontmatter.words,
    "keywords": entry.data.tags,
    "author": {
      "@type": "Person",
      "name": "Fay Ash",
      "url": site,
    }
  }
}
