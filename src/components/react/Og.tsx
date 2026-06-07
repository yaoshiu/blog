/** @jsxImportSource react */
import { ImageResponse } from '@vercel/og';
import colorSchemes from '@lib/color-schemes';
import signature from '@assets/signature.svg?raw';

const SIZE = { width: 1200, height: 630 };

function signatureUrl(color: string) {
  const svg = signature.replace('currentColor', color);
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

export default async function Og(title?: string) {
  if (title) {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: colorSchemes.background[0],
            padding: '80px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              fontSize: 64,
              fontWeight: 700,
              color: colorSchemes.text[0],
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
          <img
            src={signatureUrl(colorSchemes.primary)}
            width={181}
            height={60}
            style={{ objectFit: 'contain', objectPosition: 'left' }}
          />
        </div>
      ),
      SIZE,
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colorSchemes.primary,
        }}
      >
        <img
          src={signatureUrl(colorSchemes.background[0])}
          width={363}
          height={120}
          style={{ objectFit: 'contain' }}
        />
      </div>
    ),
    SIZE,
  );
}
