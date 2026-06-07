import 'iconify-icon';
import { BaseElement, element, listen } from '@components/base-element';

@element('theme-switcher')
export default class ThemeSwitcher extends BaseElement {
  #dark = false;

  render() {
    return `
      <button
        id="btn"
        type="button"
        class="bg-transparent cursor-pointer p-0 leading-none flex"
      >
      </button>
    `;
  }

  mounted() {
    const stored = localStorage.getItem('theme');
    this.#dark = stored
      ? stored === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.update();
  }

  @listen('#btn', 'click')
  toggle() {
    this.#dark = !this.#dark;
    this.update();
  }

  update() {
    const btn = this.$<HTMLButtonElement>('btn')!;
    const icon = this.#dark ? 'pixelarticons:moon' : 'pixelarticons:sun-alt';
    btn.innerHTML = `<iconify-icon icon="${icon}" width="1em" height="1em"></iconify-icon>`;
    btn.ariaLabel = `toggle ${this.#dark ? 'light' : 'dark'} mode`;

    document.documentElement.classList.toggle('dark', this.#dark);
    localStorage.setItem('theme', this.#dark ? 'dark' : 'light');
  }
}
