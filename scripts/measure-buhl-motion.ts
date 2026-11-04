import { measureBuhlFreeMotion } from "./lib/buhl-free-motion.ts";
import { modelSourceFingerprint } from "./lib/source-fingerprint.ts";

try {
  const args = process.argv.slice(2);
  const usage = "Uso: node scripts/measure-buhl-motion.ts [--mm-por-unidade N]";
  if (args.length === 1 && args[0] === "--help") {
    process.stdout.write(usage + "\n");
  } else {
    if (
      args.length !== 0 &&
      (args.length !== 2 ||
        args[0] !== "--mm-por-unidade" ||
        !/^\d+(?:\.\d+)?$/.test(args[1]))
    )
      throw Error(usage);
    const report = measureBuhlFreeMotion(
      args.length ? Number(args[1]) : undefined,
    );
    process.stdout.write(
      JSON.stringify(
        { ...report, sourceFingerprint: modelSourceFingerprint(process.cwd()) },
        null,
        2,
      ) + "\n",
    );
  }
} catch (error) {
  process.stderr.write(
    (error instanceof Error ? error.message : String(error)) + "\n",
  );
  process.exitCode = 1;
}
