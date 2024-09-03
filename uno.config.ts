import { createLocalFontProcessor } from "@unocss/preset-web-fonts/local";
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
} from "unocss";

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
    presetIcons({
      autoInstall: true,
    }),
    presetAttributify(),
    presetTypography(),
    presetIcons(),
  ],
  theme: {
    colors: {
      pri: "#007BFF",
      sec: "#FF00FF",
      acc: "#00FF00",
      bg: "#F8F8FF",
      layer: "#FFA07A",
      text: {
        pri: "#333333",
        sec: "#708090",
      },
      err: "#FF4136",
      succ: "#40E0D0",

      dark: {
        pri: "#FF007F",
        sec: "#00FFFF",
        acc: "#BF00FF",
        bg: "#1A1A1A",
        layer: "#FF6F61",
        text: {
          pri: "#FFFFFF",
          sec: "#A9A9A9",
        },
        err: "#FF4500",
        succ: "#32CD32",
      },

      hover: "#FFFF00",
      border: "#8A2BE2",
    },

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
