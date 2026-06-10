import lume from "lume/mod.ts";
import checkUrls from "lume/plugins/check_urls.ts";
import date from "lume/plugins/date.ts";
import favicon from "lume/plugins/favicon.ts";
import feed from "lume/plugins/feed.ts";
import jsonLd from "lume/plugins/json_ld.ts";
import lightningcss from "lume/plugins/lightningcss.ts";
import metas from "lume/plugins/metas.ts";
import ogImages from "lume/plugins/og_images.ts";
import readingInfo from "lume/plugins/reading_info.ts";
import robots from "lume/plugins/robots.ts";
import seo from "lume/plugins/seo.ts";
import sitemap from "lume/plugins/sitemap.ts";
import validateHtml from "lume/plugins/validate_html.ts";
import googleFonts from "lume/plugins/google_fonts.ts";
import attributes from "lume/plugins/attributes.ts";
import esbuild from "lume/plugins/esbuild.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import icons from "lume/plugins/icons.ts";
import inline from "lume/plugins/inline.ts";
import sourceMaps from "lume/plugins/source_maps.ts";

const site = lume();

site.use(checkUrls());
site.use(date());
site.use(esbuild());
site.use(googleFonts({
  fonts:
    "https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=VT323&display=swap",
}));
site.use(tailwindcss());
site.use(lightningcss());
site.use(sourceMaps());
site.use(ogImages());
site.use(favicon());
site.use(metas());
site.use(jsonLd());
site.use(icons({
  catalogs: [
    {
      id: "iconify",
      src: "https://api.iconify.design/{variant}/{name}.svg",
      variants: [
        "pixelarticons",
        "fa6-brands",
        "fa6-regular",
      ],
    },
  ],
}));
site.use(inline());
site.use(feed());
site.use(readingInfo());
site.use(robots());
site.use(seo());
site.use(sitemap());
site.use(attributes());
site.use(validateHtml({
  rules: {
    "attribute-boolean-style": "off",
  },
}));

site.add("style.css");
site.add("js/");

export default site;
