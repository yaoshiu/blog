import { animate, stagger, type AnimationOptions } from 'motion';
import BaseElement from '@components/base-element';

const DURATION = 0.5;
const STAGGER = 0.05;

export class SlideIn extends BaseElement {
  mounted() {
    animate(Array.from(this.children), { opacity: [0, 1], x: ['0.5rem', 0] }, {
      duration: DURATION,
      delay: stagger(STAGGER),
      ease: 'easeOut',
    } satisfies AnimationOptions);
  }

  render() {
    return `<slot />`;
  }
}

customElements.define('slide-in', SlideIn);
