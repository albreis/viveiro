import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { summarizeGautraisGraph } from "./gautrais-graph.ts";

const cohort = /^A(050|100|200)-\d{2}$/;
const frames = 217;
type Summary = ReturnType<typeof summarizeGautraisGraph>;

export function auditGautraisDataset(root: string) {
  const inventory = createHash("sha256");
  const finals = new Map<string, Summary>();
  const graph = (name: string) => {
    const file = join(root, name);
    if (statSync(file).size > 128 * 1024) throw Error("Grafo grande demais.");
    const text = readFileSync(file, "utf8").replaceAll("\r\n", "\n");
    inventory.update(name + "\0" + text + "\0");
    return summarizeGautraisGraph(text);
  };
  const graphFiles = (folder: string) =>
    readdirSync(join(root, folder), { withFileTypes: true })
      .filter((e) => e.isFile() && e.name.endsWith(".gra"))
      .map((e) => e.name)
      .sort();
  for (const name of graphFiles("Final")) {
    const code = name.slice(0, -4);
    if (!cohort.test(code))
      throw Error("Código de réplica final desconhecido.");
    finals.set(code, graph("Final/" + name));
  }

  let frameCount = 0;
  let seriesCount = 0;
  let parallelInFrames = 0;
  const groups = [50, 100, 200].map((workers, index) => {
    const prefix = "A" + String(workers).padStart(3, "0");
    const group = Array.from(finals).filter(([code]) =>
      code.startsWith(prefix),
    );
    if (group.length !== [5, 5, 18][index])
      throw Error(
        "Quantidade inesperada de grafos finais para " + workers + ".",
      );
    let series = 0;
    for (const [code] of group) {
      if (workers === 50) continue;
      const folder = "TimeSequences/" + prefix + "/" + code;
      const names = graphFiles(folder);
      if (names.length !== frames) throw Error("Série incompleta: " + code);
      for (let i = 1; i <= frames; i++) {
        const name = "tst" + String(i).padStart(3, "0") + ".gra";
        if (names[i - 1] !== name)
          throw Error("Quadro ausente em " + code + ".");
        parallelInFrames += graph(folder + "/" + name).parallelEdges;
        frameCount++;
      }
      series++;
      seriesCount++;
    }
    const field = (key: keyof Summary) =>
      group.map(([, summary]) => summary[key]);
    return {
      workers,
      finalGraphs: group.length,
      series,
      finalMeanNodes: field("nodes").reduce((a, b) => a + b, 0) / group.length,
      finalMeanEdges: field("edges").reduce((a, b) => a + b, 0) / group.length,
      finalMeanCycleRank:
        field("cycleRank").reduce((a, b) => a + b, 0) / group.length,
      finalParallelEdges: field("parallelEdges").reduce((a, b) => a + b, 0),
    };
  });
  return {
    schema: "viveiro-gautrais-grafos-inventario-v1",
    source: "https://doi.org/10.1371/journal.pone.0109436.s001",
    graphSetSha256: inventory.digest("hex"),
    totals: {
      finalGraphs: finals.size,
      series: seriesCount,
      frames: frameCount,
      parallelInFrames,
    },
    groups,
  };
}
