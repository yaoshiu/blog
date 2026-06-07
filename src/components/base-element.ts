import globalStyle from '@styles/shadow.css?inline';

const globalSheet = new CSSStyleSheet();
globalSheet.replaceSync(globalStyle);

const META_SYM: symbol =
  (Symbol as { metadata?: symbol }).metadata ?? Symbol.for('Symbol.metadata');

const ATTRS = 'observedAttrs' as const;
const ATTR_HANDLERS = 'attrHandlers' as const;

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

const instanceListeners = new WeakMap<BaseElement, ListenerConfig[]>();
const boundHandlers = new WeakMap<BaseElement, BoundEntry[]>();

export abstract class BaseElement extends HTMLElement {
  abstract render(): string;

  static get observedAttributes(): string[] {
    return readAttrs(getMeta(this));
  }

  styles(): CSSStyleSheet[] {
    return [];
  }

  mounted(): void {}

  connectedCallback() {
    this.shadowRoot!.adoptedStyleSheets = [globalSheet, ...this.styles()];
    if (!this.shadowRoot!.innerHTML) {
      this.shadowRoot!.innerHTML = this.render();
    }

    const configs = instanceListeners.get(this) ?? [];
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

    this.mounted();
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

  $<T extends HTMLElement = HTMLElement>(id: string): T | null {
    return (this.shadowRoot!.getElementById(id) as T) || null;
  }
}

type PropValue<
  Type extends BooleanConstructor | StringConstructor | undefined,
> = Type extends BooleanConstructor ? boolean : string | null;

export function property<
  T extends BaseElement,
  const OnChange extends keyof T,
  const Type extends BooleanConstructor | StringConstructor | undefined =
    undefined,
>(options?: { onChange?: OnChange; type?: Type }) {
  const isBoolean = options?.type === Boolean;

  return function (
    _target: ClassAccessorDecoratorTarget<T, PropValue<Type>>,
    context: ClassAccessorDecoratorContext<T, PropValue<Type>>,
  ): ClassAccessorDecoratorResult<T, PropValue<Type>> {
    const k = toKebab(String(context.name));
    context.metadata[ATTRS] = [...readAttrs(context.metadata), k];
    if (options?.onChange !== undefined) {
      context.metadata[ATTR_HANDLERS] = {
        ...readAttrHandlers(context.metadata),
        [k]: options.onChange,
      };
    }

    return {
      get(this: T): PropValue<Type> {
        return (
          isBoolean ? this.hasAttribute(k) : this.getAttribute(k)
        ) as PropValue<Type>;
      },
      set(this: T, val: PropValue<Type>) {
        if (isBoolean) {
          this.toggleAttribute(k, Boolean(val));
        } else if (val === null || val === false) {
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
    _context: ClassDecoratorContext<T>,
  ): void {
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
    const config: ListenerConfig = {
      selector,
      event: event as string,
      methodName: context.name,
    };
    context.addInitializer(function (this: T) {
      const existing = instanceListeners.get(this) ?? [];
      instanceListeners.set(this, [...existing, config]);
    });
  };
}
