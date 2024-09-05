import type { JSX } from 'solid-js';
import { dark, toggleDark } from './Theme';

export const ThemeSwitcher = (
  props: JSX.ButtonHTMLAttributes<HTMLButtonElement>,
) => {
  return (
    <button
      {...props}
      type="button"
      onClick={toggleDark}
      aria-label={`Switch to ${dark() ? 'light' : 'dark'} mode`}
      bg="transparent"
    >
      <svg i-pixelarticons={dark() ? 'moon' : 'sun-alt'} />
    </button>
  );
};

export default ThemeSwitcher;
