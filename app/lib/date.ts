const LOCALE = "ja-JP";

const toLocalDate = (dateStr: string): string => new Date(dateStr).toLocaleDateString(LOCALE);

const isSameDay = (dateA: string, dateB: string): boolean =>
  toLocalDate(dateA) === toLocalDate(dateB);

export { isSameDay, toLocalDate };
