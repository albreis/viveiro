import { join } from "node:path";
import { buhlLabJson, runBuhlLabJobs } from "./lib/buhl-lab-jobs.ts";
import { buhlMorrisAnalysis, buhlMorrisDesign } from "./lib/buhl-lab-morris.ts";
import { readBuhlLabOptions } from "./lib/buhl-lab-options.ts";
import { immutableSweepFile } from "./lib/sweep-files.ts";

const controller = new AbortController();
const stop = () => controller.abort();
try {
  const command = readBuhlLabOptions("scripts/sensitivity-buhl-arena.ts");
  if (command) {
    const design = buhlMorrisDesign(command.input);
    process.on("SIGINT", stop);
    process.on("SIGTERM", stop);
    const result = await runBuhlLabJobs(
      design.plans,
      command.options,
      controller.signal,
      (folder, sourceFingerprint, runs) => {
        immutableSweepFile(
          join(folder, "morris.json"),
          buhlLabJson({
            schema: "viveiro-buhl-morris-resultados-v1",
            sourceFingerprint,
            design,
            calibrated: false,
            rankings: buhlMorrisAnalysis(design, runs),
          }),
        );
      },
    );
    process.stdout.write(buhlLabJson(result));
  }
} catch (error) {
  process.stderr.write(
    (error instanceof Error ? error.message : String(error)) + "\n",
  );
  process.exitCode = controller.signal.aborted ? 130 : 1;
} finally {
  process.removeListener("SIGINT", stop);
  process.removeListener("SIGTERM", stop);
}
