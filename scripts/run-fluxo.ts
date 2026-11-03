import { existsSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import metadata from "../package.json" with { type: "json" };
import {
  flowShape,
  runTunnelFlow,
  type TunnelFlowResult,
} from "../src/modules/benchmarks/tunnel-flow.ts";

const usage = `Viveiro · fluxo por densidade num túnel (forma de Poissonnier et al. 2019)
Uso: npm run benchmark:fluxo -- --out ./fluxo.csv [--seed FLUXO-1]
     [--groups 2,4,8,16,32,64,128] [--ticks 700] [--link N]
Operárias vão e voltam entre as duas câmaras de um túnel usando só o movimento
de produção. Mede densidade, fluxo e velocidade. Grava um CSV novo.
`;

function parse(argv: string[]) {
  const seen = new Map<string, string>();
  for (let i = 0; i < argv.length; i += 2) {
    const name = argv[i]?.replace(/^--/, "");
    if (!["out", "seed", "groups", "ticks", "link"].includes(name))
      throw Error("Opção desconhecida: " + argv[i]);
    if (seen.has(name)) throw Error("Opção repetida: " + argv[i]);
    if (argv[i + 1] === undefined) throw Error("Opção sem valor: " + argv[i]);
    seen.set(name, argv[i + 1]);
  }
  const out = seen.get("out");
  if (!out) throw Error("Informe --out com um arquivo CSV novo.");
  const int = (v: string) => {
    if (!/^\d+$/.test(v)) throw Error("Valor inteiro esperado: " + v);
    return Number(v);
  };
  return {
    out,
    seed: seen.get("seed") ?? "FLUXO-1",
    groups: (seen.get("groups") ?? "2,4,8,16,32,64,128").split(",").map(int),
    ticks: int(seen.get("ticks") ?? "700"),
    link: seen.has("link") ? int(seen.get("link")!) : undefined,
  };
}

if (process.argv.slice(2).includes("--help")) process.stdout.write(usage);
else
  try {
    const o = parse(process.argv.slice(2)),
      output = resolve(o.out);
    if (existsSync(output)) throw Error("O arquivo de saída já existe.");
    if (
      !existsSync(dirname(output)) ||
      !statSync(dirname(output)).isDirectory()
    )
      throw Error("A pasta do arquivo de saída deve existir.");
    const results: TunnelFlowResult[] = [];
    for (const workers of o.groups) {
      process.stderr.write(`Rodando ${workers} operárias...\n`);
      results.push(
        runTunnelFlow({ seed: o.seed, workers, ticks: o.ticks, link: o.link }),
      );
    }
    const head =
      "versao,semente,operarias,tunel,comprimento,densidade,fluxo,velocidade,velocidade_livre,alargamentos,largura_final";
    const rows = results.map((r) =>
      [
        metadata.version,
        '"' + r.seed + '"',
        r.workers,
        r.link,
        r.length,
        r.density,
        r.flow,
        r.speed,
        r.nominalSpeed,
        r.widenings,
        r.finalWidth,
      ].join(","),
    );
    writeFileSync(output, [head, ...rows].join("\r\n") + "\r\n", {
      flag: "wx",
    });
    for (const r of results)
      process.stdout.write(
        `${String(r.workers).padStart(4)} operárias: densidade ${r.density.toFixed(2)}, fluxo ${r.flow.toFixed(3)}, velocidade ${r.speed.toFixed(4)}\n`,
      );
    const shape = flowShape(results);
    process.stdout.write(
      (shape.collapse
        ? "O fluxo despenca na densidade mais alta (padrão de engarrafamento humano)."
        : "O fluxo não despenca na densidade mais alta.") +
        ` Fluxo final/pico: ${shape.lastToPeak?.toFixed(2)}; velocidade final/inicial: ${shape.speedRatio?.toFixed(2)}.\n`,
    );
  } catch (error) {
    process.stderr.write(
      (error instanceof Error ? error.message : String(error)) + "\n",
    );
    process.exitCode = 1;
  }
