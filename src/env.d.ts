/// <reference path="../.astro/types.d.ts" />
interface ImportMetaEnv {
  readonly VERCEL?: boolean;
  readonly VERCEL_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
