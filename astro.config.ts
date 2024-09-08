import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import solid from '@astrojs/solid-js';
import vercel from '@astrojs/vercel/static';
import { defineConfig } from 'astro/config';
import unocss from 'unocss/astro';
import { loadEnv } from 'vite';

const { SITE } = loadEnv(process.env.NODE_ENV ?? '', process.cwd(), '');

// https://astro.build/config
export default defineConfig({
  site: SITE,
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
