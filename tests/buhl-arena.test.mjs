import assert from "node:assert/strict";
import test from "node:test";
import { BuhlArena } from "../src/modules/benchmarks/buhl-arena/geometry.ts";
import { placeBuhlWorkers } from "../src/modules/benchmarks/buhl-arena/placement.ts";

test("arena física começa intacta e contabiliza apenas vazio ligado à superfície", () => {
  const arena = new BuhlArena(1);
  const at = (xMm, zMm) => arena.indexAt({ xMm, zMm });
  assert.equal(arena.material(at(220, 220)), "outside");
  assert.equal(arena.material(at(240, 0)), "floor");
  assert.equal(arena.material(at(0, 0)), "sand");
  assert.equal(arena.measure().voidVolumeCm3, 0);
  const analyticalVolume = (Math.PI * 100 ** 2 * 5) / 1000;
  assert.ok(
    Math.abs(arena.initialSandCells * arena.cellVolumeCm3 - analyticalVolume) <
      1,
  );
  const border = at(100, 0);
  const first = at(99, 0);
  const second = at(98, 0);
  assert.equal(arena.open(border, second), false);
  assert.equal(arena.open(first, second), false);
  assert.equal(arena.open(border, first), true);
  assert.equal(arena.open(border, first), false);
  assert.equal(arena.open(first, second), true);
  assert.equal(arena.material(second), "gallery");
  assert.deepEqual(arena.measure(), {
    initialSandCells: arena.initialSandCells,
    remainingSandCells: arena.initialSandCells - 2,
    openedCells: 2,
    voidVolumeCm3: 0.01,
  });
});

test("dispersão reproduz a seed e posiciona 200 operárias fora do disco sem sobrepor o espaçamento", () => {
  const arena = new BuhlArena();
  const points = placeBuhlWorkers(arena, "B3-DISCO", 200, 5);
  assert.equal(points.length, 200);
  assert.deepEqual(points, placeBuhlWorkers(arena, "B3-DISCO", 200, 5));
  assert.notDeepEqual(points, placeBuhlWorkers(arena, "B3-OUTRO", 200, 5));
  points.forEach((p, i) => {
    assert.equal(arena.material(arena.indexAt(p)), "floor");
    assert.ok(Math.hypot(p.xMm, p.zMm) >= 102.5);
    assert.ok(Math.hypot(p.xMm, p.zMm) <= 247.5);
    for (const q of points.slice(0, i))
      assert.ok(Math.hypot(p.xMm - q.xMm, p.zMm - q.zMm) >= 5);
  });
  assert.throws(() => new BuhlArena(0.01), /célula/);
  assert.throws(
    () => placeBuhlWorkers(arena, "B3-DISCO", 50, 200),
    /Separação incompatível/,
  );
});
