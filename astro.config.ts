import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import solid from '@astrojs/solid-js';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
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
    // @ts-expect-error
    plugins: [tailwindcss()],
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
    solid({ include: ['**/solid/*'] }),
  ],
});
