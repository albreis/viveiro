/** Model arithmetic is a module-local backend, never a patch of global Math.
 * The visible terrarium/legacy saves use native functions. Portable experiments
 * install their backend once, in a dedicated browser/Node worker realm.
 */
export type ArithmeticPolicy = "ecmascript-native-f64-v1" | "stdlib-f64-v1";
export type ModelMathBackend = Pick<
  Math,
  | "exp"
  | "expm1"
  | "sin"
  | "cos"
  | "tan"
  | "tanh"
  | "atan"
  | "atan2"
  | "log"
  | "log1p"
  | "cbrt"
  | "pow"
  | "hypot"
>;
const native: ModelMathBackend = {
  exp: Math.exp,
  expm1: Math.expm1,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  tanh: Math.tanh,
  atan: Math.atan,
  atan2: Math.atan2,
  log: Math.log,
  log1p: Math.log1p,
  cbrt: Math.cbrt,
  pow: Math.pow,
  hypot: Math.hypot,
};
let backend: ModelMathBackend = native;
let policy: ArithmeticPolicy = "ecmascript-native-f64-v1";
export const arithmeticPolicy = () => policy;
export const modelMath: ModelMathBackend = Object.freeze({
  exp: (x: number) => backend.exp(x),
  expm1: (x: number) => backend.expm1(x),
  sin: (x: number) => backend.sin(x),
  cos: (x: number) => backend.cos(x),
  tan: (x: number) => backend.tan(x),
  tanh: (x: number) => backend.tanh(x),
  atan: (x: number) => backend.atan(x),
  log: (x: number) => backend.log(x),
  log1p: (x: number) => backend.log1p(x),
  cbrt: (x: number) => backend.cbrt(x),
  atan2: (y: number, x: number) => backend.atan2(y, x),
  pow: (x: number, y: number) => backend.pow(x, y),
  hypot: (...values: number[]) => backend.hypot(...values),
});
/** Internal bootstrap. Do not switch a realm that already owns a live World. */
export function installModelMath(next: ModelMathBackend) {
  if (policy === "stdlib-f64-v1") return;
  if (
    Object.keys(native).some(
      (k) => typeof next[k as keyof ModelMathBackend] !== "function",
    )
  )
    throw Error("Backend numérico incompleto.");
  backend = Object.freeze({ ...next });
  policy = "stdlib-f64-v1";
}
