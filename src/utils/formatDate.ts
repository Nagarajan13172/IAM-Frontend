import { format, isValid } from "date-fns";

/**
 * Safely format a date value. Returns "—" for null / undefined / invalid dates.
 */
export function formatDate(
  value: string | Date | null | undefined,
  pattern: string
): string {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  return isValid(d) ? format(d, pattern) : "—";
}
