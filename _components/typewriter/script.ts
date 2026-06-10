import { BaseElement, element, property } from "@/lib/base-element.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@element("type-writer")
export default class TypeWriter extends BaseElement {
  #span!: HTMLSpanElement;
  #destroyed = false;

  @property({
    fromAttr: (s) => (s ? s.split("|") : []),
    toAttr: (v) => v.join("|"),
  })
  accessor text!: string[];

  @property({ fromAttr: Number })
  accessor speed!: number;

  @property({ fromAttr: Number })
  accessor decSpeed!: number;

  @property({ fromAttr: (s) => s !== null, toAttr: (b) => b ? "" : null })
  accessor infinite!: boolean;

  override mounted() {
    this.#span = this.$("span");
    this.start();
  }

  async start() {
    let y = 0;
    while (!this.#destroyed) {
      const word = this.text[y];
      for (let x = 0; x <= word.length; x++) {
        if (this.#destroyed) return;
        this.#span.textContent = word.slice(0, x);
        await sleep(this.speed);
      }
      if (y === this.text.length - 1 && !this.infinite) break;
      for (let x = word.length; x >= 0; x--) {
        if (this.#destroyed) return;
        this.#span.textContent = word.slice(0, x);
        await sleep(this.decSpeed);
      }
      y = (y + 1) % this.text.length;
    }
  }

  override destroy() {
    this.#destroyed = true;
  }
}
