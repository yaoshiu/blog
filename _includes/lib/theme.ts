const KEY = "theme";
const mq = matchMedia("(prefers-color-scheme: dark)");

export function toggleTheme() {
  const stored = localStorage.getItem(KEY);
  const root = document.documentElement;
  if (stored) {
    localStorage.removeItem(KEY);
    root.className = "scheme-light-dark";
  } else {
    const next = mq.matches ? "light" : "dark";
    localStorage.setItem(KEY, next);
    root.className = `scheme-${next}`;
  }
}

mq.addEventListener("change", () => {
  localStorage.removeItem(KEY);
  document.documentElement.className = "scheme-light-dark";
});
