import 'iconify-icon';
import { BaseElement, element, listen } from '@lib/base-element';

@element('theme-switcher')
export default class ThemeSwitcher extends BaseElement {
  #dark = false;

  mounted() {
    this.innerHTML = `
      <button
        id="btn"
        type="button"
        class="bg-transparent cursor-pointer p-0 leading-none flex"
      >
      </button>
    `;
    const stored = localStorage.getItem('theme');
    this.#dark = stored
      ? stored === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.updateIcon();
  }

  @listen('#btn', 'click')
  toggle() {
    this.#dark = !this.#dark;
    this.updateIcon();
    document.documentElement.classList.toggle('dark', this.#dark);
    localStorage.setItem('theme', this.#dark ? 'dark' : 'light');
  }

  updateIcon() {
    const btn = this.$<HTMLButtonElement>('btn')!;
    const icon = this.#dark ? 'pixelarticons:moon' : 'pixelarticons:sun-alt';
    btn.innerHTML = `<iconify-icon icon="${icon}" width="1em" height="1em"></iconify-icon>`;
    btn.ariaLabel = `toggle ${this.#dark ? 'light' : 'dark'} mode`;
  }
}
