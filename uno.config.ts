import { createLocalFontProcessor } from "@unocss/preset-web-fonts/local";
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
} from "unocss";
import palette from "./palette";

export default defineConfig({
  presets: [
    presetUno(),
    presetWebFonts({
      provider: "google",
      fonts: {
        sans: {
          name: "Roboto",
          weights: [100, 300, 400, 500, 700, 900],
        },
        code: {
          name: "Source Code Pro",
          weights: [200, 300, 400, 500, 600, 700, 900],
        },
        pixel: "VT323",
        handwrite: "Caveat",
      },
      processors: createLocalFontProcessor(),
    }),
    presetIcons(),
    presetAttributify(),
    presetTypography(),
    presetIcons(),
  ],
  theme: {
    colors: palette,

    animation: {
      keyframes: {
        blink: `{
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }`,
      },
      duration: {
        blink: "1s",
      },
      timingFns: {
        blink: "step-end",
      },
      counts: {
        blink: "infinite",
      },
    },
  },
});
