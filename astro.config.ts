import { defineConfig } from "astro/config";
import solid from "@astrojs/solid-js";
import unocss from "unocss/astro";

// https://astro.build/config
export default defineConfig({
  integrations: [
    solid(),
    unocss({
      injectReset: "@unocss/reset/tailwind-compat.css",
    }),
  ],
});
