import { createEffect, createSignal, onMount } from 'solid-js';

const SunIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
    <path fill="currentColor" d="M13 0h-2v4h2zM0 11v2h4v-2zm24 0v2h-4v-2zM13 24h-2v-4h2zM8 6h8v2H8zM6 8h2v8H6zm2 10v-2h8v2zm10-2h-2V8h2zm2-14h2v2h-2zm0 2v2h-2V4zm2 18h-2v-2h2zm-2-2h-2v-2h2zM4 2H2v2h2v2h2V4H4zM2 22h2v-2h2v-2H4v2H2z"/>
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
    <path fill="currentColor" d="M18 22H8v-2h10zM8 20H6v-2h2zm12 0h-2v-2h2zM6 18H4v-2h2zm16 0h-2v-4h-2v-2h2v-2h2zM4 16H2V6h2zm14 0h-6v-2h6zm-6-2h-2v-2h2zm-2-2H8V6h2zM6 6H4V4h2zm8-2h-2v2h-2V4H6V2h8z"/>
  </svg>
);

export default function ThemeSwitcher() {
  const [dark, setDark] = createSignal(false);

  onMount(() => {
    const stored = localStorage.getItem('theme');
    setDark(stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);

    createEffect(() => {
      document.documentElement.classList.toggle('dark', dark());
      localStorage.setItem('theme', dark() ? 'dark' : 'light');
    });
  });

  return (
    <button
      type="button"
      aria-label={`Toggle ${dark() ? 'light' : 'dark'} mode`}
      class="bg-transparent cursor-pointer"
      onClick={() => setDark((dark) => !dark)}
    >
      {dark() ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
