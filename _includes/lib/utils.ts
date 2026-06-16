export function toKebab(s: string) {
  return s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`).replace(/_/g, "-");
}
