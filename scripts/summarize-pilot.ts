import { readFileSync, statSync } from "node:fs";
import { summarizePilot } from "./lib/pilot-summary.ts";

try {
  const [file, ...extra] = process.argv.slice(2);
  if (!file || extra.length)
    throw Error("Uso: node scripts/summarize-pilot.ts RESPOSTAS.csv");
  let csv: string;
  try {
    const info = statSync(file);
    if (!info.isFile() || info.size > 1024 * 1024) throw Error();
    csv = readFileSync(file, "utf8");
  } catch {
    throw Error("Forneça um arquivo CSV local de até 1 MiB.");
  }
  process.stdout.write(JSON.stringify(summarizePilot(csv), null, 2) + "\n");
} catch (error) {
  process.stderr.write(
    (error instanceof Error ? error.message : String(error)) + "\n",
  );
  process.exitCode = 1;
}
