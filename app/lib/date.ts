const LOCALE = "ja-JP";
const TIMEZONE = "Asia/Tokyo";

const toLocalDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString(LOCALE, { timeZone: TIMEZONE });

const isSameDay = (dateA: string, dateB: string): boolean =>
  toLocalDate(dateA) === toLocalDate(dateB);

export { isSameDay, toLocalDate };
