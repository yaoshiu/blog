import type { RemarkPlugin } from '@astrojs/markdown-remark';
import { execSync } from 'node:child_process';

export const lastModified: RemarkPlugin = () => {
  return (_, file) => {
    (
      file.data.astro as { frontmatter: Record<string, string> }
    ).frontmatter.lastModified = execSync(
      `git log -1 --pretty="format:%cI" "${file.history[0]}"`,
    ).toString();
  };
};

export default lastModified;
