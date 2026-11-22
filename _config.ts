import { katex } from "@mdit/plugin-katex";
import shiki from "@shikijs/markdown-it";
import { transformerStyleToClass } from "@shikijs/transformers";
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
import sitemap from "lume/plugins/sitemap.ts";
import sourceMaps from "lume/plugins/source_maps.ts";
import svgo from "lume/plugins/svgo.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import validateHtml from "lume/plugins/validate_html.ts";

import { toKebab } from "@/lib/utils.ts";

const shikiStyleToClass = transformerStyleToClass();

// Zenbones is not bundled with Shiki, so define its restrained palette here.
const zenbones = {
  light: {
    name: "zenbones-light",
    type: "light",
    colors: {
      "editor.background": "#f0ede5",
      "editor.foreground": "#41403b",
      "editorLineNumber.foreground": "#a6a39b",
      "editor.selectionBackground": "#d9d5ca",
    },
    tokenColors: [
      { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#9a978f", fontStyle: "italic" } },
      { scope: ["keyword", "storage", "storage.type", "keyword.control"], settings: { foreground: "#41403b", fontStyle: "bold" } },
      { scope: ["string", "constant.character"], settings: { foreground: "#77746d", fontStyle: "italic" } },
      { scope: ["constant.numeric", "constant.language"], settings: { foreground: "#77746d", fontStyle: "italic" } },
      { scope: ["entity.name.function", "support.function"], settings: { foreground: "#41403b" } },
      { scope: ["entity.name.type", "support.type"], settings: { foreground: "#77746d" } },
      { scope: ["variable", "meta.object-literal.key"], settings: { foreground: "#73716b" } },
      { scope: ["punctuation", "meta.brace"], settings: { foreground: "#96938b" } },
      { scope: ["entity.name.tag", "support.constant"], settings: { foreground: "#77746d", fontStyle: "bold" } },
    ],
  },
  dark: {
    name: "zenbones-dark",
    type: "dark",
    colors: {
      "editor.background": "#1b1917",
      "editor.foreground": "#c4c2bd",
      "editorLineNumber.foreground": "#696762",
      "editor.selectionBackground": "#393632",
    },
    tokenColors: [
      { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#85827c", fontStyle: "italic" } },
      { scope: ["keyword", "storage", "storage.type", "keyword.control"], settings: { foreground: "#c4c2bd", fontStyle: "bold" } },
      { scope: ["string", "constant.character"], settings: { foreground: "#99968f", fontStyle: "italic" } },
      { scope: ["constant.numeric", "constant.language"], settings: { foreground: "#99968f", fontStyle: "italic" } },
      { scope: ["entity.name.function", "support.function"], settings: { foreground: "#c4c2bd" } },
      { scope: ["entity.name.type", "support.type"], settings: { foreground: "#99968f" } },
      { scope: ["variable", "meta.object-literal.key"], settings: { foreground: "#96938d" } },
      { scope: ["punctuation", "meta.brace"], settings: { foreground: "#77746e" } },
      { scope: ["entity.name.tag", "support.constant"], settings: { foreground: "#99968f", fontStyle: "bold" } },
    ],
  },
};

const markdown = {
  plugins: [
    katex,
    await shiki({
      themes: {
        light: zenbones.light,
        dark: zenbones.dark,
      },
      defaultColor: "light-dark()",
      transformers: [shikiStyleToClass],
    }),
  ],
};

const site = lume({
  location: new URL("https://fayash.me"),
}, { markdown });

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
  .use(feed({
    info: {
      title: "=site",
      description: "My personal website",
      published: new Date(),
    },
  }))
  .use(readingInfo())
  .use(sitemap())
  .use(robots())
  .use(attributes())
  .use(checkUrls())
  .use(validateHtml({
    rules: {
      "no-inline-style": ["error", {
        allowedProperties: [
          "text-align",
          "view-transition-name",
          "top",
          "height",
          "width",
          "margin-right",
          "vertical-align",
        ],
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
  .ignore("README.md")
  .add([".svg", ".jpg"])
  .add("npm:katex/dist/fonts/**", "/fonts");

site.process([".css"], (files) => {
  for (const file of files) {
    if (file.outputPath === "/style.css") {
      file.text += "\n" + shikiStyleToClass.getCSS();
    }
  }
});

export default site;
