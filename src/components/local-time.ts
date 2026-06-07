import BaseElement from "@components/base-element";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export class LocalTime extends BaseElement {
  render() {
    let date = dayjs(this.date);
    if (this.guess) {
      date = date.tz(dayjs.tz.guess());
    }
    return date.format(this.format);
  }

  static get observedAttributes() {
    return ["date", "format", "guess"];
  }

  get date() {
    return this.getAttribute("date") || "";
  }

  set date(val) {
    this.setAttribute("date", val);
    this.innerHTML = this.render();
  }

  get format() {
    return this.getAttribute("format") || "";
  }

  set format(val) {
    this.setAttribute("format", val);
    this.innerHTML = this.render();
  }

  get guess() {
    return this.hasAttribute("guess");
  }

  set guess(val) {
    if (val) {
      this.setAttribute("guess", "");
    } else {
      this.removeAttribute("guess");
    }
    this.innerHTML = this.render();
  }
}

customElements.define("local-time", LocalTime);
