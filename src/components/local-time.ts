import { BaseElement, element, property } from '@components/base-element';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

@element('local-time')
export class LocalTime extends BaseElement {
  render() {
    let date = dayjs(this.date);
    if (this.guess) {
      date = date.tz(dayjs.tz.guess());
    }
    return date.format(this.format ?? undefined);
  }

  rerender() {
    this.shadowRoot!.innerHTML = this.render();
  }

  @property({ onChange: 'rerender' })
  accessor date!: string | null;

  @property({ onChange: 'rerender' })
  accessor format!: string | null;

  @property({ onChange: 'rerender', type: Boolean })
  accessor guess!: boolean;
}
