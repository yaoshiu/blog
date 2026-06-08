import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { pathToFileURL } from 'url';
import {
  remarkDefinitionList,
  defListHastHandlers,
} from 'remark-definition-list';
import remarkGemoji from 'remark-gemoji';
import rehypeCallouts from 'rehype-callouts';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import lastModified from './plugins/last-modified.ts';
import readingTime from './plugins/reading-time.ts';

const LOCAL = 'http://localhost:4321';

export default defineConfig({
  site: process.env.SITE ?? LOCAL,
  vite: {
    esbuild: { target: 'es2022' },
    plugins: [
      tailwindcss(),
      {
        name: 'fix-create-require-url',
        transform(code, id) {
          if (code.includes('createRequire(import.meta.url)')) {
            const fileUrl = pathToFileURL(id).href;
            return {
              code: code.replaceAll(
                'createRequire(import.meta.url)',
                `createRequire(${JSON.stringify(fileUrl)})`
              ),
              map: null,
            };
          }
        },
      },
    ],
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        readingTime,
        lastModified,
        remarkMath,
        remarkDefinitionList,
        remarkGemoji,
      ],
      rehypePlugins: [rehypeKatex, rehypeCallouts],
      remarkRehype: {
        handlers: {
          ...defListHastHandlers,
        },
      },
    }),
  },
  integrations: [
    mdx(),
    react({ include: ['**/react/*'] }),
    sitemap(),
  ],
});
