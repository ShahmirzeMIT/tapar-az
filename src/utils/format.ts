/** Formats a number as AZN with a space thousands separator, e.g. 34 500 AZN */
export function formatPrice(value: number): string {
  const formatted = Math.round(value).toLocaleString('az-AZ').replace(/,/g, ' ');
  return `${formatted} AZN`;
}

const RTF = new Intl.RelativeTimeFormat('az', { numeric: 'auto' });

/** Relative date like "3 gün əvvəl" for listing cards. */
export function formatRelativeDate(epochMs: number): string {
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
