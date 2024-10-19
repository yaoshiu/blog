import type { AttributifyAttributes } from 'unocss/preset-attributify';

declare module 'solid-js' {
  namespace JSX {
    interface HTMLAttributes<T> extends AttributifyAttributes {}
  }
}

interface Prose {
  prose?: string | boolean;
}

declare global {
  namespace astroHTML.JSX {
    interface HTMLAttributes extends AttributifyAttributes {}
    interface HTMLAttributes extends Prose {}
  }
}
