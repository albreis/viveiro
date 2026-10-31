import { hashSeed } from "../modules/simulation/seed.ts";
export function seededRandom(seed: string) {
  let state = hashSeed(seed);
  const random = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), state | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return { random, range: (a: number, b: number) => a + random() * (b - a) };
}
