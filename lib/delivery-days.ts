function parseRange(range: string) {
  const [startStr, endStr] = range.split("_");
  const start = new Date(startStr);
  const end = new Date(endStr);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return { start, end };
}

function formatISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isSunday(d: Date) {
  return d.getDay() === 0;
}

function isPast(d: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

export function listSelectableDays(range: string): string[] {
  if (!range) return [];
  const { start, end } = parseRange(range);
  const days: string[] = [];
  for (let t = new Date(start); t <= end; t.setDate(t.getDate() + 1)) {
    const cur = new Date(t);
    if (!isSunday(cur) && !isPast(cur)) days.push(formatISODate(cur));
  }
  return days;
}

/**
 * Returns the week index (0-3) for a given range string.
 * 0 = current week, 1 = next week, 2 = week after next, 3 = three weeks out.
 */
export function getWeekIndexFromRange(range: string): number {
  if (!range) return 0;
  const { start } = parseRange(range);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Get current week's Monday
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const currentMonday = new Date(now);
  currentMonday.setDate(now.getDate() + diffToMonday);

  const diffMs = start.getTime() - currentMonday.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);

  return Math.max(0, Math.min(3, diffWeeks));
}

/**
 * Returns the rotation week number (1-4) for a given range string.
 */
export function getWeekNumberFromRange(range: string): 1 | 2 | 3 | 4 {
  const index = getWeekIndexFromRange(range);
  return ((index % 4) + 1) as 1 | 2 | 3 | 4;
}
