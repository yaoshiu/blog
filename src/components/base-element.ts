import globalStyle from '@styles/shadow.css?inline';

const globalSheet = new CSSStyleSheet();
globalSheet.replaceSync(globalStyle);

export default abstract class BaseElement extends HTMLElement {
  abstract render(): string;

  static get observedAttributes(): string[] {
    return [];
  }

  styles(): CSSStyleSheet[] {
    return [];
  }

  mounted(): void {}

  connectedCallback() {
    this.shadowRoot!.adoptedStyleSheets = [globalSheet, ...this.styles()];
    if (!this.shadowRoot!.innerHTML) {
      this.shadowRoot!.innerHTML = this.render();
    }
    this.mounted();
  }

  destroy(): void {}

  disconnectedCallback(): void {
    this.destroy();
  }

  attributeChangedCallback(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null,
  ): void {}

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  $<T extends HTMLElement = HTMLElement>(id: string): T | null {
    return (this.shadowRoot!.getElementById(id) as T) || null;
  }
}
