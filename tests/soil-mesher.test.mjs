import { test } from "node:test";
import assert from "node:assert/strict";
import { SoilMesher } from "../src/services/SoilMesher.ts";

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
