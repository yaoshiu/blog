import { BaseElement, element, listen } from "@/lib/base-element.ts";

@element("image-lightbox")
export default class ImageLightbox extends BaseElement {
  #dialog: HTMLDialogElement | null = null;
  #img: HTMLImageElement | null = null;
  #caption: HTMLParagraphElement | null = null;

  override mounted() {
    this.#dialog = this.$("dialog");
    this.#img = this.$("img");
    this.#caption = this.$(".caption");
  }

  @listen(".gallery", "click")
  onGalleryClick(e: MouseEvent) {
    const img = (e.target as HTMLElement).closest("img");
    if (img && this.#img && this.#caption) {
      this.#img.src = img.src;
      this.#img.alt = img.alt;
      this.#caption.textContent = img.alt;
      this.#dialog?.showModal();
    }
  }

  @listen("dialog", "click")
  onDialogClick() {
    this.#dialog?.close();
  }
}
