import { toKebab } from "@/lib/utils.ts";

const ATTRS = "attrs" as const;
const ATTR_CALLBACKS = "attrCallbacks" as const;
const LISTENERS = "listeners" as const;

(Symbol as { metadata?: symbol }).metadata ??= Symbol.for("Symbol.metadata");

function toArray<T>(a: unknown) {
  return Array.isArray(a) ? (a as T[]) : [];
}

type AttrCallbackMap<T extends BaseElement> = Record<
  string,
  (this: T, prev: T[keyof T], next: T[keyof T]) => void
>;

function toObject<T>(v: unknown) {
  return v !== null && typeof v === "object" && !Array.isArray(v)
    ? (v as T)
    : {} as T;
}

const attrCache = new WeakMap<BaseElement, Map<string, unknown>>();

interface EventDef<T extends BaseElement, K extends keyof HTMLElementEventMap> {
  selector: string | undefined;
  event: K;
  method: (this: T, e: HTMLElementEventMap[K]) => void;
}

interface BoundListener {
  element: Element | HTMLElement;
  event: string;
  handler: EventListener;
}

type Attr<T extends BaseElement> = Record<
  string,
  {
    fromAttr?: (s: string | null) => T[keyof T];
    toAttr?: (v: T[keyof T]) => string | null;
  }
>;

const boundListeners = new WeakMap<BaseElement, BoundListener[]>();

function getAttrCache(instance: BaseElement): Map<string, unknown> {
  let m = attrCache.get(instance);
  if (!m) {
    m = new Map();
    attrCache.set(instance, m);
  }
  return m;
}

let _globalSheet: CSSStyleSheet | undefined;

function globalSheet() {
  if (_globalSheet) {
    return _globalSheet;
  }
  _globalSheet = new CSSStyleSheet();
  const rules: string[] = [];
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        rules.push(rule.cssText);
      }
    } catch { /* cross-origin, skip */ }
  }

  _globalSheet.replaceSync(rules.join("\n"));
  return _globalSheet;
}

export abstract class BaseElement extends HTMLElement {
  mounted?(): void;

  destroy?(): void;

  static get observedAttributes(): string[] {
    return Object.keys(
      toObject<Attr<BaseElement>>(this[Symbol.metadata]?.[ATTRS]),
    );
  }

  constructor() {
    super();
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      return;
    }

    const sheet = globalSheet();
    if (sheet) {
      this.shadowRoot.adoptedStyleSheets = [sheet];
    }

    this.mounted?.();

    const defs = toArray<EventDef<BaseElement, keyof HTMLElementEventMap>>(
      this.constructor[Symbol.metadata]?.[LISTENERS],
    );
    const listeners: BoundListener[] = [];
    for (const { selector, event, method } of defs) {
      const handler = method.bind(this);
      if (selector === undefined) {
        this.shadowRoot.addEventListener(event, handler);
        listeners.push({ element: this.shadowRoot.host, event, handler });
      } else {
        this.shadowRoot.querySelectorAll(selector).forEach((element) => {
          element.addEventListener(event, handler);
          listeners.push({ element, event, handler });
        });
      }
    }
    if (listeners.length > 0) {
      boundListeners.set(this, listeners);
    }
  }

  disconnectedCallback() {
    const listeners = boundListeners.get(this);
    if (listeners) {
      for (const { element, event, handler } of listeners) {
        element.removeEventListener(event, handler);
      }
    }
    this.destroy?.();
  }

  attributeChangedCallback(
    name: string,
    prev: string | null,
    next: string | null,
  ) {
    attrCache.get(this)?.delete(name);
    const onChange = toObject<AttrCallbackMap<BaseElement>>(
      this.constructor[Symbol.metadata]?.[ATTR_CALLBACKS],
    )[name];
    if (onChange) {
      const { fromAttr } = toObject<Attr<BaseElement>>(
        this.constructor[Symbol.metadata]?.[ATTRS],
      )[name];
      const prevVal = fromAttr ? fromAttr(prev) : prev;
      const nextVal = fromAttr ? fromAttr(next) : next;
      onChange.call(this, prevVal, nextVal);
    }
  }

  $<T extends HTMLElement = HTMLElement>(id: string) {
    return (this.shadowRoot?.querySelector(id) as T) ?? null;
  }
}

export function property<
  T extends BaseElement,
  P,
>(options?: {
  fromAttr?: (s: string | null) => P;
  toAttr?: (v: P) => string | null;
}) {
  const { fromAttr, toAttr } = options ?? {};

  return function (
    _target: ClassAccessorDecoratorTarget<T, P>,
    context: ClassAccessorDecoratorContext<T, P>,
  ) {
    const name = toKebab(String(context.name));
    context.metadata[ATTRS] = {
      ...toObject<Attr<T>>(context.metadata[ATTRS]),
      [name]: {
        fromAttr,
        toAttr,
      },
    };

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
  return function <T extends CustomElementConstructor>(
    _target: T,
    context: ClassDecoratorContext<T>,
  ) {
    context.addInitializer(function (this: T) {
      customElements.define(name, this);
    });
  };
}

export function listen<K extends keyof HTMLElementEventMap>(
  event: K,
  selector?: string,
) {
  return function <T extends BaseElement>(
    method: (this: T, e: HTMLElementEventMap[K]) => void,
    context: ClassMethodDecoratorContext<T>,
  ) {
    context.metadata[LISTENERS] = [
      ...toArray(context.metadata[LISTENERS]),
      { selector, event, method },
    ];
  };
}

export function listenAttr<
  T extends BaseElement,
  const P extends keyof T,
>(
  property: P,
) {
  return function (
    method: (this: T, prev: T[P], next: T[P]) => void,
    context: ClassMethodDecoratorContext<T>,
  ) {
    context.metadata[ATTR_CALLBACKS] = {
      ...toObject<AttrCallbackMap<T>>(context.metadata[ATTR_CALLBACKS]),
      [toKebab(property.toString())]: method,
    };
  };
}
