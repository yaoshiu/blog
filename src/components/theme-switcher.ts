import { BaseElement, element, listen } from '@lib/base-element';

const hostSheet = new CSSStyleSheet();
hostSheet.replaceSync(':host { display: contents; }');

@element('theme-switcher')
export default class ThemeSwitcher extends BaseElement {
  static get template() {
    return `
      <button
        id="btn"
        type="button"
        class="hover:animate-spin bg-transparent cursor-pointer p-0 leading-none flex items-center">
        <span id="icon"></span>
      </button>`;
  }

  styles() {
    return [hostSheet];
  }

  #dark = false;
  #btn!: HTMLButtonElement;
  #icon!: HTMLSpanElement;

  mounted() {
    const stored = localStorage.getItem('theme');
    this.#dark = stored
      ? stored === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.#btn = this.$('btn')!;
    this.#icon = this.$('icon')!;
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
    this.#icon.className = this.#dark ? 'icon-[pixelarticons--moon]' : 'icon-[pixelarticons--sun-alt]';
    this.#btn.ariaLabel = `toggle ${this.#dark ? 'light' : 'dark'} mode`;
  }
}
