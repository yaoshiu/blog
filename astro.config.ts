import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import solid from '@astrojs/solid-js';
import vercelStatic from '@astrojs/vercel';
import { defineConfig } from 'astro/config';
import unocss from 'unocss/astro';
import lastModified from './lastModified';
import readingTime from './readingTime';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {
  remarkDefinitionList,
  defListHastHandlers,
} from 'remark-definition-list';
import remarkGemoji from 'remark-gemoji';
import rehypeCallouts from 'rehype-callouts';

const LOCAL = 'http://localhost:4321';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE ?? LOCAL,
  adapter: vercelStatic({
    webAnalytics: {
      enabled: true,
    },
    imageService: true,
  }),
  markdown: {
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
  },
  integrations: [
    mdx(),
    react({ include: ['**/react/*'] }),
    sitemap(),
    solid({ include: ['**/solid/*'] }),
    unocss({ injectReset: '@unocss/reset/tailwind-compat.css' }),
  ],
});
