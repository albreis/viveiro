import { compareBuhlReference } from "./lib/buhl-reference.ts";

try {
  const [folder, ...extra] = process.argv.slice(2);
  if (!folder || extra.length)
    throw Error("Uso: node scripts/compare-buhl-reference.ts PASTA");
  const report = compareBuhlReference(folder);
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  if (report.results.some((group) => group.status === "different"))
    process.exitCode = 2;
} catch (error) {
  process.stderr.write(
    (error instanceof Error ? error.message : String(error)) + "\n",
  );
  process.exitCode = 1;
}
