import { BaseElement, element } from "@/lib/base-element.ts";

@element("native-router")
export default class NativeRouter extends BaseElement {
  override mounted() {
    navigation.addEventListener("navigate", this.#navigation);
  }

  #navigation = (event: NavigateEvent) => {
    if (!event.canIntercept || event.downloadRequest || event.hashChange) {
      return;
    }

    const url = new URL(event.destination.url);
    const ext = url.pathname.match(/\.([^./]+)$/)?.[1];
    if (ext && ext !== "html") {
      return;
    }

    event.intercept({
      handler: async () => {
        try {
          const response = await fetch(url);
          const html = await response.text();

          const doc = new DOMParser().parseFromString(html, "text/html");
          const target = doc.querySelector<NativeRouter>(
            this.tagName.toLowerCase(),
          );

          if (target) {
            if (document.startViewTransition) {
              document.startViewTransition(() =>
                this.#update(target, doc.title)
              );
            } else {
              this.#update(target, doc.title);
            }
          } else {
            location.assign(url);
          }
        } catch {
          location.assign(url);
        }
      },
    });
  };

  #update(target: NativeRouter, title: string) {
    document.title = title;
    const tpl = target.querySelector<HTMLTemplateElement>("template");
    this.innerHTML = tpl?.innerHTML ?? target.innerHTML;
  }
}
