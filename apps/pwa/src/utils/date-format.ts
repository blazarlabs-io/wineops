import { DEFAULT_LOCALE } from "@/data/constants";
import { Timestamp } from "firebase/firestore";

export default function formatDate(
  date: number | string | Date | Timestamp,
  options?: { locale?: string } & Intl.DateTimeFormatOptions,
) {
  if (!date) return "";

  const { locale, ...restOptions } = options || {};
  const dateToFormat = parseToDate(date);

  if (!dateToFormat || isNaN(dateToFormat.getTime())) return "";

  return new Intl.DateTimeFormat(locale || DEFAULT_LOCALE || "en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...restOptions,
  }).format(dateToFormat);
}

export function parseToDate(
  date: number | string | Date | Timestamp | undefined,
): Date | null {
  if (!date) return null;

  return date instanceof Timestamp ? date.toDate() : new Date(date);
}
