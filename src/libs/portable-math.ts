import { installModelMath } from "./model-math.ts";
import exp from "@stdlib/math-base-special-exp";
import expm1 from "@stdlib/math-base-special-expm1";
import sin from "@stdlib/math-base-special-sin";
import cos from "@stdlib/math-base-special-cos";
import tan from "@stdlib/math-base-special-tan";
import tanh from "@stdlib/math-base-special-tanh";
import atan from "@stdlib/math-base-special-atan";
import atan2 from "@stdlib/math-base-special-atan2";
import ln from "@stdlib/math-base-special-ln";
import log1p from "@stdlib/math-base-special-log1p";
import cbrt from "@stdlib/math-base-special-cbrt";
import pow from "@stdlib/math-base-special-pow";
import hypot from "@stdlib/math-base-special-hypot";

/** stdlib hypot accepts exactly two arguments. Fold in a fixed order for 2D/3D. */
function hypotMany(...values: number[]) {
  if (values.some((v) => v === Infinity || v === -Infinity)) return Infinity;
  let result = 0;
  for (const value of values) result = hypot(result, value);
  return result;
}
export function installPortableMath() {
  installModelMath({
    exp,
    expm1,
    sin,
    cos,
    tan,
    tanh,
    atan,
    atan2,
    log: ln,
    log1p,
    cbrt,
    pow,
    hypot: hypotMany,
  });
}
