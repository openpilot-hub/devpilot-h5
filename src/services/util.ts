import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('en');

export function getRelativeTime(date: Date | number, locale: 'cn' | 'en') {
  if (typeof date === 'number')
    date = new Date(date);
  dayjs.locale(locale === 'cn' ? 'zh-cn': 'en');
  const dateToDisplay = dayjs(date || new Date());
  return dateToDisplay.fromNow();
}