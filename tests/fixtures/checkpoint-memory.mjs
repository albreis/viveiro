export class MemoryDriver {
  records = new Map();
  pointer = null;
  fail = false;
  writes = [];
  async write(record) {
    if (this.fail) throw Error("quota");
    this.records.set(record.id, structuredClone(record));
    this.pointer = record.id;
    this.writes.push(record);
    return true;
  }
  async read(id) {
    return structuredClone(this.records.get(id) ?? null);
  }
  async current() {
    if (this.fail) throw Error("unavailable");
    return this.read(this.pointer);
  }
  async list() {
    return [...this.records.values()]
      .map((r) => ({
        id: r.id,
        createdAt: r.createdAt,
        sequence: r.sequence,
        kind: r.kind,
        label: r.label,
        seed: r.payload.world.seed,
        tick: r.payload.world.tick,
      }))
      .sort((a, b) => b.createdAt - a.createdAt);
  }
}
export class MemoryStorage {
  values = new Map();
  fail = false;
  getItem(key) {
    if (this.fail) throw Error("unavailable");
    return this.values.get(key) ?? null;
  }
  setItem(key, value) {
    if (this.fail) throw Error("quota");
    this.values.set(key, value);
  }
}
