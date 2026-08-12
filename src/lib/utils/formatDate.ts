/** "2026-09-01T00:00:00.000Z" -> "Sep 1" (viewer's local date). Returns an
 *  empty string for an unparseable input so callers can drop their
 *  "Resets ..." clause instead of printing garbage. */
export function formatMonthDay(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
