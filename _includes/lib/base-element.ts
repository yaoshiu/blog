const ATTRS = "attrs" as const;
const ATTR_CALLBACKS = "attrCallbacks" as const;
const LISTENERS = "listeners" as const;

(Symbol as { metadata?: symbol }).metadata ??= Symbol.for('Symbol.metadata');

async function fetchStyle(uri: string) {
  const css = await fetch(uri).then((resp) => resp.text());
  const sheet = new CSSStyleSheet();
  await sheet.replace(css);
  return sheet;
}

const globalSheet = fetchStyle("/style.css");

function toKebab(s: string) {
  return s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
}

function toArray<T>(a: unknown) {
  return Array.isArray(a) ? (a as T[]) : [];
}

type AttrCallbackMap = Record<string, string | symbol>;

function toObject<T>(v: unknown) {
  return v !== null && typeof v === "object" && !Array.isArray(v)
    ? (v as T)
    : {} as T;
}

const attrCache = new WeakMap<BaseElement, Map<string, unknown>>();

interface EventDef {
  selector: string | null;
  event: string;
  method: string | symbol;
}

interface BoundListener {
  element: Element | HTMLElement;
  event: string;
  handler: EventListener;
}

const boundListeners = new WeakMap<BaseElement, BoundListener[]>();

function getAttrCache(instance: BaseElement): Map<string, unknown> {
  let m = attrCache.get(instance);
  if (!m) {
    m = new Map();
    attrCache.set(instance, m);
  }
  return m;
}

export abstract class BaseElement extends HTMLElement {
  constructor() {
    super();
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }
  }

  mounted?(): void;

  destroy?(): void;

  static get observedAttributes(): string[] {
    return toArray(this[Symbol.metadata]?.[ATTRS]);
  }

  async connectedCallback() {
    if (this.shadowRoot) {
      this.shadowRoot.adoptedStyleSheets = [await globalSheet];
    }

    const defs = toArray<EventDef>(this.constructor[Symbol.metadata]?.[LISTENERS]);
    const listeners: BoundListener[] = [];
    for (const { selector, event, method } of defs) {
      const func = (this as Record<string | symbol, unknown>)[method];
      if (typeof func !== "function") {
        continue;
      }
      const handler = func as (e: Event) => void;
      if (selector === null) {
        this.addEventListener(event, handler);
        listeners.push({ element: this, event, handler });
      } else {
        this.shadowRoot?.querySelectorAll(selector).forEach((element) => {
          element.addEventListener(event, handler);
          listeners.push({ element, event, handler });
        });
      }
    }
    if (listeners.length > 0) {
      boundListeners.set(this, listeners);
    }

    this.mounted?.();
  }

  disconnectedCallback() {
    const listeners = boundListeners.get(this);
    if (listeners) {
      for (const { element, event, handler } of listeners) {
        element.removeEventListener(event, handler);
      }
      boundListeners.delete(this);
    }
    this.destroy?.();
  }

  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
    attrCache.get(this)?.delete(name);
    const onChange = toObject<AttrCallbackMap>(this.constructor[Symbol.metadata]?.[ATTR_CALLBACKS])[name];
    if (onChange) {
      const func = (this as Record<string | symbol, unknown>)[onChange];
      if (typeof func === 'function') {
        func(oldVal, newVal);
      }
    }
  }

  override get innerHTML(): string {
    return this.shadowRoot!.innerHTML;
  }

  override set innerHTML(val: string) {
    this.shadowRoot!.innerHTML = val;
  }

  $<T extends HTMLElement = HTMLElement>(id: string) {
    return (this.shadowRoot?.getElementById(id) as T) ?? null;
  }
}

export function property<
  T extends BaseElement,
  P,
  const OnChange extends keyof T,
>(options?: {
  onChange?: OnChange;
  fromAttr?: (s: string | null) => P;
  toAttr?: (v: P) => string | null;
}) {
  const { onChange, fromAttr, toAttr } = options ?? {};

  return function (
    _target: ClassAccessorDecoratorTarget<T, P>,
    context: ClassAccessorDecoratorContext<T, P>,
  ) {
    const name = toKebab(String(context.name));
    context.metadata[ATTRS] = [...toArray(context.metadata[ATTRS]), name];
    if (onChange) {
      context.metadata[ATTR_CALLBACKS] = {
        ...toObject<AttrCallbackMap>(context.metadata[ATTR_CALLBACKS]),
        [name]: onChange,
      };
    }

    return {
      init(this: T, value: P) {
        if (value !== undefined && value !== null && !this.hasAttribute(name)) {
          const s = toAttr ? toAttr(value) : String(value);
          if (s !== null) this.setAttribute(name, s);
        }
        return value;
      },
      get(this: T) {
        const cache = getAttrCache(this);
        if (cache.has(name)) {
          return cache.get(name) as P;
        }
        const raw = this.getAttribute(name);
        if (fromAttr) {
          const val = fromAttr(raw);
          cache.set(name, val);
          return val;
        }
        cache.set(name, raw);
        return raw as P;
      },
      set(this: T, val: P) {
        if (toAttr) {
          const s = toAttr(val);
          if (s === null) {
            this.removeAttribute(name);
          } else {
            this.setAttribute(name, s);
          }
          return;
        }
        if (val === null || val === undefined) {
          this.removeAttribute(name);
        } else {
          this.setAttribute(name, String(val));
        }
      },
    };
  };
}

export function element(name: string) {
  return function <T extends typeof BaseElement>(
    target: T,
    _context: ClassDecoratorContext<T>,
  ) {
    customElements.define(name, target as unknown as CustomElementConstructor);
  };
}

export function listen<K extends keyof HTMLElementEventMap>(
  selector: string | null,
  event: K,
) {
  return function <T extends BaseElement>(
    _method: (this: T, e: HTMLElementEventMap[K]) => void,
    context: ClassMethodDecoratorContext<T>,
  ) {
    context.metadata[LISTENERS] = [
      ...toArray(context.metadata[LISTENERS]),
      { selector, event: event as string, method: context.name },
    ];
  };
}
