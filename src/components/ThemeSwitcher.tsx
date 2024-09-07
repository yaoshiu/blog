import { dark, toggleDark } from './Theme';

export const ThemeSwitcher = () => {
  return (
    <button
      type="button"
      onClick={toggleDark}
      aria-label={`Switch to ${dark() ? 'light' : 'dark'} mode`}
      class="bg-transparent"
    >
      <svg
        class={dark() ? 'i-pixelarticons:moon' : 'i-pixelarticons:sun-alt'}
      />
    </button>
  );
};

export default ThemeSwitcher;
