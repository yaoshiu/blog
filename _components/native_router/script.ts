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
          const target = doc.querySelector<NativeRouter>(this.tagName.toLowerCase());


          if (target) {
            const content = target.innerHTML;
            if (document.startViewTransition) {
              document.startViewTransition(() =>
                this.#update(content, doc.title)
              );
            } else {
              this.#update(content, doc.title);
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

  #update(content: string, title: string) {
    document.title = title;
    this.setHTMLUnsafe(content);
  }
}
