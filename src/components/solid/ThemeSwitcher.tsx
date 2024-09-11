import { createEffect, createSignal, onMount } from 'solid-js';

export default function ThemeSwitcher() {
  const [dark, setDark] = createSignal(false);

  onMount(() => {
    setDark(localStorage.getItem('theme') === 'dark');

    createEffect(() => {
      document.documentElement.classList.toggle('dark', dark());
      window.localStorage.setItem('theme', dark() ? 'dark' : 'light');
    });
  });

  return (
    <button
      type="button"
      aria-label={`Toggle ${dark() ? 'light' : 'dark'} mode`}
      class="bg-transparent"
      onClick={() => setDark((dark) => !dark)}
    >
      <svg class="i-pixelarticons:sun-alt dark:i-pixelarticons:moon" />
    </button>
  );
}
