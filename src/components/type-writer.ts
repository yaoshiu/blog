import { BaseElement, property, element } from '@lib/base-element';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const numProperty = property({ fromAttr: (s) => (s ? Number(s) : 0) });

@element('type-writer')
export default class TypeWriter extends BaseElement {
  static get template() {
    return `
      <div>
        <span id="span"></span>
        <span class="animate-blink border-l border-text-0"></span>
      </div>
    `;
  }

  #span!: HTMLSpanElement;
  #destroyed = false;

  @property({
    fromAttr: (s) => (s ? s.split('|') : []),
    toAttr: (v) => v.join('|'),
  })
  accessor text!: string[];

  @numProperty
  accessor speed!: number;

  @numProperty
  accessor decSpeed!: number;

  @property({ fromAttr: (s) => s !== null, toAttr: (v) => (v ? '' : null) })
  accessor infinite!: boolean;

  mounted() {
    this.#span = this.$('span')!;
    this.start();
  }

  async start() {
    let y = 0;
    while (!this.#destroyed) {
      const word = this.text[y];
      for (let x = 0; x <= word.length; x++) {
        if (this.#destroyed) return;
        this.#span.innerText = word.slice(0, x);
        await sleep(this.speed);
      }
      if (y === this.text.length - 1 && !this.infinite) break;
      for (let x = word.length; x >= 0; x--) {
        if (this.#destroyed) return;
        this.#span.innerText = word.slice(0, x);
        await sleep(this.decSpeed);
      }
      y = (y + 1) % this.text.length;
    }
  }

  destroy() {
    this.#destroyed = true;
  }
}
