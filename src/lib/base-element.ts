import globalStyle from '@styles/shadow.css?inline';

const globalSheet = new CSSStyleSheet();
globalSheet.replaceSync(globalStyle);

const META_SYM: symbol =
  (Symbol as { metadata?: symbol }).metadata ?? Symbol.for('Symbol.metadata');

const ATTRS = 'observedAttrs' as const;
const ATTR_HANDLERS = 'attrHandlers' as const;
const LISTENERS = 'listeners' as const;

type AttrHandlers = Record<string, string | symbol>;

interface ListenerConfig {
  selector: string | null;
  event: string;
  methodName: string | symbol;
}

interface BoundEntry {
  el: Element | HTMLElement;
  event: string;
  handler: EventListener;
}

function getMeta(o: object): DecoratorMetadataObject {
  return (
    ((o as Record<symbol, unknown>)[META_SYM] as
      | DecoratorMetadataObject
      | undefined) ?? {}
  );
}

function readAttrs(meta: DecoratorMetadataObject): string[] {
  const v = meta[ATTRS];
  return Array.isArray(v) ? (v as string[]) : [];
}

function toKebab(s: string): string {
  return s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
}

function readAttrHandlers(meta: DecoratorMetadataObject): AttrHandlers {
  const v = meta[ATTR_HANDLERS];
  return v !== null && typeof v === 'object' && !Array.isArray(v)
    ? (v as AttrHandlers)
    : {};
}

function readListeners(meta: DecoratorMetadataObject): ListenerConfig[] {
  const v = meta[LISTENERS];
  return Array.isArray(v) ? (v as ListenerConfig[]) : [];
}

const classListeners = new WeakMap<object, ListenerConfig[]>();

const boundHandlers = new WeakMap<BaseElement, BoundEntry[]>();
const templateCache = new WeakMap<object, HTMLTemplateElement>();
const valueCache = new WeakMap<BaseElement, Map<string, unknown>>();

function getValueCache(instance: BaseElement): Map<string, unknown> {
  let m = valueCache.get(instance);
  if (!m) {
    m = new Map();
    valueCache.set(instance, m);
  }
  return m;
}

function getTemplate(ctor: object): HTMLTemplateElement | null {
  const html = (ctor as { template?: string }).template;
  if (!html) return null;
  let t = templateCache.get(ctor);
  if (!t) {
    t = document.createElement('template');
    t.innerHTML = html;
    templateCache.set(ctor, t);
  }
  return t;
}

export abstract class BaseElement extends HTMLElement {
  static get template(): string {
    return '';
  }

  static get observedAttributes(): string[] {
    return readAttrs(getMeta(this));
  }

  styles(): CSSStyleSheet[] {
    return [];
  }

  mounted(): void {}

  connectedCallback() {
    this.shadowRoot!.adoptedStyleSheets = [globalSheet, ...this.styles()];
    const tmpl = getTemplate(this.constructor);
    if (tmpl) this.shadowRoot!.appendChild(tmpl.content.cloneNode(true));
    this.mounted();

    const configs = classListeners.get(this.constructor) ?? [];
    if (configs.length > 0) {
      const bound: BoundEntry[] = [];
      for (const { selector, event, methodName } of configs) {
        const el =
          selector === null ? this : this.shadowRoot!.querySelector(selector);
        const method = (this as unknown as Record<string | symbol, unknown>)[
          methodName
        ];
        if (el && typeof method === 'function') {
          const handler = (method as (e: Event) => void).bind(this);
          el.addEventListener(event, handler);
          bound.push({ el, event, handler });
        }
      }
      boundHandlers.set(this, bound);
    }
  }

  destroy(): void {}

  disconnectedCallback(): void {
    const bound = boundHandlers.get(this);
    if (bound) {
      for (const { el, event, handler } of bound) {
        el.removeEventListener(event, handler);
      }
      boundHandlers.delete(this);
    }
    this.destroy();
  }

  attributeChangedCallback(
    name: string,
    _oldValue: string | null,
    _newValue: string | null,
  ): void {
    valueCache.get(this)?.delete(name);
    const onChange = readAttrHandlers(
      getMeta(this.constructor as unknown as object),
    )[name];
    if (onChange !== undefined) {
      (this as unknown as Record<string | symbol, () => void>)[onChange]();
    }
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  override get innerHTML(): string {
    return this.shadowRoot!.innerHTML;
  }

  override set innerHTML(value: string) {
    this.shadowRoot!.innerHTML = value;
  }

  $<T extends HTMLElement = HTMLElement>(id: string): T | null {
    return (this.shadowRoot!.getElementById(id) as T) || null;
  }
}

export function property<
  T extends BaseElement,
  V,
  const OnChange extends keyof T = never,
>(options?: {
  onChange?: OnChange;
  fromAttr?: (s: string | null) => V;
  toAttr?: (v: V) => string | null;
}) {
  const { fromAttr, toAttr } = options ?? {};

  return function (
    _target: ClassAccessorDecoratorTarget<T, V>,
    context: ClassAccessorDecoratorContext<T, V>,
  ): ClassAccessorDecoratorResult<T, V> {
    const k = toKebab(String(context.name));
    context.metadata[ATTRS] = [...readAttrs(context.metadata), k];
    if (options?.onChange !== undefined) {
      context.metadata[ATTR_HANDLERS] = {
        ...readAttrHandlers(context.metadata),
        [k]: options.onChange,
      };
    }

    return {
      get(this: T): V {
        if (fromAttr) {
          const cache = getValueCache(this);
          if (cache.has(k)) return cache.get(k) as V;
          const val = fromAttr(this.getAttribute(k));
          cache.set(k, val);
          return val;
        }
        return this.getAttribute(k) as V;
      },
      set(this: T, val: V) {
        if (toAttr) {
          const s = toAttr(val);
          if (s === null) this.removeAttribute(k);
          else this.setAttribute(k, s);
          return;
        }
        if (val === null || val === undefined) {
          this.removeAttribute(k);
        } else {
          this.setAttribute(k, String(val));
        }
      },
    };
  };
}

export function element(name: string) {
  return function <T extends typeof BaseElement>(
    target: T,
    context: ClassDecoratorContext<T>,
  ): void {
    classListeners.set(target, readListeners(context.metadata));
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
  ): void {
    context.metadata[LISTENERS] = [
      ...readListeners(context.metadata),
      { selector, event: event as string, methodName: context.name },
    ];
  };
}
