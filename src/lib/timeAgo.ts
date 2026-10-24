export function timeAgo(isoDate: string) {
  const seconds = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);

  const steps: [number, string][] = [
    [60, "s"],
    [60, "m"],
    [24, "h"],
    [7, "d"],
    [4.345, "w"],
  ];

  let value = seconds;
  for (const [divisor, unit] of steps) {
    if (value < divisor) return `${Math.max(1, Math.floor(value))}${unit}`;
    value /= divisor;
  }

  return new Date(isoDate).toLocaleDateString();
}
