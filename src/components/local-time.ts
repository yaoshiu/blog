import { BaseElement, element, property } from '@lib/base-element';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

@element('local-time')
export class LocalTime extends BaseElement {
  mounted() {
    this.render();
  }

  render() {
    let date = dayjs(this.date);
    if (this.guess) {
      date = date.tz(dayjs.tz.guess());
    }
    this.shadowRoot!.innerHTML = date.format(this.format ?? undefined);
  }

  @property({ onChange: 'render' })
  accessor date!: string | null;

  @property({ onChange: 'render' })
  accessor format!: string | null;

  @property({
    onChange: 'render',
    fromAttr: (s) => s !== null,
    toAttr: (v) => (v ? '' : null),
  })
  accessor guess!: boolean;
}
