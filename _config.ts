import shiki from "@shikijs/markdown-it";
import { Features } from "lume/deps/lightningcss.ts";
import lume from "lume/mod.ts";
import attributes from "lume/plugins/attributes.ts";
import checkUrls from "lume/plugins/check_urls.ts";
import date from "lume/plugins/date.ts";
import esbuild from "lume/plugins/esbuild.ts";
import favicon from "lume/plugins/favicon.ts";
import feed from "lume/plugins/feed.ts";
import googleFonts from "lume/plugins/google_fonts.ts";
import icons from "lume/plugins/icons.ts";
import inline from "lume/plugins/inline.ts";
import jsonLd from "lume/plugins/json_ld.ts";
import lightningcss from "lume/plugins/lightningcss.ts";
import metas from "lume/plugins/metas.ts";
import minifyHTML from "lume/plugins/minify_html.ts";
import ogImages from "lume/plugins/og_images.ts";
import readingInfo from "lume/plugins/reading_info.ts";
import robots from "lume/plugins/robots.ts";
import seo from "lume/plugins/seo.ts";
import sitemap from "lume/plugins/sitemap.ts";
import sourceMaps from "lume/plugins/source_maps.ts";
import svgo from "lume/plugins/svgo.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import validateHtml from "lume/plugins/validate_html.ts";
import { katex } from "@mdit/plugin-katex";

import { toKebab } from "@/lib/utils.ts";

const markdown = {
  plugins: [
    katex,
    await shiki({
      themes: {
        light: "solarized-light",
        dark: "solarized-dark",
      },
      defaultColor: "light-dark()",
    }),
  ],
};

const site = lume({}, { markdown });

site
  .use(date())
  .use(icons({
    catalogs: [
      {
        id: "iconify",
        src: "https://api.iconify.design/{variant}/{name}.svg",
        variants: [
          "pixelarticons",
          "fa6-brands",
          "lucide",
        ],
      },
    ],
  }))
  .use(esbuild())
  .use(googleFonts({
    fonts:
      "https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=VT323&display=swap",
  }))
  .use(tailwindcss())
  .use(lightningcss({
    options: {
      exclude: Features.LightDark,
    },
  }))
  .use(sourceMaps())
  .use(ogImages())
  .use(favicon())
  .use(metas())
  .use(jsonLd())
  .use(svgo())
  .use(inline())
  .use(feed())
  .use(readingInfo())
  .use(sitemap())
  .use(robots())
  .use(attributes())
  .use(checkUrls())
  .use(seo())
  .use(validateHtml({
    rules: {
      "no-inline-style": ["error", {
        allowedProperties: ["text-align", "view-transition-name", "color"],
      }],
      "attribute-boolean-style": "off",
    },
  }))
  .use(minifyHTML({
    options: {
      keep_closing_tags: true,
      keep_html_and_head_opening_tags: true,
    },
  }))
  .add("style.css")
  .add("js")
  .filter("spread", (value: Record<string, unknown>) => {
    if (!value || typeof value !== "object") {
      return "";
    }

    return Object.entries(value).map(([key, val]) => {
      const name = toKebab(key);
      if (val === true) {
        return name;
      }
      if (val === false || val === null || val === undefined) {
        return "";
      }
      return `${name}="${String(val).replace(/"/g, "&quot;")}"`;
    }).filter(Boolean).join(" ");
  })
  .add("assets")
  .add("npm:katex/dist/fonts/**", "/fonts");

export default site;
