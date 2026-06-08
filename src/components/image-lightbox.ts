import { BaseElement, element, listen } from '@lib/base-element';

@element('image-lightbox')
export class ImageLightbox extends BaseElement {
  static get template() {
    return `
      <div id="gallery">
        <slot />
      </div>

      <dialog
        id="dialog"
        class="m-auto max-w-[90vw] max-h-[90vh] bg-transparent overflow-hidden outline-none
        transition-all transition-discrete duration-300
        scale-95 opacity-0
        open:scale-100 open:opacity-100
        starting:open:scale-95 starting:open:opacity-0
        backdrop:transition-opacity backdrop:transition-discrete backdrop:duration-300
        backdrop:opacity-0 open:backdrop:opacity-100 starting:open:backdrop:opacity-0
        backdrop:bg-black/10 backdrop:backdrop-blur-sm"
      >
        <div class="flex flex-col items-center max-h-[90vh] gap-2">
          <img
            id="img"
            class="min-h-0 drop-shadow-2xl object-contain rounded-md bg-transparent"
            src=""
            alt="lightbox image"
          />
          <p id="caption" class="text-white text-shadow-lg empty:hidden"></p>
        </div>
      </dialog>
    `;
  }

  #dialog!: HTMLDialogElement;
  #lightboxImg!: HTMLImageElement;
  #lightboxCaption!: HTMLParagraphElement;

  mounted() {
    this.#dialog = this.$('dialog')!;
    this.#lightboxImg = this.$('img')!;
    this.#lightboxCaption = this.$('caption')!;
  }

  @listen('#gallery', 'click')
  onGalleryClick(e: MouseEvent) {
    const img = (e.target as HTMLElement).closest('img');
    if (img) {
      this.#lightboxImg.src = img.src;
      this.#lightboxImg.alt = img.alt;
      this.#lightboxCaption.textContent = img.alt;
      this.#dialog.showModal();
    }
  }

  @listen('#dialog', 'click')
  onDialogClick() {
    this.#dialog.close();
  }
}
