/** Formats a number as AZN with a space thousands separator, e.g. 34 500 AZN */
export function formatPrice(value: number): string {
  const formatted = Math.round(value).toLocaleString('az-AZ').replace(/,/g, ' ');
  return `${formatted} AZN`;
}

const RTF = new Intl.RelativeTimeFormat('az', { numeric: 'auto' });

/** Relative date like "3 gün əvvəl" for listing cards. */
function toEpochMs(value: unknown): number {
  if (typeof value === 'number') return value;
  if (value instanceof Date) return value.getTime();
  if (value && typeof (value as { toMillis?: () => number }).toMillis === 'function') {
    return (value as { toMillis: () => number }).toMillis();
  }
  return 0;
}

export function formatRelativeDate(value: unknown): string {
  const epochMs = toEpochMs(value);
  if (!epochMs) return 'Tarix qeyd edilməyib';
  const diffSec = Math.round((epochMs - Date.now()) / 1000);
  const divisions: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, 'seconds'], [60, 'minutes'], [24, 'hours'], [7, 'days'], [4.34524, 'weeks'], [12, 'months'], [Infinity, 'years'],
  ];
  let duration = diffSec;
  for (const [amount, unit] of divisions) {
    if (Math.abs(duration) < amount) return RTF.format(Math.round(duration), unit);
    duration /= amount;
  }
  return '';
}

export function formatDateTime(value: unknown): string {
  const epochMs = toEpochMs(value);
  if (!epochMs) return 'Tarix qeyd edilməyib';
  return new Intl.DateTimeFormat('az-AZ', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(epochMs));
}
