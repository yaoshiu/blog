import 'iconify-icon';
import { BaseElement, element, listen } from '@lib/base-element';

@element('scroll-top')
export class ScrollTop extends BaseElement {
  static get template() {
    return `
      <div id="anchor" class="absolute top-[256px] left-0 h-px w-px"></div>
      <button
        type="button"
        id="btn"
        class="transition-opacity transition-discrete
        fixed bottom-4 right-4
        opacity-0 invisible
        bg-transparent rounded-full size-10 cursor-pointer
        flex items-center justify-center
        text-text-1 hover:bg-neutral-300/50 dark:hover:bg-neutral-600/50"
        aria-label="scroll to top"
      >
        <iconify-icon icon="fa6-solid:angle-up"></iconify-icon>
      </button>
    `;
  }

  #anchor!: HTMLDivElement;
  #observer!: IntersectionObserver;

  @listen('#btn', 'click')
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  mounted() {
    this.#anchor = this.$('anchor')!;

    this.#observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const btn = this.$<HTMLButtonElement>('btn')!;
          if (!entry.isIntersecting) {
            btn.classList.remove('invisible', 'opacity-0');
            btn.classList.add('opacity-100', 'visible');
          } else {
            btn.classList.remove('opacity-100', 'visible');
            btn.classList.add('invisible', 'opacity-0');
          }
        });
      },
      {
        root: null,
        threshold: 0,
      },
    );

    this.#observer.observe(this.#anchor);
  }

  destroy() {
    this.#observer.disconnect();
  }
}
