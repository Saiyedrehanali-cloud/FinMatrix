/**
 * Native Date Utilities
 * High performance, zero-dependency date utilities avoiding Webpack barrel-optimization runtime bugs.
 */

export function differenceInCalendarDays(dateLeft: Date | string, dateRight: Date | string): number {
  const d1 = new Date(dateLeft);
  const d2 = new Date(dateRight);
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return Math.round((utc1 - utc2) / 86400000);
}

export function differenceInDays(dateLeft: Date | string, dateRight: Date | string): number {
  return differenceInCalendarDays(dateLeft, dateRight);
}

export function addDays(date: Date | string, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function isBefore(dateLeft: Date | string, dateRight: Date | string): boolean {
  return new Date(dateLeft).getTime() < new Date(dateRight).getTime();
}

export function addMonths(date: Date | string, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export function startOfMonth(date: Date | string): Date {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

export function endOfMonth(date: Date | string): Date {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function format(date: Date | string, formatStr: string): string {
  const d = new Date(date);
  const month = MONTH_NAMES[d.getMonth()];
  const yy = String(d.getFullYear()).slice(-2);
  const yyyy = d.getFullYear();

  if (formatStr === "MMM yy") {
    return `${month} '${yy}`;
  }
  if (formatStr === "MMM yyyy" || formatStr === "MMM yyy") {
    return `${month} ${yyyy}`;
  }
  if (formatStr === "yyyy-MM-dd") {
    return d.toISOString().split("T")[0];
  }
  return `${month} ${yyyy}`;
}
