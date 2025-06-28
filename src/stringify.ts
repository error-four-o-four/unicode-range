const rangeString = (start: number, end?: number) => {
  if (!end || start === end) {
    return `U+${start.toString(16)}`;
  }
  return `U+${start.toString(16)}-${end.toString(16)}`;
};

export const stringify = (arr: number[]): string[] => {
  const sorted = Array.from(new Set(arr)).sort((a, b) => a - b);
  const results: string[] = [];

  let rangeStart;
  for (let idx = 0; idx < sorted.length; idx++) {
    const current = sorted[idx];
    const prev = sorted[idx - 1];

    if (rangeStart && current - prev !== 1) {
      results.push(rangeString(rangeStart, prev));
      rangeStart = current;
    }

    // First
    if (!rangeStart) rangeStart = current;

    // Last
    if (idx === sorted.length - 1) {
      if (rangeStart === current) {
        results.push(rangeString(current));
      } else {
        results.push(rangeString(rangeStart, current));
      }
    }
  }

  return results;
};
