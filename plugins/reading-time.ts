import getReadingTime from 'reading-time';
import * as MD from 'mdast-util-to-string';
import type { RemarkPlugin } from '@astrojs/markdown-remark';

export const readingTime: RemarkPlugin = () => {
  return (tree, { data }) => {
    const frontmatter = (
      data.astro as {
        frontmatter: Record<string, string | number>;
      }
    ).frontmatter;
    const readingTime = getReadingTime(MD.toString(tree));
    frontmatter.readingTime = readingTime.text;
    frontmatter.words = readingTime.words;
  };
};

export default readingTime;
