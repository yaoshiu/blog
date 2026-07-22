import { BaseElement, element, listen } from "@/lib/base-element.ts";

@element("scroll-top")
export default class ScrollTop extends BaseElement {
  #anchor: HTMLDivElement | null = null;
  #observer?: IntersectionObserver;

  @listen("click", "button")
  scrollToTop() {
    scrollTo({ top: 0, behavior: "smooth" });
  }

  override mounted() {
    this.#anchor = this.$(".anchor");

    const btn = this.$("button");

    this.#observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          btn.toggleAttribute("data-hidden", entry.isIntersecting);
        });
      },
      {
        root: null,
        threshold: 0,
      },
    );

    this.#observer.observe(this.#anchor);
  }

  override destroy() {
    this.#observer?.disconnect();
  }
}
