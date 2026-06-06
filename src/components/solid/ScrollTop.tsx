import { createSignal, onCleanup, onMount, Show } from 'solid-js';

const THRESHOLD = 500;
const DURATION = 300;

const AngleUpIcon = () => (
  <svg viewBox="0 0 512 512" width="1em" height="1em" aria-hidden="true">
    <path fill="currentColor" d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3L86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z"/>
  </svg>
);

export const ScrollTop = (props: { threshold?: number }) => {
  const [show, setShow] = createSignal(false);
  const [enter, setEnter] = createSignal(false);

  let timeout: NodeJS.Timeout;

  function handleScroll() {
    if (window.scrollY > (props.threshold ?? THRESHOLD)) {
      if (show()) return;
      setShow(true);
      clearTimeout(timeout);
      requestAnimationFrame(() => setEnter(true));
    } else {
      if (!enter()) return;
      setEnter(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShow(false), DURATION);
    }
  }

  onMount(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    onCleanup(() => {
      clearTimeout(timeout);
      window.removeEventListener('scroll', handleScroll);
    });
  });

  return (
    <Show when={show()}>
      <button
        type="button"
        class="bg-transparent rounded-full flex items-center justify-center size-10
        transition-opacity text-text-1
        hover:bg-neutral-300/50 dark:hover:bg-neutral-600/50"
        style={{
          opacity: enter() ? 1 : 0,
          'transition-duration': `${DURATION}ms`,
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        <AngleUpIcon />
      </button>
    </Show>
  );
};

export default ScrollTop;
