import { dark, toggleDark } from "./Theme";

export const ThemeSwitcher = () => {
  return (
    <button
      type="button"
      bg-transparent
      onClick={toggleDark}
      aria-label={`Switch to ${dark() ? "light" : "dark"} mode`}
    >
      <div
        class={dark() ? "i-pixelarticons:moon" : "i-pixelarticons:sun-alt"}
      />
    </button>
  );
};

export default ThemeSwitcher;
