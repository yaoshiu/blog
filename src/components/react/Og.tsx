/** @jsxImportSource react */
import { ImageResponse } from '@vercel/og';
import colorSchemes from 'colorSchemes';
import { readFile } from 'node:fs/promises';

const NOTO_SANS = './src/assets/fonts/Noto_Sans/static/NotoSans-Bold.ttf';
const CAVEAT = './src/assets/fonts/Caveat/static/Caveat-Regular.ttf';

export default async function Og(title?: string, fontSize = 64) {
  const sans = await readFile(NOTO_SANS);
  const caveat = await readFile(CAVEAT);

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: title ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          color: colorSchemes.text[0],
          backgroundColor: colorSchemes.background[0],
          padding: fontSize,
          fontFamily: 'sans',
          fontSize,
        }}
      >
        {title}
      </div>
      <div
        style={{
          width: '100%',
          height: '100%',
          fontSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'caveat',
          color: colorSchemes.text[0],
          backgroundColor: colorSchemes.primary,
        }}
      >
        Fay Ash
      </div>
    </div>,
    {
      fonts: [
        {
          name: 'sans',
          data: sans,
        },
        {
          name: 'caveat',
          data: caveat,
        },
      ],
    },
  );
}
