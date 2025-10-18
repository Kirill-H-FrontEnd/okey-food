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
