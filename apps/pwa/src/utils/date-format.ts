import { Timestamp } from "firebase/firestore";

export default function formatDate(
  date: number | string | Date | Timestamp,
  options?: { locale?: string } & Intl.DateTimeFormatOptions
) {
  const { locale = "en-US", ...restOptions } = options || {};
  const dateToFormat =
    date instanceof Timestamp ? date.toDate() : new Date(date);

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...restOptions,
  }).format(dateToFormat);
}

export function formatTimestamp(date: string | Timestamp) {
  return date instanceof Timestamp ? date.toDate() : undefined;
}
