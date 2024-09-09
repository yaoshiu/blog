import { createSignal, onMount } from 'solid-js';

const THRESHOLD = 500;
const DURATION = 300;

export const ScrollTop = (props: { threshold?: number }) => {
  const [show, setShow] = createSignal(false);
  const [enter, setEnter] = createSignal(false);

  let timeout: NodeJS.Timeout;

  onMount(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > (props.threshold ?? THRESHOLD)) {
        if (show()) return;

        setShow(true);
        clearTimeout(timeout);
        timeout = setTimeout(() => setEnter(true), 0);
      } else {
        if (!enter()) return;

        setEnter(false);
        clearTimeout(timeout);
        timeout = setTimeout(() => setShow(false), DURATION);
      }
    });
  });

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      class="bg-transparent
      rounded-full
      hover:bg-gray-300
      items-center justify-center
      size-10
      transition-opacity"
      hover-bg="neutral-300 dark:neutral-600 op-50 dark:op-50"
      text="text-1 dark:dark-text-1"
      style={{
        opacity: enter() ? 1 : 0,
        'transition-duration': `${DURATION}ms`,
        display: show() ? 'flex' : 'none',
      }}
      onClick={handleClick}
    >
      <svg class="i-fa6-solid:angle-up" />
    </button>
  );
};

export default ScrollTop;