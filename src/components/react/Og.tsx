/** @jsxImportSource react */
import { ImageResponse } from '@vercel/og';
import colorSchemes from 'colorSchemes';
import { readFile } from 'node:fs/promises';

const BOLD = './src/assets/fonts/Noto_Sans/static/NotoSans-Bold.ttf';
const REGULAR = './src/assets/fonts/Noto_Sans/static/NotoSans-Regular.ttf';
const CAVEAT = './src/assets/fonts/Caveat/static/Caveat-Regular.ttf';

const TITLESIZE = 64;

const bold = await readFile(BOLD);
const caveat = await readFile(CAVEAT);
const regular = await readFile(REGULAR);

export default async function Og(title?: string) {
  return new ImageResponse(
    (
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
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: colorSchemes.text[0],
            backgroundColor: colorSchemes.background[0],
            padding: TITLESIZE,
            fontFamily: 'bold',
            fontSize: TITLESIZE,
          }}
        >
          {title}
        </div>
        <div
          style={{
            width: '100%',
            height: '100%',
            fontSize: TITLESIZE,
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
      </div>
    ),
    {
      fonts: [
        {
          name: 'bold',
          data: bold,
        },
        {
          name: 'regular',
          data: regular,
        },
        {
          name: 'caveat',
          data: caveat,
        },
      ],
    },
  );
}
