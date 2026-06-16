{
  const stored = localStorage.getItem("theme");
  const sysDark = matchMedia("(prefers-color-scheme: dark)").matches;
  if (stored === "light" && sysDark) {
    document.documentElement.className = "scheme-light";
  } else if (stored === "dark" && !sysDark) {
    document.documentElement.className = "scheme-dark";
  } else {
    document.documentElement.className = "scheme-light-dark";
    localStorage.removeItem("theme");
  }
}
