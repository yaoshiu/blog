import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import solid from '@astrojs/solid-js';
import vercel from '@astrojs/vercel/static';
import { defineConfig } from 'astro/config';
import unocss from 'unocss/astro';

const LOCAL = 'http://localhost:4321';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE ?? LOCAL,
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  integrations: [
    mdx(),
    react({ include: ['**/react/*'] }),
    sitemap(),
    solid({ include: ['**/solid/*'] }),
    unocss({ injectReset: '@unocss/reset/tailwind-compat.css' }),
  ],
});
