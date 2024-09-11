import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { mergeProps } from 'solid-js';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function DayJS(porps: {
  date: string | number | Date;
  format?: string;
  guess?: boolean;
}) {
  const merged = mergeProps(
    { format: 'YYYY-MM-DD HH:mm:ss', guess: true },
    porps,
  );

  let date = dayjs(merged.date);
  if (merged.guess) {
    date = date.tz(dayjs.tz.guess());
  }

  return <>{date.format(merged.format)}</>;
}
