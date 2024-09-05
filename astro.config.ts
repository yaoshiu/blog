import solid from '@astrojs/solid-js';
import { defineConfig } from 'astro/config';
import unocss from 'unocss/astro';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  integrations: [
    solid(),
    unocss({
      injectReset: '@unocss/reset/tailwind-compat.css',
    }),
    mdx(),
  ],
});
