import { BaseElement, element, listen } from "@/lib/base-element.ts";
import { toggleTheme } from "@/lib/theme.ts";

@element("theme-switcher")
export default class ThemeSwitcher extends BaseElement {
  @listen("button", "click")
  toggle() {
    toggleTheme();
  }
}
