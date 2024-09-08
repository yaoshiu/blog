function toggleDark() {
  document.documentElement.classList.toggle('dark');
}

export const ThemeSwitcher = () => {
  return (
    <button
      type="button"
      onClick={toggleDark}
      aria-label="Toggle dark/light mode"
      class="bg-transparent"
    >
      <svg class="i-pixelarticons:sun-alt dark:i-pixelarticons:moon" />
    </button>
  );
};

export default ThemeSwitcher;
