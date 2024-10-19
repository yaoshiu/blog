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
    presetTypography({
      cssExtend: {
        a: {
          color: 'rgb(var(--prose-a-color))',
          '--prose-a-color': 'var(--color-text-1)',
          '--border-opacity': '0.5',
          'border-bottom':
            '1px solid rgba(var(--color-text-1), var(--border-opacity))',
          'text-decoration': 'none',
          transition: 'border-bottom 0.15s ease-in-out',
        },
        '.dark a': {
          '--prose-a-color': 'var(--color-dark-text-1)',
          'border-bottom':
            '1px solid rgba(var(--color-dark-text-1), var(--border-opacity))',
        },
        'a:hover': {
          '--border-opacity': '1',
        },
        '.data-footnote-backref': {
          'font-family': '"Inter"',
        },
        hr: {
          'border-top': '1px solid rgba(var(--color-text-1), 0.1)',
        },
        '.dark hr': {
          'border-top': '1px solid rgba(var(--color-dark-text-1), 0.1)',
        },
        blockquote: {
          'border-left': '4px solid rgba(var(--color-text-1), 0.1)',
          background: 'rgb(var(--color-background-1))',
        },
        '.dark blockquote': {
          'border-left': '4px solid rgba(var(--color-dark-text-1), 0.1)',
          background: 'rgb(var(--color-dark-background-1))',
        },
      },
    }),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Inter',
        mono: 'Source Code Pro',
        pixel: 'VT323',
        handwrite: 'Caveat',
      },
      processors: createLocalFontProcessor(),
    }),
    presetIcons({
      collections: {
        async devicon() {
          return import('@iconify-json/devicon').then((i) => i.icons);
        },
        async 'fa6-brands'() {
          return import('@iconify-json/fa6-brands').then((i) => i.icons);
        },
        async 'fa6-regular'() {
          return import('@iconify-json/fa6-regular').then((i) => i.icons);
        },
        async 'fa6-solid'() {
          return import('@iconify-json/fa6-solid').then((i) => i.icons);
        },
        async pixelarticons() {
          return import('@iconify-json/pixelarticons').then((i) => i.icons);
        },
      },
    }),
    presetAttributify(),
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
