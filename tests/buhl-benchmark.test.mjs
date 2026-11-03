import { test } from "node:test";
import assert from "node:assert/strict";
import {
  BUHL_GROUPS,
  BUHL_CURVE_HOURS,
} from "../src/modules/benchmarks/buhl-2005-data.ts";
import {
  bySource,
  compareWithBuhl,
  curveShape,
  logLogSlope,
} from "../src/modules/benchmarks/digging-compare.ts";
import { runDigging } from "../src/modules/benchmarks/digging-run.ts";
import { buhlArgs } from "../scripts/lib/buhl-args.ts";
import {
  DEFAULT_STIGMERGY,
  depositMark,
  enableStigmergy,
  joinProbability,
  markAt,
  crowdingFactor,
} from "../src/modules/soil/stigmergy.ts";
import { World } from "../src/modules/simulation/world.js";

test("dados de referência de Buhl conferem com a tabela publicada", () => {
  assert.deepEqual(
    BUHL_GROUPS.map((g) => [g.workers, g.volumeCm3]),
    [
      [50, 25.25],
      [100, 37.49],
      [200, 60.9],
    ],
  );
  for (const g of BUHL_GROUPS) {
    assert.equal(g.curveCm3.length, BUHL_CURVE_HOURS.length);
    assert.equal(g.curveCm3[0], 0);
    // Curves read from the figure end within 3 cm³ of the table.
    assert.ok(Math.abs(g.curveCm3.at(-1) - g.volumeCm3) <= 3);
    const shape = curveShape(BUHL_CURVE_HOURS, g.curveCm3);
    assert.ok(shape.atThird >= 0.4 && shape.atTwoThirds >= 0.7);
  }
  const slope = logLogSlope(
    BUHL_GROUPS.map((g) => ({ workers: g.workers, volume: g.volumeCm3 })),
  );
  assert.ok(slope > 0.6 && slope < 0.67);
});

test("métricas distinguem curva saturante de curva acelerada", () => {
  const xs = [0, 1, 2, 3, 4, 5, 6];
  const saturating = xs.map((x) => 1 - Math.exp(-x / 1.5));
  const accelerating = xs.map((x) => x * x);
  assert.ok(curveShape(xs, saturating).atThird > 0.7);
  assert.ok(curveShape(xs, accelerating).atThird < 0.2);
  assert.deepEqual(
    curveShape(
      xs,
      xs.map(() => 0),
    ),
    {
      atThird: null,
      atTwoThirds: null,
    },
  );
  assert.equal(
    logLogSlope([
      { workers: 10, volume: 10 },
      { workers: 20, volume: 20 },
    ]).toFixed(6),
    "1.000000",
  );
});

test("comparação aceita série sintética parecida com Buhl", () => {
  const runs = BUHL_GROUPS.map((g) => ({
    seed: "S",
    workers: g.workers,
    days: 3,
    samples: BUHL_CURVE_HOURS.map((h, i) => ({
      tick: h,
      removed: g.curveCm3[i],
      traffic: 0,
      workers: g.workers,
      activeProjects: 0,
      nestNodes: 0,
    })),
  }));
  const result = compareWithBuhl(runs);
  assert.equal(result.reproduced, true);
  assert.deepEqual(
    result.criteria.map((c) => c.id),
    ["atividade", "saturacao", "escala"],
  );
});

test("execução curta é reprodutível pela semente", () => {
  const a = runDigging({
    seed: "BUHL-T",
    workers: 4,
    days: 1,
    sampleEvery: 20,
  });
  const b = runDigging({
    seed: "BUHL-T",
    workers: 4,
    days: 1,
    sampleEvery: 20,
  });
  assert.deepEqual(a, b);
  assert.equal(a.samples[0].tick, 0);
  assert.equal(a.samples[0].workers, 4);
  assert.equal(a.samples.at(-1).tick, 100);
  assert.ok(a.samples.every((s) => s.removed >= 0));
});

test("argumentos inválidos falham antes de rodar", () => {
  assert.deepEqual(buhlArgs(["--out", "x"]), {
    out: "x",
    days: 3,
    seeds: 1,
    groups: [50, 100, 200],
    sampleEvery: 5,
    mode: "projetos",
    protocol: "terrario",
  });
  assert.equal(
    buhlArgs(["--out", "x", "--mode", "estigmergia"]).mode,
    "estigmergia",
  );
  assert.throws(() => buhlArgs(["--out", "x", "--mode", "outro"]), /deve ser/);
  assert.throws(() => buhlArgs([]), /--out/);
  assert.throws(() => buhlArgs(["--out", "x", "--out", "y"]), /repetida/);
  assert.throws(() => buhlArgs(["--out", "x", "--dias", "3"]), /desconhecida/);
  assert.throws(() => buhlArgs(["--out", "x", "--groups", "50"]), /dois/);
  assert.throws(() => buhlArgs(["--out", "x", "--days", "0"]), /entre/);
});

test("feromônio de escavação decai e recruta pela curva de Buhl", () => {
  const w = { tick: 0, ants: [], soil: { removed: 0 } };
  enableStigmergy(w, { k: 1, baseJoin: 0, deposit: 1, evaporation: 0.1 });
  const project = { id: 7 };
  assert.equal(joinProbability(w, project), 0);
  depositMark(w, project);
  assert.equal(markAt(w, project), 1);
  assert.equal(joinProbability(w, project), 0.5);
  w.tick = 10;
  assert.ok(Math.abs(markAt(w, project) - Math.exp(-1)) < 1e-12);
  depositMark(w, project);
  assert.ok(markAt(w, project) > 1 && joinProbability(w, project) > 0.5);
});

test("modo por feromônio é opcional e o padrão não muda", () => {
  const w = new World("SEMENTE-42");
  assert.equal(w.soil.stigmergy, undefined);
  assert.ok(DEFAULT_STIGMERGY.maxFronts > 2);
  const run = runDigging({
    seed: "BUHL-T",
    workers: 6,
    days: 1,
    sampleEvery: 20,
    setup: { mode: "estigmergia", workersOnly: true, insideNest: true },
  });
  assert.equal(run.samples[0].workers, 6);
  assert.ok(run.samples.every((s) => s.removed >= 0));
});

test("freio por densidade cai quando há mais galeria por operária", () => {
  const ants = Array.from({ length: 100 }, () => ({ kind: "worker" }));
  const w = { tick: 0, ants, soil: { removed: 2 } };
  enableStigmergy(w, { crowding: 100 });
  assert.equal(crowdingFactor(w), 1);
  w.soil.removed = 3; // 1 u³ dug: 100 workers per u³
  assert.ok(Math.abs(crowdingFactor(w) - 0.5) < 1e-12);
  w.soil.removed = 4;
  assert.ok(crowdingFactor(w) < 0.5);
});

test("medição separa terra das frentes e do trânsito sem mudar a execução", () => {
  const options = {
    seed: "BUHL-T",
    workers: 30,
    days: 2,
    sampleEvery: 20,
    setup: { mode: "estigmergia", workersOnly: true, insideNest: true },
  };
  const run = runDigging(options);
  for (const s of run.samples)
    assert.ok(s.traffic >= 0 && s.traffic <= s.removed + 1e-12);
  const [fronts] = bySource([run], "frentes"),
    [traffic] = bySource([run], "transito");
  run.samples.forEach((s, i) =>
    assert.ok(
      Math.abs(
        fronts.samples[i].removed + traffic.samples[i].removed - s.removed,
      ) < 1e-12,
    ),
  );
  assert.deepEqual(runDigging(options), run);
});
