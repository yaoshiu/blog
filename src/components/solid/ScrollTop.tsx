import { createSignal, onCleanup, onMount, Show } from 'solid-js';

const THRESHOLD = 500;
const DURATION = 300;

export const ScrollTop = (props: { threshold?: number }) => {
  const [show, setShow] = createSignal(false);
  const [enter, setEnter] = createSignal(false);

  let timeout: NodeJS.Timeout;

  function handleScroll() {
    if (window.scrollY > (props.threshold ?? THRESHOLD)) {
      if (show()) return;

      setShow(true);
      clearTimeout(timeout);
      requestAnimationFrame(() => {
        setEnter(true);
      });
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

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Show when={show()}>
      <button
        type="button"
        class="bg-transparent
        rounded-full
        flex items-center justify-center
        size-10
        transition-opacity"
        hover-bg="neutral-300 dark:neutral-600 op-50 dark:op-50"
        text="text-1 dark:dark-text-1"
        style={{
          opacity: enter() ? 1 : 0,
          'transition-duration': `${DURATION}ms`,
        }}
        onClick={handleClick}
        aria-label="Scroll to top"
      >
        <svg class="i-fa6-solid:angle-up" />
      </button>
    </Show>
  );
};

export default ScrollTop;
