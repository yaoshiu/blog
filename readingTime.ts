import getReadingTime from 'reading-time';
import * as MD from 'mdast-util-to-string';
import type { RemarkPlugin } from '@astrojs/markdown-remark';

export const readingTime: RemarkPlugin = () => {
  return (tree, { data }) => {
    (
      data.astro as {
        frontmatter: Record<string, string | number>;
      }
    ).frontmatter.readingTime = getReadingTime(MD.toString(tree)).text;
  };
};

export default readingTime;
