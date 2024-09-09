import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local';
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
} from 'unocss';
import colorSchemes from 'colorSchemes';

export default defineConfig({
  presets: [
    presetUno(),
    presetTypography({
      cssExtend: {
        a: {
          color: 'rgb(var(--color-text-1))',
          'border-bottom': '1px solid rgba(var(--color-text-1), 0.5)',
          'text-decoration': 'none',
          transition: 'border-bottom 0.15s ease-in-out',
        },
        '.dark a': {
          color: 'rbg(var(--color-dark-text-1))',
        },
        'a:hover': {
          'border-bottom': '1px solid rgba(var(--color-text-1), 1)',
        },
      },
    }),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Inter',
        code: 'Source Code Pro',
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
              const color = value.replace(/#/, '');
              const r = Number.parseInt(color.substring(0, 2), 16);
              const g = Number.parseInt(color.substring(2, 4), 16);
              const b = Number.parseInt(color.substring(4, 6), 16);
              return `--color-${key}: ${r}, ${g}, ${b};`;
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
