import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  statSync,
} from "node:fs";
import { resolve, dirname } from "node:path";
import { experimentArgs } from "./lib/experiment-args.ts";
import { normalizeExperiment } from "../src/modules/experiments/plan.ts";
import { runExperimentProcess } from "./lib/experiment-process.ts";
const usage = `Viveiro · experimento sem interface (Node24)
Uso: npm run experiment -- --seed SEMENTE-42 --days 3 --out ./resultado-novo
Ou: npm run experiment -- --plan configuracao.json --out ./resultado-novo
Parâmetros: --humidity 0..100 --light 0..100 --randomness 0..100
--repose-angle 15..55 --temperature 5..45 --wind-x -4..4 --wind-z -4..4
--profile generic-demo@5 --start founding|established --days 0..365 (inteiros)
Saída: dados.csv e manifesto.json, sem sobrescrever pastas existentes.
Modelo exploratório, não calibrado. Ctrl+C cancela; resultados só são gravados ao concluir.
`;
if (process.argv.slice(2).includes("--help")) process.stdout.write(usage);
else
  try {
    const options = experimentArgs(process.argv.slice(2)),
      output = resolve(options.out);
    if (existsSync(output))
      throw Error(
        "A pasta de saída já existe; escolha outra para preservar os dados.",
      );
    if (
      !existsSync(dirname(output)) ||
      !statSync(dirname(output)).isDirectory()
    )
      throw Error("A pasta pai da saída deve existir.");
    if (options.planFile && statSync(options.planFile).size > 16384)
      throw Error("Plano excede 16KiB.");
    const plan =
      options.plan ??
      normalizeExperiment(
        JSON.parse(
          readFileSync(options.planFile!, "utf8").replace(/^\uFEFF/, ""),
        ),
      );
    const result = await runExperimentProcess(plan);
    mkdirSync(output);
    writeFileSync(resolve(output, "dados.csv"), result.csv, { flag: "wx" });
    writeFileSync(resolve(output, "manifesto.json"), result.manifest, {
      flag: "wx",
    });
    process.stdout.write(
      JSON.stringify({
        output,
        version: JSON.parse(result.manifest).modelVersion,
        ticks: plan.days * 100,
        csvSha256: JSON.parse(result.manifest).csv.sha256,
      }) + "\n",
    );
  } catch (error) {
    process.stderr.write(
      (error instanceof Error ? error.message : String(error)) + "\n",
    );
    process.exitCode = 1;
  }
