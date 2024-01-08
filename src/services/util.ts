import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

dayjs.locale('en');

export function getRelativeTime(date?: Date | number) {
  if (typeof date === 'number')
    date = new Date(date);
  const dateToDisplay = dayjs(date || new Date());
  return dateToDisplay.fromNow();
}