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

type colorScheme = {
  [key: string]: string | string[] | colorScheme;
};

function mapColors([key, value]: [
  string,
  string | string[] | colorScheme,
]): string {
  if (typeof value === 'string') {
    const r = Number.parseInt(value.substring(1, 3), 16);
    const g = Number.parseInt(value.substring(3, 5), 16);
    const b = Number.parseInt(value.substring(5, 7), 16);
    return `--color-${key}: ${r} ${g} ${b};`;
  }
  return Object.entries(value)
    .map(([currentKey, value]: [string, string | string[] | colorScheme]) =>
      mapColors([`${key}-${currentKey}`, value]),
    )
    .join('');
}

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
            '1px solid rgb(var(--color-text-1) / var(--border-opacity))',
          'text-decoration': 'none',
          transition: 'border-bottom 0.15s ease-in-out',
        },
        'a:hover': {
          '--border-opacity': '1',
        },
        '.data-footnote-backref': {
          'font-family': '"Inter"',
        },
        hr: {
          'border-top': '1px solid rgb(var(--color-text-1) / 0.1)',
        },
        blockquote: {
          'border-left': '4px solid rgb(var(--color-text-1) / 0.1)',
          background: 'rgb(var(--color-background-1))',
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
    presetAttributify(),
    presetIcons({
      collections: {
        async devicon() {
          return import('@iconify-json/devicon').then((m) => m.icons);
        },
        async 'fa6-brands'() {
          return import('@iconify-json/fa6-brands').then((m) => m.icons);
        },
        async 'fa6-regular'() {
          return import('@iconify-json/fa6-regular').then((m) => m.icons);
        },
        async 'fa6-solid'() {
          return import('@iconify-json/fa6-solid').then((m) => m.icons);
        },
        async pixelarticons() {
          return import('@iconify-json/pixelarticons').then((m) => m.icons);
        },
      },
    }),
  ],

  theme: {
    colors: Object.entries(colorSchemes).reduce(
      (acc: Record<string, string | string[]>, [key, value]) => {
        if (typeof value === 'string') {
          acc[key] = `rgb(var(--color-${key}))`;
        }
        if (Array.isArray(value)) {
          acc[key] = value.map((_, i) => `rgb(var(--color-${key}-${i}))`);
        }
        return acc;
      },
      {},
    ),

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
      getCSS: () =>
        `:root {${Object.entries(colorSchemes).map(mapColors).join('')}}
      .dark {${Object.entries(colorSchemes.dark).map(mapColors).join('')}}`,
    },
  ],
});
