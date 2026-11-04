import assert from "node:assert/strict";
import test from "node:test";
import { summarizeGautraisGraph } from "../scripts/lib/gautrais-graph.ts";

const nodes =
  "noeud\t1\tperipheral\t0.2\t-0.9\t0.08\r\nnoeud\t2\tfront\t0.3\t-0.7\t0.05\n";

test("conta componentes e ciclos sem perder os túneis paralelos do arquivo", () => {
  const parallel = nodes + "arc\t1\t2\t0.01\narc\t2\t1\t0.02\n";
  assert.deepEqual(summarizeGautraisGraph(parallel), {
    nodes: 2,
    edges: 2,
    components: 1,
    cycleRank: 1,
    parallelEdges: 1,
  });
  assert.equal(summarizeGautraisGraph(nodes).components, 2);
  assert.equal(summarizeGautraisGraph("\n").components, 0);
});

test("rejeita nó duplicado e ligação sem um nó observado", () => {
  assert.throws(() => summarizeGautraisGraph(nodes + nodes), /Nó inválido/);
  assert.throws(
    () => summarizeGautraisGraph(nodes + "arc 1 3 0.01"),
    /dois nós existentes/,
  );
  assert.throws(
    () => summarizeGautraisGraph(nodes + "arc 1 2 0"),
    /Túnel inválido/,
  );
});
