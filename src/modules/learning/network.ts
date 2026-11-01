import type { TinyBrain } from "./types.ts";
import { hashSeed } from "../simulation/seed.ts";
export function learningRng(seed: string) {
  let n = hashSeed(seed);
  return () => {
    n = (Math.imul(n, 1664525) + 1013904223) >>> 0;
    return n / 2 ** 32;
  };
}
export function createBrain(seed: string): TinyBrain {
  const random = learningRng(seed + ":brain");
  return {
    version: 1,
    inputs: 6,
    hidden: 8,
    input: Array.from({ length: 48 }, () => (random() - 0.5) * 0.4),
    bias: Array(8).fill(0),
    output: Array.from({ length: 8 }, () => (random() - 0.5) * 0.2),
    offset: 0,
  };
}
export function forward(brain: TinyBrain, x: readonly number[]) {
  const hidden = brain.bias.map((b, i) =>
    Math.tanh(x.reduce((sum, v, j) => sum + brain.input[i * 6 + j] * v, b)),
  );
  return {
    hidden,
    value: hidden.reduce(
      (sum, h, i) => sum + h * brain.output[i],
      brain.offset,
    ),
  };
}
export function trainValue(
  brain: TinyBrain,
  x: readonly number[],
  target: number,
  rate = 0.01,
) {
  const { hidden, value } = forward(brain, x),
    error = Math.max(-1, Math.min(1, target - value)),
    bound = (v: number) => Math.max(-5, Math.min(5, v));
  for (let i = 0; i < 8; i++) {
    const gradient = error * brain.output[i] * (1 - hidden[i] ** 2);
    for (let j = 0; j < 6; j++)
      brain.input[i * 6 + j] = bound(
        brain.input[i * 6 + j] + rate * gradient * x[j],
      );
    brain.bias[i] = bound(brain.bias[i] + rate * gradient);
    brain.output[i] = bound(brain.output[i] + rate * error * hidden[i]);
  }
  brain.offset = bound(brain.offset + rate * error);
  return error;
}
export function validBrain(value: unknown): value is TinyBrain {
  if (!value || typeof value !== "object") return false;
  const b = value as TinyBrain;
  return (
    b.version === 1 &&
    b.inputs === 6 &&
    b.hidden === 8 &&
    [b.input, b.bias, b.output].every(
      (a, i) =>
        Array.isArray(a) &&
        a.length === [48, 8, 8][i] &&
        a.every((n) => Number.isFinite(n) && Math.abs(n) <= 5),
    ) &&
    Number.isFinite(b.offset) &&
    Math.abs(b.offset) <= 5
  );
}
