import { readFileSync, statSync } from "node:fs";
import { assessBuhlPhysicalSeries } from "./lib/buhl-physical-check.ts";

try {
  const [file, ...extra] = process.argv.slice(2);
  if (!file || extra.length)
    throw Error("Uso: node scripts/assess-buhl-arena.ts SERIE.json");
  const info = statSync(file);
  if (!info.isFile() || info.size > 8 * 1024 * 1024)
    throw Error("Forneça uma série JSON de até 8 MiB.");
  const input = JSON.parse(readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
  process.stdout.write(
    JSON.stringify(assessBuhlPhysicalSeries(input), null, 2) + "\n",
  );
} catch (error) {
  process.stderr.write(
    (error instanceof Error ? error.message : String(error)) + "\n",
  );
  process.exitCode = 1;
}
