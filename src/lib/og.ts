const TITLE_FONT_SIZE = 54;
const TITLE_MAX_WIDTH = 520;
const TITLE_MAX_LINES = 4;

function textWidth(value: string) {
  return [...value].reduce((width, char) => {
    if (char === ' ') {
      return width + TITLE_FONT_SIZE * 0.32;
    }

    if (/[A-Z]/.test(char)) {
      return width + TITLE_FONT_SIZE * 0.68;
    }

    if (/[il.,']/i.test(char)) {
      return width + TITLE_FONT_SIZE * 0.3;
    }

    if (/[-]/.test(char)) {
      return width + TITLE_FONT_SIZE * 0.36;
    }

    return width + TITLE_FONT_SIZE * 0.56;
  }, 0);
}

export function ogTitleLines(title: string) {
  const words = title.split(/\s+/);
  const candidates: string[][] = [];

  function collect(lines: string[], remaining: string[]) {
    if (remaining.length === 0) {
      candidates.push(lines);
      return;
    }

    if (lines.length >= TITLE_MAX_LINES) {
      return;
    }

    for (let i = 1; i <= remaining.length; i += 1) {
      collect([...lines, remaining.slice(0, i).join(' ')], remaining.slice(i));
    }
  }

  collect([], words);

  return (
    candidates
      .filter((lines) =>
        lines.every((line) => textWidth(line) <= TITLE_MAX_WIDTH),
      )
      .sort((a, b) => {
        if (a.length !== b.length) {
          return a.length - b.length;
        }

        const score = (lines: string[]) => {
          const widths = lines.map(textWidth);
          return Math.max(...widths) - Math.min(...widths);
        };

        return score(a) - score(b);
      })[0] ??
    candidates.at(-1) ?? [title]
  );
}
