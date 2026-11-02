import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { parse } from "@babel/parser";
const functions = new Set([
  "exp",
  "expm1",
  "sin",
  "cos",
  "tan",
  "tanh",
  "atan",
  "atan2",
  "log",
  "log1p",
  "cbrt",
  "pow",
  "hypot",
]);
function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? files(dir + "/" + d.name) : [dir + "/" + d.name],
  );
}
function visit(n, f, found) {
  if (!n || typeof n !== "object") return;
  if (
    n.type === "MemberExpression" &&
    n.object?.name === "Math" &&
    functions.has(n.property?.name)
  )
    found.push(f + ":" + n.loc.start.line + " native Math." + n.property.name);
  if (n.type === "BinaryExpression" && n.operator === "**")
    found.push(f + ":" + n.loc.start.line + " native exponent");
  for (const [k, v] of Object.entries(n)) {
    if (
      [
        "loc",
        "tokens",
        "comments",
        "leadingComments",
        "trailingComments",
      ].includes(k)
    )
      continue;
    if (Array.isArray(v)) for (const c of v) visit(c, f, found);
    else if (v && typeof v.type === "string") visit(v, f, found);
  }
}
test("núcleo usa serviço numérico explícito; referência ODD e renderer conservam sua independência", () => {
  const probe = [];
  visit(
    parse("Math.exp(x) + x ** 2", { sourceType: "module" }),
    "probe",
    probe,
  );
  assert.equal(probe.length, 2);
  const found = [];
  for (const f of [...files("src/modules"), ...files("src/libs")]) {
    if (
      !/\.(ts|js)$/.test(f) ||
      f.includes("/renderer/") ||
      f.includes("/model-documentation/") ||
      f === "src/libs/model-math.ts"
    )
      continue;
    visit(
      parse(readFileSync(f, "utf8"), {
        sourceType: "module",
        plugins: ["typescript", "importAttributes"],
      }),
      f,
      found,
    );
  }
  assert.deepEqual(found, []);
});
