import {
  type ParentComponent,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";

const [dark, setDark] = createSignal(false);

export { dark };

export function toggleDark() {
  setDark((prev) => !prev);
}

/**
 * Theme provider component
 *
 * @param props The component props
 *
 * @returns The component children wrapped in a theme context
 *
 * @example
 * ```tsx
 * import { ThemeProvider } from "./components/Theme";
 *
 * const App = () => {
 *   return (
 *     <ThemeProvider>
 *       <div>Hello World</div>
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */
export const ThemeProvider: ParentComponent = (props) => {
  let darkThemeMq: MediaQueryList;

  function onMqChange({ matches }: { matches: boolean }) {
    setDark(matches);
  }

  onMount(() => {
    darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
    onMqChange(darkThemeMq);
    darkThemeMq.addEventListener("change", onMqChange);
  });

  onCleanup(() => {
    darkThemeMq?.removeEventListener("change", onMqChange);
  });

  return (
    <div classList={{ dark: dark() }}>
      <div bg="bg dark:dark-bg" text="text-pri dark:dark-text-pri">
        {props.children}
      </div>
    </div>
  );
};
