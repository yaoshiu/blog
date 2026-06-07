import { BaseElement } from "@components/base-element";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default class TypeWriter extends BaseElement {
  #span!: HTMLSpanElement;

  render() {
    return `
      <div>
        <span id="span"></span>
      </div>
    `;
  }

  static get observedAttributes() {
    return ["text", "speed", "infinite", "delspeed"];
  }

  get text() {
    return this.getAttribute("text");
  }

  async start() {
    
  }
}
