import { join, resolve } from "node:path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { describeBuhlLab } from "../src/modules/benchmarks/buhl-arena/run.ts";
import { normalizeBuhlLabPlan } from "../src/modules/benchmarks/buhl-arena/settings.ts";
import type { BuhlLocomotionPlan } from "../src/modules/benchmarks/buhl-arena/locomotion.ts";
import { buhlLabJson, runBuhlLabJobs } from "./lib/buhl-lab-jobs.ts";
import { immutableSweepFile } from "./lib/sweep-files.ts";

interface Factorial {
  schema: string;
  groups: number[];
  seeds: string[];
  pilotSeconds: number;
  longSeconds: number;
  settings: Record<string, unknown>;
  arms: (BuhlLocomotionPlan & { id: string })[];
}
const usage =
  "Uso: node scripts/run-buhl-locomotion.ts PASTA piloto|72h [--resume]";
const controller = new AbortController();
const stop = () => controller.abort();
try {
  const [folder, stage, ...flags] = process.argv.slice(2);
  if (
    !folder ||
    !["piloto", "72h"].includes(stage) ||
    flags.some((f) => f !== "--resume") ||
    flags.length > 1
  )
    throw Error(usage);
  const resume = flags.includes("--resume"),
    out = resolve(folder);
  if (existsSync(out) !== resume)
    throw Error("Pasta existente exige --resume.");
  if (!resume) mkdirSync(out, { recursive: true });
  const input = readFileSync(
    "docs/validacoes/buhl-locomocao-plano.json",
    "utf8",
  );
  const plan = JSON.parse(input) as Factorial;
  if (plan.schema !== "viveiro-buhl-locomotion-factorial-v1")
    throw Error("Plano desconhecido.");
  immutableSweepFile(join(out, "experimento.json"), input);
  const durationSeconds =
    stage === "piloto" ? plan.pilotSeconds : plan.longSeconds;
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
  for (const { id, ...locomotion } of plan.arms) {
    const destination = join(out, id);
    const complete = existsSync(join(destination, "series.json"));
    const plans = plan.seeds.flatMap((seed) =>
      plan.groups.map((workers) =>
        normalizeBuhlLabPlan({
          ...plan.settings,
          seed,
          workers,
          durationSeconds,
          locomotion,
        }),
      ),
    );
    // Resume validates saved plans and source even for a completed arm.
    const result = await runBuhlLabJobs(
      plans,
      {
        out: destination,
        resume: existsSync(destination),
        concurrency: 6,
      },
      controller.signal,
      (folder, sourceFingerprint, runs) => {
        immutableSweepFile(
          join(folder, "series.json"),
          buhlLabJson({
            schema: "viveiro-buhl-arena-series-v1",
            ...describeBuhlLab(plans[0]),
            sourceFingerprint,
            runs,
          }),
        );
      },
    );
    writeFileSync(
      join(out, "progresso.json"),
      buhlLabJson({ stage, arm: id, ...result }),
    );
    console.log(
      JSON.stringify({ arm: id, alreadyComplete: complete, ...result }),
    );
  }
  immutableSweepFile(
    join(out, "concluido.json"),
    buhlLabJson({
      schema: plan.schema,
      stage,
      durationSeconds,
      planSha256: createHash("sha256")
        .update(input.replaceAll("\r\n", "\n"))
        .digest("hex"),
      arms: plan.arms.map((a) => a.id),
      runs: plan.arms.length * plan.seeds.length * plan.groups.length,
    }),
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = controller.signal.aborted ? 130 : 1;
} finally {
  process.removeListener("SIGINT", stop);
  process.removeListener("SIGTERM", stop);
}
