import type { Locale } from "@/lib/types";

/** Default platform currency (ISO 4217). */
export const DEFAULT_CURRENCY = "OMR";

/**
 * Format a course price. Returns null when free so the caller can render a
 * localized "Free" label instead.
 */
export function formatPrice(
  amount: number,
  locale: Locale,
  currency = DEFAULT_CURRENCY,
): string | null {
  if (amount <= 0) return null;
  return new Intl.NumberFormat(locale === "ar" ? "ar" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Sum lesson durations (in minutes). */
export function totalDurationMinutes(
  lessons: { duration_minutes: number }[],
): number {
  return lessons.reduce((sum, lesson) => sum + lesson.duration_minutes, 0);
}

function intlLocale(locale: Locale): string {
  return locale === "ar" ? "ar" : "en";
}

/** Absolute date, e.g. "23 May 2026". */
export function formatDate(dateIso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateIso));
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
  ["second", 1],
];

/** Locale-aware relative time, e.g. "3 days ago" / "منذ ٣ أيام". */
export function timeAgo(dateIso: string, locale: Locale): string {
  const seconds = (new Date(dateIso).getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(intlLocale(locale), {
    numeric: "auto",
  });
  for (const [unit, secondsInUnit] of RELATIVE_UNITS) {
    if (Math.abs(seconds) >= secondsInUnit || unit === "second") {
      return rtf.format(Math.round(seconds / secondsInUnit), unit);
    }
  }
  return rtf.format(0, "second");
}
