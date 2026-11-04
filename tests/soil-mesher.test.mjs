import { test } from "node:test";
import assert from "node:assert/strict";
import { SoilMesher } from "../src/services/SoilMesher.ts";
import { soilMeshData } from "../src/modules/terrain/mesh-data.ts";
import { World } from "./fixtures/established-world.mjs";

test("trocar o detalhe durante trabalho no Worker descarta a resposta antiga", () => {
  const previous = globalThis.Worker;
  let port;
  globalThis.Worker = class {
    messages = [];
    constructor() {
      port = this;
    }
    postMessage(message) {
      this.messages.push(message);
    }
    terminate() {
      this.terminated = true;
    }
  };
  try {
    const m = new SoilMesher("full");
    const nest = { revision: 7 };
    let calls = 0;
    m.request(nest, () => calls++);
    const old = port.messages[0];
    assert.equal(old.detail, "full");
    m.setDetail("light");
    port.onmessage({
      data: { revision: 7, mesh: {}, generation: old.generation },
    });
    assert.equal(calls, 0);
    assert.equal(m.busy, false);
    m.request(nest, () => calls++);
    const current = port.messages[1];
    assert.equal(current.detail, "light");
    assert.notEqual(current.generation, old.generation);
    port.onmessage({
      data: { revision: 7, mesh: {}, generation: current.generation },
    });
    assert.equal(calls, 1);
    m.dispose();
    assert.equal(port.terminated, true);
  } finally {
    globalThis.Worker = previous;
  }
});

test("a malha inicial usa o worker e mantém a geometria quando ele falha", async () => {
  const previous = globalThis.Worker;
  let port;
  globalThis.Worker = class {
    constructor() {
      port = this;
    }
    postMessage(message) {
      this.message = message;
    }
    terminate() {}
  };
  try {
    const mesher = new SoilMesher("light");
    const nest = new World("soil-worker-startup").nest;
    const expected = soilMeshData(nest, "light");
    const prepared = mesher.prepare(nest);
    assert.equal(port.message.detail, "light");
    assert.equal(mesher.busy, true);
    port.onmessage({
      data: {
        revision: nest.revision,
        mesh: expected,
        generation: port.message.generation,
      },
    });
    assert.equal(await prepared, expected);
    const fallback = mesher.prepare(nest);
    port.onerror();
    assert.deepEqual(await fallback, expected);
    assert.equal(mesher.busy, false);
  } finally {
    globalThis.Worker = previous;
  }
});
