import { dark, toggleDark } from "./Theme";

export const ThemeSwitcher = () => {
  return (
    <button
      type="button"
      bg-transparent
      onClick={toggleDark}
      aria-label={`Switch to ${dark() ? "light" : "dark"} mode`}
    >
      <div i-pixelarticons={dark() ? "moon" : "sun-alt"} />
    </button>
  );
};

export default ThemeSwitcher;
