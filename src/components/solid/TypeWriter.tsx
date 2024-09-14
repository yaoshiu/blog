import { createSignal, mergeProps, onMount } from 'solid-js';

const TIMEOUT = 150;
const DECTIMEOUT = 50;

/**
 * TypeWriter component that types out the given text
 * @param props.text The text to type out
 * @param props.timeout The timeout between each character
 * @returns The TypeWriter component
 */
export const TypeWriter = (props: {
  text: string | string[];
  timeout?: number;
  infinite?: boolean;
  dectimeout?: number;
}) => {
  const merged = mergeProps(
    { timeout: TIMEOUT, dectimeout: DECTIMEOUT, infinite: false },
    props,
  );

  const [displayText, setDisplayText] = createSignal('');

  let index = -1;
  const text = Array.isArray(merged.text) ? merged.text : [merged.text];
  let currentText: string;
  let currentTextIndex = 0;

  onMount(() => {
    function erase() {
      if (currentTextIndex > 0) {
        setDisplayText(currentText.slice(0, currentTextIndex));
        currentTextIndex--;
        setTimeout(erase, merged.dectimeout);
      } else {
        if (index < text.length - 1) {
          index = index + 1;
        }
        currentText = text[index].replaceAll(' ', '\u00a0');
        setTimeout(type, merged.dectimeout);
      }
    }

    function type() {
      if (currentTextIndex <= currentText.length) {
        setDisplayText(currentText.slice(0, currentTextIndex));
        currentTextIndex++;
        setTimeout(type, merged.timeout);
      } else if (index < text.length - 1 || merged.infinite) {
        setTimeout(erase, merged.timeout);
      }
    }

    erase();
  });

  return (
    <span>
      {displayText()}
      <span class="animate-blink" border="l text-0 dark:dark-text-0" />
    </span>
  );
};

export default TypeWriter;
