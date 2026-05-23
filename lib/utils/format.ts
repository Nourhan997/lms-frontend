import type { Locale } from "@/lib/types";

/**
 * Format a course price. Returns null when free so the caller can render a
 * localized "Free" label instead.
 */
export function formatPrice(
  amount: number,
  locale: Locale,
  currency = "USD",
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
