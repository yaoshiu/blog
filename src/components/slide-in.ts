import { animate, stagger, type AnimationOptions } from 'motion';
import { BaseElement, element } from '@lib/base-element';

const DURATION = 0.5;
const STAGGER = 0.05;

@element('slide-in')
export class SlideIn extends BaseElement {
  static template = '<slot />';

  mounted() {
    animate(Array.from(this.children), { opacity: [0, 1], x: ['0.5rem', 0] }, {
      duration: DURATION,
      delay: stagger(STAGGER),
      ease: 'easeOut',
    } satisfies AnimationOptions);
  }
}
