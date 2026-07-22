import {
  BaseElement,
  element,
  listenAttr,
  property,
} from "@/lib/base-element.ts";

@element("type-writer")
export class TypeWriter extends BaseElement {
  #span: HTMLSpanElement | null = null;
  #controller: AbortController | null = null;

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
    this.#span = this.$(".text");
    this.restart();
  }

  @listenAttr("text")
  async restart() {
    if (this.#span === null) {
      return;
    }

    this.#controller?.abort();

    this.#controller = new AbortController();
    const signal = this.#controller.signal;

    const sleep = (ms: number) => (new Promise<void>((resolve) => {
      if (signal.aborted) {
        return resolve();
      }
      const timer = setTimeout(() => {
        signal.removeEventListener("abort", onAbort);
        resolve();
      }, ms);
      function onAbort() {
        clearTimeout(timer);
        resolve();
      }
      signal.addEventListener("abort", onAbort);
    }));

    let y = 0;
    while (!signal.aborted) {
      const word = this.text[y];
      for (let x = 0; x <= word.length; x++) {
        if (signal.aborted) {
          return;
        }
        this.#span.textContent = word.slice(0, x);
        await sleep(this.speed);
      }

      if (y === this.text.length - 1 && !this.infinite) {
        break;
      }

      for (let x = word.length; x >= 0; x--) {
        if (signal.aborted) {
          return;
        }
        this.#span.textContent = word.slice(0, x);
        await sleep(this.decSpeed);
      }

      y = (y + 1) % this.text.length;
    }
  }

  override destroy() {
    this.#controller?.abort();
  }
}
