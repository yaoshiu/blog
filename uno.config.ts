import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local';
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
} from 'unocss';
import colorSchemes from './colorSchemes';

export default defineConfig({
  presets: [
    presetUno(),
    presetTypography(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: {
          name: 'Roboto',
          weights: [100, 300, 400, 500, 700, 900],
        },
        code: {
          name: 'Source Code Pro',
          weights: [200, 300, 400, 500, 600, 700, 900],
        },
        pixel: 'VT323',
        handwrite: 'Caveat',
      },
      processors: createLocalFontProcessor(),
    }),
    presetIcons(),
    presetAttributify(),
    presetIcons(),
  ],

  theme: {
    colors: colorSchemes,

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
        blink: '1s',
      },
      timingFns: {
        blink: 'step-end',
      },
      counts: {
        blink: 'infinite',
      },
    },
  },

  preflights: [
    {
      getCSS: ({ theme }) =>
        `:root {${Object.entries(theme.colors)
          .map(function mapColors([key, value]): string {
            if (typeof value === 'string') {
              return `--color-${key}: ${value};`;
            }
            if (typeof value === 'object' && value) {
              return Object.entries(value)
                .map(([currentKey, value]) =>
                  mapColors([`${key}-${currentKey}`, value]),
                )
                .join('');
            }
            return '';
          })
          .join('')}}`,
    },
  ],
});
