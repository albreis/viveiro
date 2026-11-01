export function weightedSample(
  weights: readonly number[],
  random: () => number,
): number {
  if (!weights.length)
    throw new RangeError("A amostragem precisa de pelo menos uma opção.");
  const values = weights.map((v) => (Number.isFinite(v) ? Math.max(0, v) : 0));
  const total = values.reduce((a, b) => a + b, 0);
  if (total <= 0)
    return Math.min(weights.length - 1, Math.floor(random() * weights.length));
  let choice = Math.max(0, Math.min(1 - Number.EPSILON, random())) * total;
  for (let i = 0; i < values.length; i++) {
    choice -= values[i];
    if (choice < 0) return i;
  }
  return values.length - 1;
}
